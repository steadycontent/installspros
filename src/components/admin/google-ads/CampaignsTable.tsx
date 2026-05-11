import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Pause, Play, ExternalLink } from "lucide-react";
import { BudgetEditPopover } from "./BudgetEditPopover";
import type { Campaign } from "@/hooks/useGoogleAds";

interface CampaignsTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onToggleStatus: (campaign: Campaign) => void;
  onUpdateBudget: (campaignId: string, budgetMicros: string) => void;
  accountId: string;
}

export function CampaignsTable({ campaigns, isLoading, onToggleStatus, onUpdateBudget, accountId }: CampaignsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No campaigns found for this date range.</p>;
  }

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Budget/Day</TableHead>
          <TableHead className="text-right">Clicks</TableHead>
          <TableHead className="text-right">Impressions</TableHead>
          <TableHead className="text-right">Cost</TableHead>
          <TableHead className="text-right">Conv</TableHead>
          <TableHead className="text-right">CTR</TableHead>
          <TableHead className="text-right">Avg CPC</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Link
                to={`/admin/google-ads/campaigns/${c.id}`}
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant={statusColor(c.status)}>{c.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <BudgetEditPopover
                currentBudgetMicros={c.budget_amount_micros}
                onSave={(micros) => onUpdateBudget(c.id, micros)}
              />
            </TableCell>
            <TableCell className="text-right">{parseInt(c.metrics.clicks).toLocaleString()}</TableCell>
            <TableCell className="text-right">{parseInt(c.metrics.impressions).toLocaleString()}</TableCell>
            <TableCell className="text-right">{formatMicros(c.metrics.cost_micros)}</TableCell>
            <TableCell className="text-right">{parseFloat(c.metrics.conversions).toFixed(1)}</TableCell>
            <TableCell className="text-right">{(parseFloat(c.metrics.ctr) * 100).toFixed(2)}%</TableCell>
            <TableCell className="text-right">{formatMicros(c.metrics.average_cpc)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(c)}
                  title={c.status === "ENABLED" ? "Pause" : "Enable"}
                >
                  {c.status === "ENABLED" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/admin/google-ads/campaigns/${c.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
