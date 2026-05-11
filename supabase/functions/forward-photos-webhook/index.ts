import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PhotoData {
  email: string;
  phone: string;
  photoUrls: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const photoData: PhotoData = await req.json();
    
    // Log the lead identifier (email) for association with existing lead records
    console.log("=== PHOTO SUBMISSION RECEIVED ===");
    console.log("Lead Email (primary identifier):", photoData.email);
    console.log("Lead Phone:", photoData.phone);
    console.log("Photo Count:", photoData.photoUrls?.length || 0);
    console.log("Photo URLs:", photoData.photoUrls);

    // Get Zapier webhook URL for photo forwarding
    const zapPhotoWebhookUrl = Deno.env.get("ZAP_PHOTO_PUSH");

    // Fix9 integration is currently PAUSED
    // Photos are stored in Supabase storage and logged here for reference
    // To re-enable Fix9, uncomment the code block below
    
    console.log("Fix9 integration is PAUSED - photos stored in Supabase only");

    // Forward photos to Zapier for processing/routing
    let zapierSuccess = false;
    if (zapPhotoWebhookUrl) {
      console.log("Forwarding photos to Zapier...");
      try {
        const zapierPayload = {
          event_type: "photos.submitted",
          timestamp: new Date().toISOString(),
          lead: {
            email: photoData.email,
            phone: photoData.phone,
          },
          photos: photoData.photoUrls,
          photo_count: photoData.photoUrls?.length || 0,
        };

        const zapierResponse = await fetch(zapPhotoWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(zapierPayload),
        });

        const responseText = await zapierResponse.text();
        console.log("Zapier photo webhook response:", zapierResponse.status, responseText);
        zapierSuccess = zapierResponse.ok;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Zapier photo webhook error:", errorMessage);
      }
    } else {
      console.warn("ZAP_PHOTO_PUSH not configured, skipping Zapier photo forwarding");
    }

    /*
    const fix9ApiKey = Deno.env.get("FIX9_API_KEY");
    const fix9OrgSlug = Deno.env.get("FIX9_ORG_SLUG");

    if (!fix9ApiKey || !fix9OrgSlug) {
      console.error("FIX9_API_KEY or FIX9_ORG_SLUG not configured");
      return new Response(
        JSON.stringify({ error: "Fix9 not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send photos to Fix9 HVAC
    // Note: Fix9 only accepts event_type: "lead.created", not "lead.updated"
    // Photos should be attached to the initial lead creation or via a different endpoint
    const fix9Payload = {
      event_type: "lead.created",
      received_at: new Date().toISOString(),
      lead: {
        email: photoData.email,
        phone: photoData.phone,
        custom_fields: {
          photo_urls: photoData.photoUrls,
        },
      },
    };

    console.log("Sending photos to Fix9 HVAC...", fix9Payload);

    const fix9Response = await fetch("https://zgrulcdxjemktfvqhkmh.supabase.co/functions/v1/lead-ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": fix9ApiKey,
        "x-org-slug": fix9OrgSlug,
      },
      body: JSON.stringify(fix9Payload),
    });

    const responseText = await fix9Response.text();
    console.log("Fix9 photo response:", fix9Response.status, responseText);

    if (!fix9Response.ok) {
      return new Response(
        JSON.stringify({
          success: false, 
          error: "Failed to send photos to Fix9",
          status: fix9Response.status,
          details: responseText 
        }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Photos received and stored",
        photoUrls: photoData.photoUrls,
        zapierForwarded: zapierSuccess,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in forward-photos-webhook:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);