import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SubmissionsQuery {
  start_date: string;
  end_date: string;
  type_filter: "all" | "full" | "partial";
  page: number;
  per_page: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const params: SubmissionsQuery = await req.json();
    console.log("[admin-submissions] Query params:", JSON.stringify(params));

    if (!params.start_date || !params.end_date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: start_date, end_date" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const startDate = new Date(params.start_date);
    const endDate = new Date(params.end_date);
    endDate.setHours(23, 59, 59, 999);

    const page = params.page || 1;
    const perPage = params.per_page || 25;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const typeFilter = params.type_filter || "all";

    // Get counts for summary cards
    const { count: totalCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    const { count: fullCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .or("is_partial.is.null,is_partial.eq.false");

    const { count: partialCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .eq("is_partial", true);

    const { count: mobileCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .in("device_type", ["mobile", "tablet"]);

    const { count: desktopCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .eq("device_type", "desktop");

    // Build the filtered query for the table rows
    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())
      .order("created_at", { ascending: false })
      .range(from, to);

    if (typeFilter === "full") {
      query = query.or("is_partial.is.null,is_partial.eq.false");
    } else if (typeFilter === "partial") {
      query = query.eq("is_partial", true);
    }

    const { data: submissions, count: filteredCount, error } = await query;

    if (error) {
      console.error("[admin-submissions] Query error:", error);
      throw error;
    }

    // Domain breakdown — uses the same date range as the rest of the page.
    let domainQuery = supabase
      .from("leads")
      .select("landing_host")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    if (typeFilter === "full") {
      domainQuery = domainQuery.or("is_partial.is.null,is_partial.eq.false");
    } else if (typeFilter === "partial") {
      domainQuery = domainQuery.eq("is_partial", true);
    }
    const { data: domainRows } = await domainQuery;

    const domainCounts = new Map<string, number>();
    (domainRows || []).forEach((r: { landing_host: string | null }) => {
      const host = (r.landing_host || "").trim() || "unknown";
      domainCounts.set(host, (domainCounts.get(host) || 0) + 1);
    });
    const domainsToday = Array.from(domainCounts.entries())
      .map(([host, count]) => ({ host, count }))
      .sort((a, b) => b.count - a.count);

    const result = {
      submissions: submissions || [],
      total: totalCount || 0,
      fullCount: fullCount || 0,
      partialCount: partialCount || 0,
      mobileCount: mobileCount || 0,
      desktopCount: desktopCount || 0,
      filteredTotal: filteredCount || 0,
      domainsToday,
      page,
      perPage,
    };

    console.log("[admin-submissions] Returning", (submissions || []).length, "rows");
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[admin-submissions] Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
