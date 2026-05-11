import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Rate limiting (in-memory, per-isolate) ──────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 1_000; // 1 second
const RATE_LIMIT_MAX = 10; // max events per session per window

function isRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Periodically prune stale entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}, 30_000);

// ── Validation helpers ──────────────────────────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_METADATA_BYTES = 2048;
const MAX_PAGE_PATH_LEN = 500;

interface TrackEventPayload {
  session_id: string;
  event_type: "session_start" | "page_view" | "funnel_step_view" | "cta_click" | "form_submit" | "click";
  page_path?: string;
  funnel_step?: number;
  variant_id?: string;
  metadata?: Record<string, unknown>;
  // Session creation data (only for session_start)
  user_agent?: string;
  referrer?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: TrackEventPayload = await req.json();

    // ── Input validation ──────────────────────────────────────────
    if (!payload.session_id || !payload.event_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: session_id and event_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate session_id is a proper UUID
    if (!UUID_RE.test(payload.session_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid session_id format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate event type
    const validEventTypes = ["session_start", "page_view", "funnel_step_view", "cta_click", "form_submit", "click"];
    if (!validEventTypes.includes(payload.event_type)) {
      return new Response(
        JSON.stringify({ error: "Invalid event_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Cap page_path length
    if (payload.page_path && payload.page_path.length > MAX_PAGE_PATH_LEN) {
      payload.page_path = payload.page_path.slice(0, MAX_PAGE_PATH_LEN);
    }

    // Validate funnel_step range
    if (payload.funnel_step !== undefined && payload.funnel_step !== null) {
      if (typeof payload.funnel_step !== "number" || payload.funnel_step < 0 || payload.funnel_step > 10) {
        payload.funnel_step = undefined;
      }
    }

    // Cap metadata size
    if (payload.metadata) {
      const metaStr = JSON.stringify(payload.metadata);
      if (new TextEncoder().encode(metaStr).length > MAX_METADATA_BYTES) {
        return new Response(
          JSON.stringify({ error: "metadata exceeds 2KB limit" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // ── Rate limiting ─────────────────────────────────────────────
    if (isRateLimited(payload.session_id)) {
      return new Response(
        JSON.stringify({ error: "Rate limited" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for inserting data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure session exists before inserting any event (prevents FK race condition)
    const { data: existingSession } = await supabase
      .from("analytics_sessions")
      .select("id")
      .eq("id", payload.session_id)
      .maybeSingle();

    if (!existingSession) {
      const { error: sessionError } = await supabase
        .from("analytics_sessions")
        .insert({
          id: payload.session_id,
          variant_id: payload.variant_id || null,
          user_agent: payload.user_agent?.slice(0, 500) || null,
          referrer: payload.referrer?.slice(0, 1000) || null,
        });

      if (sessionError) {
        // Another concurrent request may have created it — ignore duplicate key errors
        if (sessionError.code === "23505") {
          console.log("[track-event] Session already created by concurrent request, continuing");
        } else {
          console.error("[track-event] Error creating session:", sessionError);
          return new Response(
            JSON.stringify({ error: "Failed to create session", details: sessionError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Insert the event
    const { error: eventError } = await supabase
      .from("analytics_events")
      .insert({
        session_id: payload.session_id,
        event_type: payload.event_type,
        page_path: payload.page_path || null,
        funnel_step: payload.funnel_step ?? null,
        metadata: payload.metadata || {},
      });

    if (eventError) {
      console.error("[track-event] Error inserting event:", eventError);
      return new Response(
        JSON.stringify({ error: "Failed to insert event", details: eventError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If this is a lead event, also insert into analytics_leads
    if (payload.event_type === "form_submit" && payload.metadata?.is_lead) {
      const { error: leadError } = await supabase
        .from("analytics_leads")
        .insert({
          session_id: payload.session_id,
          variant_id: payload.variant_id || null,
          installation_type: (payload.metadata?.installation_type as string) || null,
        });

      if (leadError) {
        console.error("[track-event] Error inserting lead:", leadError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[track-event] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
