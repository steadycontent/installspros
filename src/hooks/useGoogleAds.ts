import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Campaign {
  id: string;
  name: string;
  status: string;
  budget_amount_micros: string;
  bidding_strategy_type: string;
  metrics: {
    impressions: string;
    clicks: string;
    cost_micros: string;
    conversions: string;
    ctr: string;
    average_cpc: string;
  };
}

export interface AdGroup {
  id: string;
  name: string;
  status: string;
  campaign_id: string;
  cpc_bid_micros: string;
  metrics: {
    impressions: string;
    clicks: string;
    cost_micros: string;
    conversions: string;
  };
}

export interface AccountSummary {
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  avg_cpc: number;
}

interface GoogleAdsRequest {
  action: string;
  account_id: string;
  start_date?: string;
  end_date?: string;
  campaign_id?: string;
  ad_group_id?: string;
  [key: string]: unknown;
}

async function invokeGoogleAdsProxy(body: GoogleAdsRequest) {
  const { data, error } = await supabase.functions.invoke("google-ads-proxy", {
    body,
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export function useGoogleAds(accountId: string | null, dateRange?: { from: Date; to: Date }) {
  const queryClient = useQueryClient();
  const startDate = dateRange?.from?.toISOString().split("T")[0] ?? "";
  const endDate = dateRange?.to?.toISOString().split("T")[0] ?? "";

  const summaryQuery = useQuery({
    queryKey: ["google-ads", "summary", accountId, startDate, endDate],
    queryFn: () =>
      invokeGoogleAdsProxy({
        action: "get_account_summary",
        account_id: accountId!,
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!accountId && !!startDate && !!endDate,
  });

  const campaignsQuery = useQuery({
    queryKey: ["google-ads", "campaigns", accountId, startDate, endDate],
    queryFn: () =>
      invokeGoogleAdsProxy({
        action: "list_campaigns",
        account_id: accountId!,
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!accountId && !!startDate && !!endDate,
  });

  const mutateCampaign = useMutation({
    mutationFn: (body: GoogleAdsRequest) => invokeGoogleAdsProxy(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-ads", "campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["google-ads", "summary"] });
    },
  });

  const mutateAdGroup = useMutation({
    mutationFn: (body: GoogleAdsRequest) => invokeGoogleAdsProxy(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-ads", "adgroups"] });
    },
  });

  const mutateAd = useMutation({
    mutationFn: (body: GoogleAdsRequest) => invokeGoogleAdsProxy(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-ads", "ads"] });
    },
  });

  return {
    summary: summaryQuery.data as AccountSummary | undefined,
    campaigns: (campaignsQuery.data?.campaigns ?? []) as Campaign[],
    isLoadingSummary: summaryQuery.isLoading,
    isLoadingCampaigns: campaignsQuery.isLoading,
    error: summaryQuery.error || campaignsQuery.error,
    mutateCampaign,
    mutateAdGroup,
    mutateAd,
    invokeGoogleAdsProxy,
  };
}

// Separate hook for ad groups (used on campaign detail page)
export function useGoogleAdsAdGroups(
  accountId: string | null,
  campaignId: string | null,
  dateRange?: { from: Date; to: Date }
) {
  const startDate = dateRange?.from?.toISOString().split("T")[0] ?? "";
  const endDate = dateRange?.to?.toISOString().split("T")[0] ?? "";

  return useQuery({
    queryKey: ["google-ads", "adgroups", accountId, campaignId, startDate, endDate],
    queryFn: () =>
      invokeGoogleAdsProxy({
        action: "list_ad_groups",
        account_id: accountId!,
        campaign_id: campaignId!,
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!accountId && !!campaignId && !!startDate && !!endDate,
  });
}
