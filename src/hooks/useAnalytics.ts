import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, startOfDay, endOfDay } from "date-fns";
import type { OverviewMetrics, FunnelData, VariantsData, HeatmapData } from "@/lib/analytics/types";
import type { DateRange } from "@/components/admin/DateRangeFilter";

const defaultDateRange: DateRange = {
  from: startOfDay(new Date()),
  to: endOfDay(new Date()),
};

export function useAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [activeHeatmapStep, setActiveHeatmapStep] = useState<number>(0);

  const { data: overview, isLoading: isLoadingOverview, error: overviewError } = useQuery({
    queryKey: ["admin-analytics", "overview", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async (): Promise<OverviewMetrics> => {
      const { data, error } = await supabase.functions.invoke("admin-analytics", {
        body: {
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          query_type: "overview",
        },
      });
      if (error) throw error;
      return data as OverviewMetrics;
    },
    staleTime: 30000,
  });

  const { data: funnel, isLoading: isLoadingFunnel, error: funnelError } = useQuery({
    queryKey: ["admin-analytics", "funnel", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async (): Promise<FunnelData> => {
      const { data, error } = await supabase.functions.invoke("admin-analytics", {
        body: {
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          query_type: "funnel",
        },
      });
      if (error) throw error;
      return data as FunnelData;
    },
    staleTime: 30000,
  });

  const { data: variants, isLoading: isLoadingVariants, error: variantsError } = useQuery({
    queryKey: ["admin-analytics", "variants", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async (): Promise<VariantsData> => {
      const { data, error } = await supabase.functions.invoke("admin-analytics", {
        body: {
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          query_type: "variants",
        },
      });
      if (error) throw error;
      return data as VariantsData;
    },
    staleTime: 30000,
  });

  const { data: heatmap, isLoading: isLoadingHeatmap } = useQuery({
    queryKey: ["admin-analytics", "heatmap", dateRange.from.toISOString(), dateRange.to.toISOString(), activeHeatmapStep],
    queryFn: async (): Promise<HeatmapData> => {
      const { data, error } = await supabase.functions.invoke("admin-analytics", {
        body: {
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          query_type: "heatmap",
          funnel_step: activeHeatmapStep,
        },
      });
      if (error) throw error;
      return data as HeatmapData;
    },
    staleTime: 30000,
  });

  return {
    dateRange,
    setDateRange,
    overview: overview || { sessions: 0, pageViews: 0, leads: 0, partialLeads: 0, conversionRate: 0 },
    funnel: funnel?.funnel || [],
    variants: variants?.variants || [],
    heatmap: heatmap || { step: activeHeatmapStep, clicks: [], totalClicks: 0 },
    activeHeatmapStep,
    setActiveHeatmapStep,
    isLoading: isLoadingOverview || isLoadingFunnel || isLoadingVariants,
    isLoadingHeatmap,
    error: overviewError || funnelError || variantsError,
  };
}
