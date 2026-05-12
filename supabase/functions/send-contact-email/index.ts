import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  inquiry: string;
  message: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_agency: string;
  gclid: string;
  fbclid: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const contactData: ContactEmailRequest = await req.json();

    // Input validation
    const name = (contactData.name || "").slice(0, 100).replace(/<[^>]*>/g, "");
    const email = (contactData.email || "").slice(0, 255);
    const phone = (contactData.phone || "").slice(0, 20);
    const message = (contactData.message || "").slice(0, 2000).replace(/<[^>]*>/g, "");

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Contact form submission:", { name, email, inquiry: contactData.inquiry });

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const dbClient = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error: dbError } = await dbClient.from("contact_submissions").insert({
      name,
      email,
      phone: phone || null,
      inquiry: contactData.inquiry || null,
      message,
      utm_source: contactData.utm_source || null,
      utm_medium: contactData.utm_medium || null,
      utm_campaign: contactData.utm_campaign || null,
      utm_term: contactData.utm_term || null,
      utm_content: contactData.utm_content || null,
      utm_agency: contactData.utm_agency || null,
      gclid: contactData.gclid || null,
      fbclid: contactData.fbclid || null,
    });
    
    if (dbError) {
      console.error("DB insert error:", dbError.message);
    } else {
      console.log("Contact submission saved to database");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const GHL_CONTACT_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/7tBt5cTkqXI9MJHbK2jG/webhook-trigger/2755308f-6140-45cf-baa3-56f8bc134259";

    const webhookPromises: Promise<{ name: string; success: boolean; status?: number; error?: string }>[] = [];

    // 1. Send email via Resend API (using verified domain or fallback)
    if (RESEND_API_KEY) {
      webhookPromises.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "InstallPros <support@mail.installpros.io>",
            to: ["support@mail.installpros.io"],
            subject: `Contact Form: ${contactData.inquiry || "General Inquiry"} — ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <table style="border-collapse:collapse;width:100%;max-width:600px;">
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${phone || "Not provided"}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Inquiry</td><td style="padding:8px;border-bottom:1px solid #eee;">${contactData.inquiry || "Not specified"}</td></tr>
              </table>
              <h3 style="margin-top:20px;">Message</h3>
              <p style="background:#f9f9f9;padding:16px;border-radius:4px;">${message}</p>
              <hr style="margin-top:24px;">
              <p style="font-size:12px;color:#999;">UTM: ${contactData.utm_source || "direct"} / ${contactData.utm_medium || "-"} / ${contactData.utm_campaign || "-"} | GCLID: ${contactData.gclid || "-"} | FBCLID: ${contactData.fbclid || "-"}</p>
            `,
            reply_to: email,
          }),
        })
          .then(async (res) => {
            const text = await res.text();
            console.log("Resend response:", res.status, text);
            return { name: "Resend", success: res.ok, status: res.status };
          })
          .catch((err) => {
            console.error("Resend error:", err.message);
            return { name: "Resend", success: false, error: err.message };
          })
      );
    } else {
      console.warn("RESEND_API_KEY not configured");
    }

    // 2. Send to GHL webhook
    const ghlPayload = {
      name,
      email,
      phone,
      inquiry: contactData.inquiry || "",
      message,
      utm_source: contactData.utm_source || "",
      utm_medium: contactData.utm_medium || "",
      utm_campaign: contactData.utm_campaign || "",
      utm_term: contactData.utm_term || "",
      utm_content: contactData.utm_content || "",
      utm_agency: contactData.utm_agency || "",
      gclid: contactData.gclid || "",
      fbclid: contactData.fbclid || "",
      source_form: "contact_page",
      submitted_at: new Date().toISOString(),
    };

    webhookPromises.push(
      fetch(GHL_CONTACT_WEBHOOK_URL, {
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

    // 3. Dispatch to admin-configured webhooks for 'contact_form_submitted'
    webhookPromises.push(
      fetch(`${supabaseUrl}/functions/v1/dispatch-webhooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          trigger_event: "contact_form_submitted",
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

    const results = await Promise.all(webhookPromises);
    console.log("Results:", results);

    const anySuccess = results.some((r) => r.success);

    return new Response(
      JSON.stringify({ success: anySuccess, message: "Contact form processed", results }),
      {
        status: anySuccess ? 200 : 502,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
