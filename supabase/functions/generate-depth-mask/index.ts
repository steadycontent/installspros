import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) throw new Error("imageUrl is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    console.log("Generating foreground mask for:", imageUrl);

    // Fetch image and convert to base64 (chunk to avoid stack overflow)
    const imgResp = await fetch(imageUrl);
    if (!imgResp.ok) throw new Error("Failed to fetch image");
    const imgBuffer = await imgResp.arrayBuffer();
    const bytes = new Uint8Array(imgBuffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    const mimeType = imgResp.headers.get("content-type") || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Call Gemini image model to generate foreground mask
    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Look at this photo of a house. I need you to create a FOREGROUND MASK image. 
                  
Rules:
- Identify all foreground objects that are BETWEEN THE CAMERA AND THE HOUSE/ROOFLINE. This includes: trees, tree branches, bushes, shrubs, columns, pillars, overhangs, or any objects that would obstruct a view of the roofline.
- Create an image the EXACT same dimensions as the input.
- The foreground objects should be rendered exactly as they appear in the original photo (full color, full detail).
- Everything else (sky, house, roof, ground, pool, etc.) should be PURE BLACK (rgb 0,0,0).
- The result should look like the foreground objects are "cut out" and placed on a black background.
- Be very precise with edges - include leaves, branches, and fine details.
- Do NOT include the house itself, only things IN FRONT OF the house.`,
                },
                {
                  type: "image_url",
                  image_url: { url: dataUrl },
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error: ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    const maskDataUrl =
      aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!maskDataUrl) {
      console.log("AI response had no image, returning no mask");
      return new Response(JSON.stringify({ maskUrl: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upload mask to storage
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Extract base64 data from data URL
    const b64Data = maskDataUrl.split(",")[1];
    const binaryStr = atob(b64Data);
    const maskBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      maskBytes[i] = binaryStr.charCodeAt(i);
    }

    const maskPath = `lighting/masks/${crypto.randomUUID()}.png`;
    const uploadResp = await fetch(
      `${SUPABASE_URL}/storage/v1/object/property-photos/${maskPath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "image/png",
          "x-upsert": "true",
        },
        body: maskBytes,
      }
    );

    if (!uploadResp.ok) {
      console.error("Mask upload failed:", await uploadResp.text());
      // Return the data URL directly as fallback
      return new Response(JSON.stringify({ maskUrl: maskDataUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/property-photos/${maskPath}`;
    console.log("Mask generated and uploaded:", publicUrl);

    return new Response(JSON.stringify({ maskUrl: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-depth-mask error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
