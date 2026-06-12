import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AssessmentEmailRequest {
  email: string;
  propertyName?: string;
  industry?: string;
  sites?: string;
  acreage?: string;
  currentIsp?: string;
  phone?: string;
}

const esc = (s: string) =>
  String(s || "").replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c]!)
  );

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const data: AssessmentEmailRequest = await req.json();
    const email = (data.email || "").trim().slice(0, 255);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY missing");
      return new Response(JSON.stringify({ ok: false, error: "Email not configured" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const propertyName = esc(data.propertyName || "your property");

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff;">
        <div style="text-align:center;padding:24px 0;border-bottom:2px solid #1E90FF;">
          <h1 style="color:#1E90FF;margin:0;font-size:24px;letter-spacing:0.05em;">INSTALLPROS</h1>
          <p style="color:#9ca3af;margin:8px 0 0;font-size:12px;letter-spacing:0.18em;">FREE PROPERTY ASSESSMENT</p>
        </div>
        <div style="padding:24px 0;">
          <h2 style="color:#fff;font-size:22px;margin:0 0 16px;">We received your request</h2>
          <p style="color:#d1d5db;line-height:1.6;">Thanks for requesting a free connectivity assessment for <strong>${propertyName}</strong>.</p>
          <p style="color:#d1d5db;line-height:1.6;">A specialist from our commercial team will reach out within <strong>one business day</strong> with:</p>
          <ul style="color:#d1d5db;line-height:1.8;">
            <li>Coverage feasibility for your property</li>
            <li>Recommended equipment plan</li>
            <li>Revenue & ROI model</li>
          </ul>
          <p style="color:#d1d5db;line-height:1.6;">In the meantime, if you have questions, call us at <a href="tel:5126756605" style="color:#1E90FF;text-decoration:none;"><strong>(512) 675-6605</strong></a>.</p>
        </div>
        <div style="padding:16px 0;border-top:1px solid #1f2937;color:#6b7280;font-size:12px;text-align:center;">
          InstallPros &middot; Commercial WiFi & Starlink &middot; 30,000+ installs, 37 states
        </div>
      </div>
    `;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "InstallPros <noreply@installspros.com>",
        to: [email],
        subject: "Your Free Property Assessment Request - InstallPros",
        html,
      }),
    });

    const result = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ ok: false, error: result }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("send-assessment-email error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
