import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action } = body;
    console.log("[manage-experiment] Action:", action);

    switch (action) {
      // ── LIST EXPERIMENTS WITH VARIANTS ──
      case "list": {
        const { data: experiments, error } = await supabase
          .from("experiments")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;

        // Fetch variants for each experiment
        const experimentIds = (experiments || []).map((e: { id: string }) => e.id);
        const { data: variants, error: vErr } = await supabase
          .from("experiment_variants")
          .select("*")
          .in("experiment_id", experimentIds);
        if (vErr) throw vErr;

        // Fetch recent events
        const { data: events, error: eErr } = await supabase
          .from("experiment_events")
          .select("*")
          .in("experiment_id", experimentIds)
          .order("created_at", { ascending: false })
          .limit(50);
        if (eErr) throw eErr;

        const result = (experiments || []).map((exp: Record<string, unknown>) => ({
          ...exp,
          variants: (variants || []).filter((v: { experiment_id: string }) => v.experiment_id === exp.id),
          events: (events || []).filter((e: { experiment_id: string }) => e.experiment_id === exp.id),
        }));

        return json(result);
      }

      // ── GET ACTIVE WEIGHTS (for client variant assignment) ──
      case "active_weights": {
        const { data: running, error } = await supabase
          .from("experiments")
          .select("id")
          .eq("status", "running")
          .limit(1)
          .maybeSingle();
        if (error) throw error;

        if (!running) {
          return json({ weights: {} });
        }

        const { data: variants, error: vErr } = await supabase
          .from("experiment_variants")
          .select("variant_id, traffic_weight")
          .eq("experiment_id", running.id);
        if (vErr) throw vErr;

        const weights: Record<string, number> = {};
        for (const v of variants || []) {
          weights[v.variant_id] = v.traffic_weight;
        }

        return json({ weights, experiment_id: running.id });
      }

      // ── PROMOTE WINNER ──
      case "promote": {
        const { experiment_id, variant_id } = body;
        if (!experiment_id || !variant_id) {
          return json({ error: "experiment_id and variant_id required" }, 400);
        }

        // Safety check: ensure minimum sessions
        // We'll check via analytics data
        const { data: sessions, error: sErr } = await supabase
          .from("analytics_sessions")
          .select("variant_id")
          .in("variant_id", [variant_id]);
        // Simple count check
        if (sErr) throw sErr;

        const sessionCount = (sessions || []).length;
        if (sessionCount < 50) {
          return json({ error: `Safety check failed: only ${sessionCount} sessions for "${variant_id}" (minimum 50 required)` }, 400);
        }

        // Set winner
        const { error: updateWinner } = await supabase
          .from("experiment_variants")
          .update({ is_winner: true, traffic_weight: 100 })
          .eq("experiment_id", experiment_id)
          .eq("variant_id", variant_id);
        if (updateWinner) throw updateWinner;

        // Set losers
        const { error: updateLosers } = await supabase
          .from("experiment_variants")
          .update({ is_winner: false, traffic_weight: 0 })
          .eq("experiment_id", experiment_id)
          .neq("variant_id", variant_id);
        if (updateLosers) throw updateLosers;

        // Mark experiment completed
        const { error: completeExp } = await supabase
          .from("experiments")
          .update({ status: "completed", ended_at: new Date().toISOString() })
          .eq("id", experiment_id);
        if (completeExp) throw completeExp;

        // Log event
        await supabase.from("experiment_events").insert({
          experiment_id,
          action: "promoted",
          variant_id,
          details: { session_count: sessionCount },
        });

        return json({ success: true, promoted: variant_id });
      }

      // ── ROLLBACK ──
      case "rollback": {
        const { experiment_id } = body;
        if (!experiment_id) {
          return json({ error: "experiment_id required" }, 400);
        }

        // Reset all variants to equal weight
        const { data: variants, error: vErr } = await supabase
          .from("experiment_variants")
          .select("id")
          .eq("experiment_id", experiment_id);
        if (vErr) throw vErr;

        const weight = variants && variants.length > 0 ? Math.floor(100 / variants.length) : 50;

        const { error: resetErr } = await supabase
          .from("experiment_variants")
          .update({ is_winner: false, traffic_weight: weight })
          .eq("experiment_id", experiment_id);
        if (resetErr) throw resetErr;

        // Re-open experiment
        const { error: reopenErr } = await supabase
          .from("experiments")
          .update({ status: "running", ended_at: null })
          .eq("id", experiment_id);
        if (reopenErr) throw reopenErr;

        // Log event
        await supabase.from("experiment_events").insert({
          experiment_id,
          action: "rolled_back",
          details: { reset_weight: weight },
        });

        return json({ success: true });
      }

      // ── UPDATE AUTO-PROMOTE SETTINGS ──
      case "update_settings": {
        const { experiment_id, auto_promote, auto_promote_min_sessions, auto_promote_min_lift } = body;
        if (!experiment_id) {
          return json({ error: "experiment_id required" }, 400);
        }

        const updates: Record<string, unknown> = {};
        if (auto_promote !== undefined) updates.auto_promote = auto_promote;
        if (auto_promote_min_sessions !== undefined) updates.auto_promote_min_sessions = auto_promote_min_sessions;
        if (auto_promote_min_lift !== undefined) updates.auto_promote_min_lift = auto_promote_min_lift;

        const { error } = await supabase
          .from("experiments")
          .update(updates)
          .eq("id", experiment_id);
        if (error) throw error;

        return json({ success: true });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (error) {
    console.error("[manage-experiment] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
