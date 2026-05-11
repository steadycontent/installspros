import { useState } from "react";
import { DollarSign, MousePointer, Eye, Target, TrendingUp, BarChart3, Loader2, AlertCircle, Settings, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/admin/MetricCard";
import { DateRangeFilter, type DateRange } from "@/components/admin/DateRangeFilter";
import { useGoogleAdsAccounts } from "@/hooks/useGoogleAdsAccounts";
import { useGoogleAds, type Campaign } from "@/hooks/useGoogleAds";
import { CampaignsTable } from "@/components/admin/google-ads/CampaignsTable";
import { CampaignFormDialog } from "@/components/admin/google-ads/CampaignFormDialog";
import { Link } from "react-router-dom";
import { startOfDay, endOfDay } from "date-fns";

export default function GoogleAds() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { accounts, isLoading: isLoadingAccounts } = useGoogleAdsAccounts();
  const activeAccount = accounts.find((a) => a.is_active) ?? accounts[0] ?? null;

  const {
    summary,
    campaigns,
    isLoadingSummary,
    isLoadingCampaigns,
    error,
    mutateCampaign,
  } = useGoogleAds(activeAccount?.id ?? null, dateRange);

  const isLoading = isLoadingAccounts || isLoadingSummary;
  const needsSetup = !activeAccount || !activeAccount.customer_id;

  if (needsSetup && !isLoadingAccounts) {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Google Ads</h1>
          <p className="text-sm text-muted-foreground">Manage your Google Ads campaigns</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <Settings className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Set Up Google Ads</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Connect your Google Ads account to view campaigns, metrics, and manage ads directly from this dashboard.
            </p>
            <Button asChild>
              <Link to="/admin/google-ads/settings">Configure Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleToggleStatus = (campaign: Campaign) => {
    const newStatus = campaign.status === "ENABLED" ? "PAUSED" : "ENABLED";
    mutateCampaign.mutate({
      action: newStatus === "PAUSED" ? "pause_campaign" : "enable_campaign",
      account_id: activeAccount!.id,
      campaign_id: campaign.id,
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Google Ads</h1>
          <p className="text-sm text-muted-foreground">
            {activeAccount?.account_name ?? "Campaign performance overview"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/google-ads/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{(error as Error).message}</span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Metrics */}
      {!isLoading && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <MetricCard title="Spend" value={formatCurrency(summary.cost)} icon={DollarSign} />
            <MetricCard title="Clicks" value={summary.clicks.toLocaleString()} icon={MousePointer} />
            <MetricCard title="Impressions" value={summary.impressions.toLocaleString()} icon={Eye} />
            <MetricCard title="Conversions" value={summary.conversions.toString()} icon={Target} />
            <MetricCard title="CTR" value={`${summary.ctr}%`} icon={TrendingUp} />
            <MetricCard title="Avg CPC" value={formatCurrency(summary.avg_cpc)} icon={BarChart3} />
          </div>
        </>
      )}

      {/* Campaigns */}
      {!isLoading && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Campaigns</CardTitle>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Campaign
            </Button>
          </CardHeader>
          <CardContent>
            <CampaignsTable
              campaigns={campaigns}
              isLoading={isLoadingCampaigns}
              onToggleStatus={handleToggleStatus}
              onUpdateBudget={(campaignId, budgetMicros) => {
                mutateCampaign.mutate({
                  action: "update_budget",
                  account_id: activeAccount!.id,
                  campaign_id: campaignId,
                  budget_amount_micros: budgetMicros,
                });
              }}
              accountId={activeAccount?.id ?? ""}
            />
          </CardContent>
        </Card>
      )}

      {/* Create Campaign Dialog */}
      <CampaignFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={(data) => {
          mutateCampaign.mutate({
            action: "create_campaign",
            account_id: activeAccount!.id,
            ...data,
          });
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
}
