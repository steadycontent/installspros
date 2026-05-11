import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGoogleAdsAccounts } from "@/hooks/useGoogleAdsAccounts";
import { useGoogleAds, useGoogleAdsAdGroups } from "@/hooks/useGoogleAds";
import { AdGroupFormDialog } from "@/components/admin/google-ads/AdGroupFormDialog";
import { DateRangeFilter, type DateRange } from "@/components/admin/DateRangeFilter";
import { startOfDay, endOfDay } from "date-fns";

export default function GoogleAdsCampaignDetail() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });
  const [showAdGroupDialog, setShowAdGroupDialog] = useState(false);

  const { accounts } = useGoogleAdsAccounts();
  const activeAccount = accounts.find((a) => a.is_active) ?? accounts[0] ?? null;

  const { mutateAdGroup } = useGoogleAds(activeAccount?.id ?? null, dateRange);
  const adGroupsQuery = useGoogleAdsAdGroups(activeAccount?.id ?? null, campaignId ?? null, dateRange);

  const adGroups = adGroupsQuery?.data?.ad_groups ?? [];
  const isLoading = adGroupsQuery?.isLoading ?? true;
  const error = adGroupsQuery?.error;

  const formatMicros = (micros: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parseInt(micros) / 1_000_000);

  const statusColor = (status: string) => {
    switch (status) {
      case "ENABLED": return "default" as const;
      case "PAUSED": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/google-ads"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Campaign Detail</h1>
            <p className="text-sm text-muted-foreground">Campaign ID: {campaignId}</p>
          </div>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{(error as Error).message}</span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Ad Groups</CardTitle>
            <Button size="sm" onClick={() => setShowAdGroupDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Ad Group
            </Button>
          </CardHeader>
          <CardContent>
            {adGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No ad groups found for this campaign.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">CPC Bid</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Impressions</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adGroups.map((ag: any) => (
                    <TableRow key={ag.id}>
                      <TableCell className="font-medium">{ag.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusColor(ag.status)}>{ag.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatMicros(ag.cpc_bid_micros)}</TableCell>
                      <TableCell className="text-right">{parseInt(ag.metrics.clicks).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{parseInt(ag.metrics.impressions).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{formatMicros(ag.metrics.cost_micros)}</TableCell>
                      <TableCell className="text-right">{parseFloat(ag.metrics.conversions).toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <AdGroupFormDialog
        open={showAdGroupDialog}
        onOpenChange={setShowAdGroupDialog}
        onSubmit={(data) => {
          mutateAdGroup.mutate({
            action: "create_ad_group",
            account_id: activeAccount!.id,
            campaign_id: campaignId!,
            ...data,
          });
          setShowAdGroupDialog(false);
        }}
      />
    </div>
  );
}
