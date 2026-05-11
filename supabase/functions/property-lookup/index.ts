import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();

    if (!address || typeof address !== "string") {
      return new Response(
        JSON.stringify({ error: "Address is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("RENTCAST_API_KEY");
    if (!apiKey) {
      console.error("RENTCAST_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Property lookup unavailable", fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const encoded = encodeURIComponent(address);
    const url = `https://api.rentcast.io/v1/properties?address=${encoded}`;

    const res = await fetch(url, {
      headers: { "X-Api-Key": apiKey, Accept: "application/json" },
    });

    if (!res.ok) {
      console.error("RentCast API error:", res.status, await res.text());
      return new Response(
        JSON.stringify({ error: "Property lookup failed", fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const property = Array.isArray(data) ? data[0] : data;

    if (!property) {
      return new Response(
        JSON.stringify({ error: "No property found", fallback: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract relevant fields
    const result = {
      squareFootage: property.squareFootage || property.buildingSize || null,
      stories: property.stories || null,
      lotSize: property.lotSize || null,
      yearBuilt: property.yearBuilt || null,
      propertyType: property.propertyType || null,
      bedrooms: property.bedrooms || null,
      bathrooms: property.bathrooms || null,
    };

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Property lookup error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", fallback: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
