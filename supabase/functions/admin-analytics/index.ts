import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AnalyticsQuery {
  start_date: string;
  end_date: string;
  query_type: "overview" | "funnel" | "variants" | "heatmap";
  funnel_step?: number; // for heatmap query
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const params: AnalyticsQuery = await req.json();
    console.log("[admin-analytics] Query params:", JSON.stringify(params));

    // Validate required fields
    if (!params.start_date || !params.end_date || !params.query_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: start_date, end_date, query_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const startDate = new Date(params.start_date);
    const endDate = new Date(params.end_date);
    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999);

    let result: unknown;

    switch (params.query_type) {
      case "overview": {
        // Get total sessions in date range
        const { count: sessionsCount, error: sessionsError } = await supabase
          .from("analytics_sessions")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        if (sessionsError) {
          console.error("[admin-analytics] Sessions error:", sessionsError);
          throw sessionsError;
        }

        // Get page views count
        const { count: pageViewsCount, error: pvError } = await supabase
          .from("analytics_events")
          .select("*", { count: "exact", head: true })
          .eq("event_type", "page_view")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        if (pvError) {
          console.error("[admin-analytics] Page views error:", pvError);
          throw pvError;
        }

        // Get leads count from the leads table (source of truth)
        const { count: leadsCount, error: leadsError } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .or("is_partial.is.null,is_partial.eq.false");

        if (leadsError) {
          console.error("[admin-analytics] Leads error:", leadsError);
          throw leadsError;
        }

        const sessions = sessionsCount || 0;
        const leads = leadsCount || 0;
        const conversionRate = sessions > 0 ? (leads / sessions) * 100 : 0;

        // Get partial leads: sessions that reached funnel step 3 (phone) but have no lead record
        const { data: phoneStepSessions, error: phoneStepError } = await supabase
          .from("analytics_events")
          .select("session_id")
          .eq("event_type", "funnel_step_view")
          .eq("funnel_step", 3)
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        if (phoneStepError) {
          console.error("[admin-analytics] Phone step error:", phoneStepError);
          throw phoneStepError;
        }

        // Get lead session IDs to subtract
        const { data: leadSessions, error: leadSessionsError } = await supabase
          .from("analytics_leads")
          .select("session_id")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        if (leadSessionsError) {
          console.error("[admin-analytics] Lead sessions error:", leadSessionsError);
          throw leadSessionsError;
        }

        const leadSessionIds = new Set((leadSessions || []).map(l => l.session_id));
        const uniquePhoneSessions = new Set((phoneStepSessions || []).map(e => e.session_id));
        const partialLeads = [...uniquePhoneSessions].filter(id => !leadSessionIds.has(id)).length;

        result = {
          sessions,
          pageViews: pageViewsCount || 0,
          leads,
          partialLeads,
          conversionRate: Math.round(conversionRate * 100) / 100,
        };
        break;
      }

      case "funnel": {
        // Get funnel step views with counts
        const { data: funnelData, error: funnelError } = await supabase
          .from("analytics_events")
          .select("funnel_step, session_id")
          .eq("event_type", "funnel_step_view")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .not("funnel_step", "is", null);

        if (funnelError) {
          console.error("[admin-analytics] Funnel error:", funnelError);
          throw funnelError;
        }

        // Count unique sessions per step
        const stepCounts: Record<number, Set<string>> = {};
        for (const event of funnelData || []) {
          const step = event.funnel_step as number;
          if (!stepCounts[step]) {
            stepCounts[step] = new Set();
          }
          stepCounts[step].add(event.session_id);
        }

        // Build funnel array with drop-off rates
        const funnelSteps = [
          { step: 0, name: "Site Visitor" },
          { step: 1, name: "Name" },
          { step: 2, name: "Phone" },
          { step: 3, name: "Email" },
          { step: 4, name: "Address" },
        ];

        const funnelResult = funnelSteps.map((stepDef, index) => {
          const count = stepCounts[stepDef.step]?.size || 0;
          const prevCount = index > 0 ? (stepCounts[funnelSteps[index - 1].step]?.size || 0) : count;
          const dropOffRate = prevCount > 0 && index > 0 
            ? ((prevCount - count) / prevCount) * 100 
            : 0;

          return {
            step: stepDef.step,
            name: stepDef.name,
            users: count,
            dropOffRate: Math.round(dropOffRate * 10) / 10,
          };
        });

        result = { funnel: funnelResult };
        break;
      }

      case "variants": {
        // Get sessions grouped by variant
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("analytics_sessions")
          .select("id, variant_id")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        if (sessionsError) {
          console.error("[admin-analytics] Sessions error:", sessionsError);
          throw sessionsError;
        }

        // Get leads grouped by variant
        const { data: leadsData, error: leadsError } = await supabase
          .from("analytics_leads")
          .select("session_id, variant_id")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        if (leadsError) {
          console.error("[admin-analytics] Leads error:", leadsError);
          throw leadsError;
        }

        // Aggregate by variant
        const variantStats: Record<string, { sessions: number; leads: number }> = {};

        for (const session of sessionsData || []) {
          const variant = session.variant_id || "default";
          if (!variantStats[variant]) {
            variantStats[variant] = { sessions: 0, leads: 0 };
          }
          variantStats[variant].sessions++;
        }

        for (const lead of leadsData || []) {
          const variant = lead.variant_id || "default";
          if (!variantStats[variant]) {
            variantStats[variant] = { sessions: 0, leads: 0 };
          }
          variantStats[variant].leads++;
        }

        const variantsResult = Object.entries(variantStats).map(([variant, stats]) => ({
          variant,
          sessions: stats.sessions,
          leads: stats.leads,
          conversionRate: stats.sessions > 0 
            ? Math.round((stats.leads / stats.sessions) * 100 * 100) / 100 
            : 0,
        }));

        result = { variants: variantsResult };
        break;
      }

      case "heatmap": {
        const funnelStep = params.funnel_step;
        
        // Query click events, optionally filtered by funnel_step
        let query = supabase
          .from("analytics_events")
          .select("metadata")
          .eq("event_type", "click")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString());

        if (funnelStep !== undefined && funnelStep !== null) {
          query = query.eq("funnel_step", funnelStep);
        }

        let clickData: typeof query extends Promise<{ data: infer D }> ? D : any = null;
        let clickError: any = null;

        // Retry once on transient connection errors
        for (let attempt = 0; attempt < 2; attempt++) {
          const result = await query.limit(5000);
          clickData = result.data;
          clickError = result.error;
          if (!clickError) break;
          console.warn(`[admin-analytics] Heatmap attempt ${attempt + 1} failed:`, clickError.message);
          if (attempt === 0) await new Promise(r => setTimeout(r, 500));
        }

        if (clickError) {
          console.error("[admin-analytics] Heatmap error after retries:", clickError);
          // Return empty heatmap instead of crashing the whole function
          return new Response(
            JSON.stringify({ step: funnelStep ?? 0, clicks: [], totalClicks: 0, error: "Heatmap data temporarily unavailable" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Aggregate clicks into grid cells (5% x 5% buckets)
        const BUCKET_SIZE = 5;
        const buckets: Record<string, { x: number; y: number; count: number; tags: Record<string, number>; texts: string[] }> = {};

        for (const event of clickData || []) {
          const meta = event.metadata as Record<string, unknown> | null;
          if (!meta || typeof meta.click_x !== "number" || typeof meta.click_y !== "number") continue;

          const bx = Math.floor((meta.click_x as number) / BUCKET_SIZE) * BUCKET_SIZE + BUCKET_SIZE / 2;
          const by = Math.floor((meta.click_y as number) / BUCKET_SIZE) * BUCKET_SIZE + BUCKET_SIZE / 2;
          const key = `${bx},${by}`;

          if (!buckets[key]) {
            buckets[key] = { x: bx, y: by, count: 0, tags: {}, texts: [] };
          }
          buckets[key].count++;

          const tag = (meta.element_tag as string) || "unknown";
          buckets[key].tags[tag] = (buckets[key].tags[tag] || 0) + 1;

          const text = (meta.element_text as string) || "";
          if (text && buckets[key].texts.length < 3 && !buckets[key].texts.includes(text)) {
            buckets[key].texts.push(text);
          }
        }

        const clicks = Object.values(buckets).map(b => {
          const topTag = Object.entries(b.tags).sort((a, c) => c[1] - a[1])[0]?.[0];
          return {
            x: b.x,
            y: b.y,
            count: b.count,
            element_tag: topTag,
            element_text: b.texts[0] || undefined,
          };
        });

        result = {
          step: funnelStep ?? null,
          clicks,
          totalClicks: (clickData || []).length,
        };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid query_type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log("[admin-analytics] Query successful:", params.query_type);
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[admin-analytics] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
