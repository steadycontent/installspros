import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Cache geo results per IP to avoid repeated lookups within the same worker
const geoCache = new Map<string, { lat: number; lon: number } | null>();

async function getGeoFromIp(ip: string): Promise<{ lat: number; lon: number } | null> {
  if (!ip || /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|::1|fd|fc)/.test(ip)) {
    return null; // Private/local IP
  }

  if (geoCache.has(ip)) {
    return geoCache.get(ip)!;
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,lat,lon`, {
      signal: AbortSignal.timeout(3000),
    });
    const data = await res.json();
    if (data.status === "success") {
      const result = { lat: data.lat, lon: data.lon };
      geoCache.set(ip, result);
      console.log(`Geo lookup for ${ip}: ${result.lat},${result.lon}`);
      return result;
    }
  } catch (e) {
    console.log("Geo lookup failed, proceeding without bias:", e);
  }

  geoCache.set(ip, null);
  return null;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { input, sessionToken, placeId } = body;
    
    const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!apiKey) {
      console.error("GOOGLE_PLACES_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Google Places API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Street View image fetch – returns a public URL of the image stored in Supabase Storage
    const { streetViewAddress } = body;
    if (streetViewAddress) {
      console.log("Fetching Street View for:", streetViewAddress);
      const svUrl = new URL("https://maps.googleapis.com/maps/api/streetview");
      svUrl.searchParams.set("size", "1200x800");
      svUrl.searchParams.set("location", streetViewAddress);
      svUrl.searchParams.set("key", apiKey);
      svUrl.searchParams.set("source", "outdoor");

      // First check metadata to see if image is available
      const metaUrl = new URL("https://maps.googleapis.com/maps/api/streetview/metadata");
      metaUrl.searchParams.set("location", streetViewAddress);
      metaUrl.searchParams.set("key", apiKey);
      metaUrl.searchParams.set("source", "outdoor");
      const metaRes = await fetch(metaUrl.toString());
      const meta = await metaRes.json();
      console.log("Street View metadata:", meta.status);

      if (meta.status !== "OK") {
        return new Response(
          JSON.stringify({ available: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch actual image
      const imgRes = await fetch(svUrl.toString());
      if (!imgRes.ok) {
        return new Response(
          JSON.stringify({ available: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const imgBlob = await imgRes.arrayBuffer();
      const imgBytes = new Uint8Array(imgBlob);

      // Upload to Supabase Storage
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const filePath = `lighting/streetview-${crypto.randomUUID()}.jpg`;
      const { error: uploadErr } = await supabaseAdmin.storage
        .from("property-photos")
        .upload(filePath, imgBytes, { contentType: "image/jpeg", upsert: false });

      if (uploadErr) {
        console.error("Storage upload error:", uploadErr);
        return new Response(
          JSON.stringify({ available: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: pubUrl } = supabaseAdmin.storage.from("property-photos").getPublicUrl(filePath);

      return new Response(
        JSON.stringify({ available: true, imageUrl: pubUrl.publicUrl }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If placeId is provided, fetch place details to get full address with ZIP
    if (placeId) {
      console.log("Fetching place details for placeId:", placeId);
      
      const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      detailsUrl.searchParams.set("place_id", placeId);
      detailsUrl.searchParams.set("fields", "formatted_address,address_components");
      detailsUrl.searchParams.set("key", apiKey);
      if (sessionToken) {
        detailsUrl.searchParams.set("sessiontoken", sessionToken);
      }

      const detailsResponse = await fetch(detailsUrl.toString());
      const detailsData = await detailsResponse.json();

      console.log("Place details response status:", detailsData.status);

      if (detailsData.status !== "OK") {
        console.error("Place Details API error:", detailsData.status, detailsData.error_message);
        return new Response(
          JSON.stringify({ error: detailsData.error_message || detailsData.status }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const addressComponents = detailsData.result?.address_components || [];
      const getComponent = (types: string[]) => {
        const component = addressComponents.find((c: any) => 
          types.some(t => c.types.includes(t))
        );
        return component?.long_name || component?.short_name || "";
      };

      const getShortComponent = (types: string[]) => {
        const component = addressComponents.find((c: any) => 
          types.some(t => c.types.includes(t))
        );
        return component?.short_name || component?.long_name || "";
      };

      const city = getComponent(["locality"]) || 
                   getComponent(["sublocality_level_1"]) || 
                   getComponent(["administrative_area_level_2"]) ||
                   getComponent(["sublocality"]);

      const placeDetails = {
        formattedAddress: detailsData.result?.formatted_address || "",
        street: `${getComponent(["street_number"])} ${getComponent(["route"])}`.trim(),
        city: city,
        state: getShortComponent(["administrative_area_level_1"]),
        zip: getComponent(["postal_code"]),
        country: getShortComponent(["country"]),
      };

      console.log("Extracted place details:", placeDetails);

      return new Response(
        JSON.stringify({ placeDetails }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Regular autocomplete flow
    if (!input || input.length < 2) {
      console.log("Input too short:", input);
      return new Response(
        JSON.stringify({ predictions: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching autocomplete predictions for:", input);

    // Get user location from IP for bias
    const clientIp = getClientIp(req);
    const geo = await getGeoFromIp(clientIp);

    const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    url.searchParams.set("input", input);
    url.searchParams.set("types", "address");
    url.searchParams.set("components", "country:us");
    url.searchParams.set("key", apiKey);
    if (sessionToken) {
      url.searchParams.set("sessiontoken", sessionToken);
    }
    if (geo) {
      url.searchParams.set("location", `${geo.lat},${geo.lon}`);
      url.searchParams.set("radius", "80000");
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    console.log("Google API response status:", data.status, geo ? `(biased to ${geo.lat},${geo.lon})` : "(no bias)");

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", data.status, data.error_message);
      return new Response(
        JSON.stringify({ error: data.error_message || data.status }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const extractZipFromDescription = (desc: string): string | null => {
      const zipMatch = desc.match(/\b(\d{5})(?:-\d{4})?\b(?=,?\s*USA|$)/);
      return zipMatch ? zipMatch[1] : null;
    };

    const predictions = (data.predictions || []).map((p: any) => ({
      placeId: p.place_id,
      description: p.description,
      mainText: p.structured_formatting?.main_text,
      secondaryText: p.structured_formatting?.secondary_text,
      zip: extractZipFromDescription(p.description),
    }));

    console.log(`Returning ${predictions.length} predictions`);

    return new Response(
      JSON.stringify({ predictions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in google-places-autocomplete:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
