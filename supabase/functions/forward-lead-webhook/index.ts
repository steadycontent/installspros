import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LeadData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  installationType: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_agency: string;
  gclid: string;
  fbclid: string;
  is_partial?: boolean;
  variant_id?: string;
  session_id?: string;
  device_type?: string;
  landing_host?: string;
  lead_type?: string;
  property_meta?: Record<string, unknown>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const raw = await req.json();

    const sanitize = (val: unknown, maxLen = 500): string => {
      if (typeof val !== "string") return "";
      return val.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
    };

    const rawDevice = sanitize(raw.device_type, 20).toLowerCase();
    const deviceType = ["mobile", "tablet", "desktop"].includes(rawDevice) ? rawDevice : "";

    const leadData: LeadData = {
      name: sanitize(raw.name, 100),
      email: sanitize(raw.email, 255),
      phone: sanitize(raw.phone, 20),
      street: sanitize(raw.street, 200),
      city: sanitize(raw.city, 100),
      state: sanitize(raw.state, 50),
      zip: sanitize(raw.zip, 10),
      installationType: sanitize(raw.installationType, 50),
      utm_source: sanitize(raw.utm_source, 200),
      utm_medium: sanitize(raw.utm_medium, 200),
      utm_campaign: sanitize(raw.utm_campaign, 200),
      utm_term: sanitize(raw.utm_term, 200),
      utm_content: sanitize(raw.utm_content, 200),
      utm_agency: sanitize(raw.utm_agency, 200),
      gclid: sanitize(raw.gclid, 200),
      fbclid: sanitize(raw.fbclid, 200),
      is_partial: raw.is_partial === true,
      variant_id: sanitize(raw.variant_id, 50),
      session_id: sanitize(raw.session_id, 100),
      device_type: deviceType,
      landing_host: sanitize(raw.landing_host, 253).toLowerCase(),
      lead_type: ["residential", "commercial"].includes(raw.lead_type) ? raw.lead_type : "residential",
      property_meta: raw.property_meta && typeof raw.property_meta === "object" ? raw.property_meta : undefined,
    };

    const fullAddress = [leadData.street, leadData.city, leadData.state, leadData.zip]
      .filter(Boolean)
      .join(", ");

    console.log("Received lead data:", {
      name: leadData.name,
      email: leadData.email,
      installationType: leadData.installationType,
      device_type: leadData.device_type,
      utm_source: leadData.utm_source,
      gclid: leadData.gclid,
    });

    // Save lead to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const dbClient = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await dbClient.from("leads").insert({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      street: leadData.street,
      city: leadData.city,
      state: leadData.state,
      zip: leadData.zip,
      installation_type: leadData.installationType,
      is_partial: leadData.is_partial || false,
      utm_source: leadData.utm_source || null,
      utm_medium: leadData.utm_medium || null,
      utm_campaign: leadData.utm_campaign || null,
      utm_term: leadData.utm_term || null,
      utm_content: leadData.utm_content || null,
      utm_agency: leadData.utm_agency || null,
      gclid: leadData.gclid || null,
      fbclid: leadData.fbclid || null,
      variant_id: leadData.variant_id || null,
      session_id: leadData.session_id || null,
      device_type: leadData.device_type || null,
      landing_host: leadData.landing_host || null,
      lead_type: leadData.lead_type || "residential",
      property_meta: leadData.property_meta ?? null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError.message);
    } else {
      console.log("Lead saved to database");
    }

    const isCommercial = leadData.lead_type === "commercial";
    const zapierLeadIngestUrl = isCommercial
      ? Deno.env.get("ZAPIER_ASSESSMENT_INGEST")
      : Deno.env.get("ZAPIER_LEAD_INGEST");
    const zapierSecretName = isCommercial ? "ZAPIER_ASSESSMENT_INGEST" : "ZAPIER_LEAD_INGEST";
    console.log(`[forward-lead-webhook] Zapier route: ${leadData.lead_type} → ${zapierSecretName}`);
    const leadConnectorUrl = Deno.env.get("LEADCONNECTOR_WEBHOOK_URL");

    const pm = (leadData.property_meta ?? {}) as Record<string, unknown>;
    const assessmentFields = isCommercial
      ? {
          property_name: String(pm.property_name ?? ""),
          industry: String(pm.industry ?? ""),
          sites: String(pm.sites ?? ""),
          acreage: String(pm.acreage ?? ""),
          current_isp: String(pm.current_isp ?? ""),
        }
      : {};

    const zapierPayload = {
      event_type: "lead.created",
      timestamp: new Date().toISOString(),
      source: "installpros-quote-form",
      data: {
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        street: leadData.street || "",
        city: leadData.city || "",
        state: leadData.state || "",
        zip: leadData.zip || "",
        address: fullAddress,
        installation_type: leadData.installationType,
        utm_source: leadData.utm_source || "",
        utm_medium: leadData.utm_medium || "",
        utm_campaign: leadData.utm_campaign || "",
        utm_term: leadData.utm_term || "",
        utm_content: leadData.utm_content || "",
        utm_agency: leadData.utm_agency || "",
        gclid: leadData.gclid || "",
        is_partial: leadData.is_partial || false,
        device_type: leadData.device_type || "",
        ...assessmentFields,
      },
    };

    const leadConnectorPayload = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      street: leadData.street || "",
      city: leadData.city || "",
      state: leadData.state || "",
      zip: leadData.zip || "",
      address: fullAddress,
      installation_type: leadData.installationType,
      utm_source: leadData.utm_source || "",
      utm_medium: leadData.utm_medium || "",
      utm_campaign: leadData.utm_campaign || "",
      utm_term: leadData.utm_term || "",
      utm_content: leadData.utm_content || "",
      utm_agency: leadData.utm_agency || "",
      gclid: leadData.gclid || "",
      is_partial: leadData.is_partial || false,
      device_type: leadData.device_type || "",
    };

    const webhookPromises: Promise<{ name: string; success: boolean; status?: number; error?: string }>[] = [];

    if (zapierLeadIngestUrl) {
      console.log("Sending to Zapier Lead Ingest...");
      webhookPromises.push(
        fetch(zapierLeadIngestUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(zapierPayload),
        })
          .then(async (res) => {
            const text = await res.text();
            console.log("Zapier Lead Ingest response:", res.status, text);
            return { name: "ZapierLeadIngest", success: res.ok, status: res.status };
          })
          .catch((err) => {
            console.error("Zapier Lead Ingest error:", err.message);
            return { name: "ZapierLeadIngest", success: false, error: err.message };
          })
      );
    } else {
      console.warn(`${zapierSecretName} not configured, skipping Zapier`);
    }

    if (leadConnectorUrl) {
      console.log("Sending to LeadConnector webhook...");
      webhookPromises.push(
        fetch(leadConnectorUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadConnectorPayload),
        })
          .then(async (res) => {
            const text = await res.text();
            console.log("LeadConnector response:", res.status, text);
            return { name: "LeadConnector", success: res.ok, status: res.status };
          })
          .catch((err) => {
            console.error("LeadConnector error:", err.message);
            return { name: "LeadConnector", success: false, error: err.message };
          })
      );
    } else {
      console.warn("LEADCONNECTOR_WEBHOOK_URL not configured, skipping LeadConnector");
    }

    const ghlWebhookUrl = "https://services.leadconnectorhq.com/hooks/7tBt5cTkqXI9MJHbK2jG/webhook-trigger/2755308f-6140-45cf-baa3-56f8bc134259";
    const ghlPayload = {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || "",
      street: leadData.street || "",
      city: leadData.city || "",
      state: leadData.state || "",
      zip: leadData.zip || "",
      address: fullAddress,
      installation_type: leadData.installationType || "",
      utm_source: leadData.utm_source || "",
      utm_medium: leadData.utm_medium || "",
      utm_campaign: leadData.utm_campaign || "",
      utm_term: leadData.utm_term || "",
      utm_content: leadData.utm_content || "",
      utm_agency: leadData.utm_agency || "",
      gclid: leadData.gclid || "",
      fbclid: leadData.fbclid || "",
      is_partial: leadData.is_partial || false,
      device_type: leadData.device_type || "",
      submitted_at: new Date().toISOString(),
    };

    // Secondary GHL webhook (new automation in GoHighLevel)
    const ghlWebhookUrl2 = "https://services.leadconnectorhq.com/hooks/9TaD6DG4s1QhvlIXi10N/webhook-trigger/6aa5d35c-baef-4afe-9048-a657b290a0b5";
    console.log("Sending to GHL webhook (secondary)...", { gclid: ghlPayload.gclid });
    webhookPromises.push(
      fetch(ghlWebhookUrl2, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload),
      })
        .then(async (res) => {
          const text = await res.text();
          console.log("GHL (secondary) response:", res.status, text);
          return { name: "GHL_secondary", success: res.ok, status: res.status };
        })
        .catch((err) => {
          console.error("GHL (secondary) error:", err.message);
          return { name: "GHL_secondary", success: false, error: err.message };
        })
    );

    console.log("Sending to GHL webhook...", ghlPayload);
    webhookPromises.push(
      fetch(ghlWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload),
      })
        .then(async (res) => {
          const text = await res.text();
          console.log("GHL response:", res.status, text);
          return { name: "GHL", success: res.ok, status: res.status };
        })
        .catch((err) => {
          console.error("GHL error:", err.message);
          return { name: "GHL", success: false, error: err.message };
        })
    );

    webhookPromises.push(
      fetch(`${supabaseUrl}/functions/v1/dispatch-webhooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          trigger_event: leadData.is_partial ? "lead_partial_submitted" : "lead_created",
          payload: ghlPayload,
        }),
      })
        .then(async (res) => {
          const text = await res.text();
          console.log("dispatch-webhooks response:", res.status, text);
          return { name: "dispatch-webhooks", success: res.ok, status: res.status };
        })
        .catch((err) => {
          console.error("dispatch-webhooks error:", err.message);
          return { name: "dispatch-webhooks", success: false, error: err.message };
        })
    );

    console.log("Fix9 integration is currently PAUSED");

    const results = await Promise.all(webhookPromises);
    console.log("Webhook results:", results);

    const anySuccess = results.some((r) => r.success);

    return new Response(
      JSON.stringify({ success: anySuccess, message: "Lead forwarded", results }),
      { status: anySuccess ? 200 : 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in forward-lead-webhook:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
