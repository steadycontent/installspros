import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse action from body
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      // empty body is fine, defaults to sync
    }
    const action = (body.action as string) || "sync";

    // ── record-sale ──
    if (action === "record-sale") {
      const amount = body.amount as number;
      if (typeof amount !== "number" || amount <= 0) {
        return new Response(
          JSON.stringify({ error: "amount must be a positive number" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const variantId = (body.variant_id as string) || null;

      // Current 4-hour window
      const now = new Date();
      const periodStart = new Date(now.getTime() - 4 * 60 * 60 * 1000);
      const startISO = periodStart.toISOString();
      const endISO = now.toISOString();

      // Find existing row for this window + variant
      let query = supabase
        .from("kpis")
        .select("id, sale_amount, sale_count")
        .gte("period_start", startISO)
        .lte("period_end", endISO);

      if (variantId) {
        query = query.eq("variant_id", variantId);
      } else {
        query = query.is("variant_id", null);
      }

      const { data: rows } = await query.order("created_at", { ascending: false }).limit(1);

      if (rows && rows.length > 0) {
        const row = rows[0];
        const { error: updateError } = await supabase
          .from("kpis")
          .update({
            sale_amount: (row.sale_amount || 0) + amount,
            sale_count: (row.sale_count || 0) + 1,
          })
          .eq("id", row.id);
        if (updateError) throw updateError;
        console.log(`[sync-kpis] record-sale: updated row ${row.id} +$${amount}`);
      } else {
        // Insert minimal row with sale data
        const { error: insertError } = await supabase.from("kpis").insert({
          period_start: startISO,
          period_end: endISO,
          sale_amount: amount,
          sale_count: 1,
          variant_id: variantId,
        });
        if (insertError) throw insertError;
        console.log(`[sync-kpis] record-sale: inserted new row with $${amount}`);
      }

      return new Response(
        JSON.stringify({ success: true, action: "record-sale", amount }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── sync (default) ──
    // Determine the 4-hour window ending now
    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - 4 * 60 * 60 * 1000);

    const startISO = periodStart.toISOString();
    const endISO = periodEnd.toISOString();

    console.log(`[sync-kpis] Computing metrics for ${startISO} → ${endISO}`);

    // 1. Sessions count
    const { count: sessions } = await supabase
      .from("analytics_sessions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    // 2. Page views count
    const { count: pageViews } = await supabase
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("event_type", "page_view")
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    // 3. Funnel step counts (unique sessions per step)
    const { data: funnelEvents } = await supabase
      .from("analytics_events")
      .select("funnel_step, session_id")
      .eq("event_type", "funnel_step_view")
      .gte("created_at", startISO)
      .lte("created_at", endISO)
      .not("funnel_step", "is", null);

    const stepSessions: Record<number, Set<string>> = {};
    for (const e of funnelEvents || []) {
      const step = e.funnel_step as number;
      if (!stepSessions[step]) stepSessions[step] = new Set();
      stepSessions[step].add(e.session_id);
    }

    const funnelStep = (n: number) => stepSessions[n]?.size || 0;

    // 4. Leads count
    const { count: leads } = await supabase
      .from("analytics_leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    // 5. Partial leads (reached phone step 2 but no lead record)
    const { data: phoneSessions } = await supabase
      .from("analytics_events")
      .select("session_id")
      .eq("event_type", "funnel_step_view")
      .eq("funnel_step", 2)
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    const { data: leadSessions } = await supabase
      .from("analytics_leads")
      .select("session_id")
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    const leadIds = new Set((leadSessions || []).map((l) => l.session_id));
    const uniquePhone = new Set((phoneSessions || []).map((e) => e.session_id));
    const partialLeads = [...uniquePhone].filter((id) => !leadIds.has(id)).length;

    // 6. Conversion rate
    const sessionsVal = sessions || 0;
    const leadsVal = leads || 0;
    const conversionRate =
      sessionsVal > 0
        ? Math.round((leadsVal / sessionsVal) * 100 * 100) / 100
        : 0;

    // Insert aggregate KPI row
    const { error: insertError } = await supabase.from("kpis").insert({
      period_start: startISO,
      period_end: endISO,
      sessions: sessionsVal,
      page_views: pageViews || 0,
      funnel_step_0: funnelStep(0),
      funnel_step_1: funnelStep(1),
      funnel_step_2: funnelStep(2),
      funnel_step_3: funnelStep(3),
      funnel_step_4: funnelStep(4),
      leads: leadsVal,
      partial_leads: partialLeads,
      conversion_rate: conversionRate,
      sale_amount: 0,
      sale_count: 0,
    });

    if (insertError) {
      console.error("[sync-kpis] Insert error:", insertError);
      throw insertError;
    }

    // --- Variant breakdowns ---
    const { data: variantSessions } = await supabase
      .from("analytics_sessions")
      .select("id, variant_id")
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    const { data: variantLeads } = await supabase
      .from("analytics_leads")
      .select("session_id, variant_id")
      .gte("created_at", startISO)
      .lte("created_at", endISO);

    const variants: Record<string, { sessions: number; leads: number }> = {};
    for (const s of variantSessions || []) {
      const v = s.variant_id || "default";
      if (!variants[v]) variants[v] = { sessions: 0, leads: 0 };
      variants[v].sessions++;
    }
    for (const l of variantLeads || []) {
      const v = l.variant_id || "default";
      if (!variants[v]) variants[v] = { sessions: 0, leads: 0 };
      variants[v].leads++;
    }

    const variantRows = Object.entries(variants).map(([variant, stats]) => ({
      period_start: startISO,
      period_end: endISO,
      sessions: stats.sessions,
      page_views: 0,
      funnel_step_0: 0,
      funnel_step_1: 0,
      funnel_step_2: 0,
      funnel_step_3: 0,
      funnel_step_4: 0,
      leads: stats.leads,
      partial_leads: 0,
      conversion_rate:
        stats.sessions > 0
          ? Math.round((stats.leads / stats.sessions) * 100 * 100) / 100
          : 0,
      sale_amount: 0,
      sale_count: 0,
      variant_id: variant,
    }));

    if (variantRows.length > 0) {
      const { error: variantError } = await supabase
        .from("kpis")
        .insert(variantRows);
      if (variantError) {
        console.error("[sync-kpis] Variant insert error:", variantError);
      }
    }

    console.log(
      `[sync-kpis] Done. Aggregate + ${variantRows.length} variant rows written.`
    );

    return new Response(
      JSON.stringify({ success: true, period: { start: startISO, end: endISO } }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[sync-kpis] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
