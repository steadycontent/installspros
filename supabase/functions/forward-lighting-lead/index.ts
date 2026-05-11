import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const sanitize = (val: unknown, maxLen = 500): string => {
  if (typeof val !== "string") return "";
  return val.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const raw = await req.json();

    const lead = {
      street: sanitize(raw.street, 500),
      city: sanitize(raw.city, 100),
      state: sanitize(raw.state, 50),
      zip: sanitize(raw.zip, 20),
      full_address: sanitize(raw.full_address, 500),
      photo_urls: raw.photo_urls || [],
      light_config: raw.light_config || {},
      property_data: raw.property_data || {},
      estimated_linear_feet: typeof raw.estimated_linear_feet === "number" ? raw.estimated_linear_feet : null,
      estimated_range_low: typeof raw.estimated_range_low === "number" ? raw.estimated_range_low : null,
      estimated_range_high: typeof raw.estimated_range_high === "number" ? raw.estimated_range_high : null,
      name: sanitize(raw.name, 100),
      email: sanitize(raw.email, 255),
      phone: sanitize(raw.phone, 20),
      preferred_timeframe: sanitize(raw.preferred_timeframe, 50),
      wants_nighttime_render: !!raw.wants_nighttime_render,
      wants_starlink_bundle: !!raw.wants_starlink_bundle,
      utm_source: sanitize(raw.utm_source, 200),
      utm_medium: sanitize(raw.utm_medium, 200),
      utm_campaign: sanitize(raw.utm_campaign, 200),
      utm_term: sanitize(raw.utm_term, 200),
      utm_content: sanitize(raw.utm_content, 200),
      gclid: sanitize(raw.gclid, 200),
      fbclid: sanitize(raw.fbclid, 200),
      session_id: sanitize(raw.session_id, 100),
    };

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("lighting_leads").insert(lead);

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save lead" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Future: forward to webhook when LIGHTING_LEAD_WEBHOOK_URL is configured
    const webhookUrl = Deno.env.get("LIGHTING_LEAD_WEBHOOK_URL");
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...lead, source: "installpros-lighting-studio" }),
        });
      } catch (e) {
        console.error("Webhook forward error:", e);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Forward lighting lead error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
