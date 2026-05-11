import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { funnel_data, overview_data } = await req.json();

    if (!funnel_data || !overview_data) {
      return new Response(
        JSON.stringify({ error: "Missing funnel_data or overview_data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert conversion rate optimization (CRO) analyst for a home services lead generation website (Starlink & smart home installations). You analyze funnel data and provide actionable, specific recommendations.

Your tone is direct and data-driven. Focus on:
1. Identifying the biggest drop-off points and WHY they might be happening
2. Specific A/B test ideas to improve each problematic step
3. Quick wins vs. longer-term experiments
4. Industry benchmarks for comparison

Format your response as JSON with this structure:
{
  "summary": "1-2 sentence overall assessment",
  "health_score": number (1-100),
  "critical_issues": [{ "step": number, "issue": "string", "impact": "high|medium|low" }],
  "recommendations": [{ "title": "string", "description": "string", "priority": "high|medium|low", "type": "quick_win|ab_test|redesign", "expected_impact": "string" }],
  "benchmarks": { "overall_conversion": "string comparing to industry avg", "biggest_opportunity": "string" }
}

Keep recommendations to 3-5 max. Be specific — don't say "improve the form", say exactly what to change.`;

    const userPrompt = `Analyze this funnel data for a Starlink/smart home installation quote flow:

**Overview:**
- Sessions: ${overview_data.sessions}
- Leads: ${overview_data.leads}
- Partial Leads (reached phone but didn't finish): ${overview_data.partialLeads}
- Conversion Rate: ${overview_data.conversionRate}%

**Funnel Steps:**
${funnel_data.map((s: any) => `- Step ${s.step} (${s.name}): ${s.users} users, ${s.dropOffRate}% drop-off`).join('\n')}

Provide your CRO analysis.`;

    const response = await fetch(LOVABLE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_completion_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[analyze-funnel] AI API error:", response.status, errText);
      throw new Error(`AI API call failed [${response.status}]: ${errText}`);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    const analysis = JSON.parse(content);

    return new Response(
      JSON.stringify(analysis),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[analyze-funnel] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
