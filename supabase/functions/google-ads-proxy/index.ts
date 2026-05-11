const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

interface RequestBody {
  action: string;
  account_id: string;
  start_date?: string;
  end_date?: string;
  campaign_id?: string;
  ad_group_id?: string;
  ad_id?: string;
  // Mutate fields
  name?: string;
  status?: string;
  budget_amount_micros?: string;
  cpc_bid_micros?: string;
  bidding_strategy_type?: string;
  headlines?: string[];
  descriptions?: string[];
  final_urls?: string[];
}

// Refresh OAuth2 access token
async function refreshAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth2 token refresh failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Execute a GAQL query
async function gaqlQuery(
  customerId: string,
  developerToken: string,
  accessToken: string,
  query: string
) {
  const url = `https://googleads.googleapis.com/v18/customers/${customerId}/googleAds:searchStream`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Ads API error: ${err}`);
  }

  const data = await res.json();
  // searchStream returns array of result batches
  const results: any[] = [];
  if (Array.isArray(data)) {
    for (const batch of data) {
      if (batch.results) results.push(...batch.results);
    }
  }
  return results;
}

// Execute a mutate operation
async function mutateResource(
  customerId: string,
  developerToken: string,
  accessToken: string,
  resourceType: string,
  operations: any[]
) {
  const url = `https://googleads.googleapis.com/v18/customers/${customerId}/${resourceType}:mutate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": developerToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ operations }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Ads mutate error: ${err}`);
  }

  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Check admin role using service role client
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData } = await serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request
    const body: RequestBody = await req.json();
    const { action, account_id } = body;

    if (!action || !account_id) {
      return new Response(JSON.stringify({ error: "action and account_id are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch account credentials
    const { data: account, error: accountError } = await serviceClient
      .from("google_ads_accounts")
      .select("*")
      .eq("id", account_id)
      .single();

    if (accountError || !account) {
      return new Response(JSON.stringify({ error: "Google Ads account not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if credentials are configured
    if (!account.developer_token || !account.client_id || !account.client_secret || !account.refresh_token || !account.customer_id) {
      return new Response(JSON.stringify({ 
        error: "Google Ads credentials not configured",
        needs_setup: true 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get access token
    const accessToken = await refreshAccessToken(
      account.client_id,
      account.client_secret,
      account.refresh_token
    );

    const customerId = account.customer_id.replace(/-/g, "");
    let result: any;

    switch (action) {
      case "get_account_summary": {
        const { start_date, end_date } = body;
        const query = `
          SELECT
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc
          FROM customer
          WHERE segments.date BETWEEN '${start_date}' AND '${end_date}'
        `;
        const rows = await gaqlQuery(customerId, account.developer_token, accessToken, query);
        
        let impressions = 0, clicks = 0, costMicros = 0, conversions = 0;
        for (const row of rows) {
          const m = row.metrics;
          impressions += parseInt(m.impressions || "0");
          clicks += parseInt(m.clicks || "0");
          costMicros += parseInt(m.costMicros || "0");
          conversions += parseFloat(m.conversions || "0");
        }
        
        result = {
          impressions,
          clicks,
          cost: costMicros / 1_000_000,
          conversions: Math.round(conversions * 100) / 100,
          ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
          avg_cpc: clicks > 0 ? Math.round((costMicros / clicks) / 10) / 100 : 0,
        };
        break;
      }

      case "list_campaigns": {
        const { start_date, end_date } = body;
        const query = `
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.campaign_budget,
            campaign.bidding_strategy_type,
            campaign_budget.amount_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc
          FROM campaign
          WHERE segments.date BETWEEN '${start_date}' AND '${end_date}'
            AND campaign.status != 'REMOVED'
          ORDER BY metrics.cost_micros DESC
        `;
        const rows = await gaqlQuery(customerId, account.developer_token, accessToken, query);
        result = {
          campaigns: rows.map((r: any) => ({
            id: r.campaign.id,
            name: r.campaign.name,
            status: r.campaign.status,
            budget_resource: r.campaign.campaignBudget,
            budget_amount_micros: r.campaignBudget?.amountMicros || "0",
            bidding_strategy_type: r.campaign.biddingStrategyType || "UNKNOWN",
            metrics: {
              impressions: r.metrics.impressions || "0",
              clicks: r.metrics.clicks || "0",
              cost_micros: r.metrics.costMicros || "0",
              conversions: r.metrics.conversions || "0",
              ctr: r.metrics.ctr || "0",
              average_cpc: r.metrics.averageCpc || "0",
            },
          })),
        };
        break;
      }

      case "get_campaign": {
        const { campaign_id, start_date, end_date } = body;
        const query = `
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.campaign_budget,
            campaign.bidding_strategy_type,
            campaign_budget.amount_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc
          FROM campaign
          WHERE campaign.id = ${campaign_id}
            AND segments.date BETWEEN '${start_date}' AND '${end_date}'
        `;
        const rows = await gaqlQuery(customerId, account.developer_token, accessToken, query);
        result = rows[0] || null;
        break;
      }

      case "list_ad_groups": {
        const { campaign_id, start_date, end_date } = body;
        const query = `
          SELECT
            ad_group.id,
            ad_group.name,
            ad_group.status,
            ad_group.campaign,
            ad_group.cpc_bid_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions
          FROM ad_group
          WHERE campaign.id = ${campaign_id}
            AND ad_group.status != 'REMOVED'
            ${start_date ? `AND segments.date BETWEEN '${start_date}' AND '${end_date}'` : ""}
          ORDER BY metrics.clicks DESC
        `;
        const rows = await gaqlQuery(customerId, account.developer_token, accessToken, query);
        result = {
          ad_groups: rows.map((r: any) => ({
            id: r.adGroup.id,
            name: r.adGroup.name,
            status: r.adGroup.status,
            campaign_id: campaign_id,
            cpc_bid_micros: r.adGroup.cpcBidMicros || "0",
            metrics: {
              impressions: r.metrics.impressions || "0",
              clicks: r.metrics.clicks || "0",
              cost_micros: r.metrics.costMicros || "0",
              conversions: r.metrics.conversions || "0",
            },
          })),
        };
        break;
      }

      case "list_ads": {
        const { ad_group_id, start_date, end_date } = body;
        const query = `
          SELECT
            ad_group_ad.ad.id,
            ad_group_ad.ad.name,
            ad_group_ad.status,
            ad_group_ad.ad.type,
            ad_group_ad.ad.responsive_search_ad.headlines,
            ad_group_ad.ad.responsive_search_ad.descriptions,
            ad_group_ad.ad.final_urls,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions
          FROM ad_group_ad
          WHERE ad_group.id = ${ad_group_id}
            AND ad_group_ad.status != 'REMOVED'
            ${start_date ? `AND segments.date BETWEEN '${start_date}' AND '${end_date}'` : ""}
        `;
        const rows = await gaqlQuery(customerId, account.developer_token, accessToken, query);
        result = {
          ads: rows.map((r: any) => {
            const ad = r.adGroupAd?.ad || {};
            const rsa = ad.responsiveSearchAd || {};
            return {
              id: ad.id,
              name: ad.name || "",
              status: r.adGroupAd?.status || "UNKNOWN",
              type: ad.type || "UNKNOWN",
              headlines: (rsa.headlines || []).map((h: any) => h.text),
              descriptions: (rsa.descriptions || []).map((d: any) => d.text),
              final_urls: ad.finalUrls || [],
              metrics: {
                impressions: r.metrics?.impressions || "0",
                clicks: r.metrics?.clicks || "0",
                cost_micros: r.metrics?.costMicros || "0",
                conversions: r.metrics?.conversions || "0",
              },
            };
          }),
        };
        break;
      }

      case "create_campaign": {
        const { name: campName, budget_amount_micros, bidding_strategy_type } = body;
        // First create budget
        const budgetResult = await mutateResource(
          customerId, account.developer_token, accessToken,
          "campaignBudgets",
          [{ create: { name: `${campName} Budget`, amountMicros: budget_amount_micros, deliveryMethod: "STANDARD" } }]
        );
        const budgetResource = budgetResult.results[0].resourceName;

        // Then create campaign
        const campOps = [{
          create: {
            name: campName,
            status: "PAUSED",
            advertisingChannelType: "SEARCH",
            campaignBudget: budgetResource,
            biddingStrategyType: bidding_strategy_type || "MANUAL_CPC",
            networkSettings: {
              targetGoogleSearch: true,
              targetSearchNetwork: false,
              targetContentNetwork: false,
            },
          },
        }];
        result = await mutateResource(customerId, account.developer_token, accessToken, "campaigns", campOps);
        break;
      }

      case "update_campaign":
      case "pause_campaign":
      case "enable_campaign":
      case "remove_campaign": {
        const { campaign_id } = body;
        const resourceName = `customers/${customerId}/campaigns/${campaign_id}`;
        let updateFields: any = {};
        let updateMask = "";

        if (action === "pause_campaign") {
          updateFields = { resourceName, status: "PAUSED" };
          updateMask = "status";
        } else if (action === "enable_campaign") {
          updateFields = { resourceName, status: "ENABLED" };
          updateMask = "status";
        } else if (action === "remove_campaign") {
          updateFields = { resourceName, status: "REMOVED" };
          updateMask = "status";
        } else {
          const { name: updName, status: updStatus } = body;
          updateFields = { resourceName };
          const masks: string[] = [];
          if (updName) { updateFields.name = updName; masks.push("name"); }
          if (updStatus) { updateFields.status = updStatus; masks.push("status"); }
          updateMask = masks.join(",");
        }

        result = await mutateResource(customerId, account.developer_token, accessToken, "campaigns", [
          { update: updateFields, updateMask },
        ]);
        break;
      }

      case "update_budget": {
        const { campaign_id, budget_amount_micros } = body;
        // First get the budget resource
        const budgetQuery = `SELECT campaign.campaign_budget FROM campaign WHERE campaign.id = ${campaign_id}`;
        const budgetRows = await gaqlQuery(customerId, account.developer_token, accessToken, budgetQuery);
        if (!budgetRows.length) throw new Error("Campaign not found");
        const budgetResourceName = budgetRows[0].campaign.campaignBudget;

        result = await mutateResource(customerId, account.developer_token, accessToken, "campaignBudgets", [
          { update: { resourceName: budgetResourceName, amountMicros: budget_amount_micros }, updateMask: "amount_micros" },
        ]);
        break;
      }

      case "create_ad_group": {
        const { campaign_id, name: agName, cpc_bid_micros } = body;
        result = await mutateResource(customerId, account.developer_token, accessToken, "adGroups", [
          {
            create: {
              name: agName,
              campaign: `customers/${customerId}/campaigns/${campaign_id}`,
              status: "ENABLED",
              type: "SEARCH_STANDARD",
              cpcBidMicros: cpc_bid_micros || "1000000",
            },
          },
        ]);
        break;
      }

      case "update_ad_group": {
        const { ad_group_id, name: agUpdName, cpc_bid_micros, status: agStatus } = body;
        const resourceName = `customers/${customerId}/adGroups/${ad_group_id}`;
        const updateFields: any = { resourceName };
        const masks: string[] = [];
        if (agUpdName) { updateFields.name = agUpdName; masks.push("name"); }
        if (cpc_bid_micros) { updateFields.cpcBidMicros = cpc_bid_micros; masks.push("cpc_bid_micros"); }
        if (agStatus) { updateFields.status = agStatus; masks.push("status"); }

        result = await mutateResource(customerId, account.developer_token, accessToken, "adGroups", [
          { update: updateFields, updateMask: masks.join(",") },
        ]);
        break;
      }

      case "create_ad": {
        const { ad_group_id, headlines, descriptions, final_urls } = body;
        result = await mutateResource(customerId, account.developer_token, accessToken, "adGroupAds", [
          {
            create: {
              adGroup: `customers/${customerId}/adGroups/${ad_group_id}`,
              status: "ENABLED",
              ad: {
                responsiveSearchAd: {
                  headlines: (headlines || []).map((h: string) => ({ text: h })),
                  descriptions: (descriptions || []).map((d: string) => ({ text: d })),
                },
                finalUrls: final_urls || ["https://installpros.io"],
              },
            },
          },
        ]);
        break;
      }

      case "update_ad": {
        // Ads can't be directly updated in Google Ads — must remove and recreate
        return new Response(JSON.stringify({ error: "Ads must be removed and recreated. Use remove + create_ad instead." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update_bid": {
        const { ad_group_id, cpc_bid_micros } = body;
        const resourceName = `customers/${customerId}/adGroups/${ad_group_id}`;
        result = await mutateResource(customerId, account.developer_token, accessToken, "adGroups", [
          { update: { resourceName, cpcBidMicros: cpc_bid_micros }, updateMask: "cpc_bid_micros" },
        ]);
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("google-ads-proxy error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
