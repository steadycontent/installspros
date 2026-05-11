import { Users, Eye, UserCheck, UserMinus, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/admin/MetricCard";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AdminOverview() {
  const { dateRange, setDateRange, overview, funnel, isLoading, error } = useAnalytics();

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Key metrics for your funnel performance
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load analytics data. Please try again.</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Metrics Grid */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <MetricCard
              title="Sessions"
              value={overview.sessions.toLocaleString()}
              icon={Users}
            />
            <MetricCard
              title="Page Views"
              value={overview.pageViews.toLocaleString()}
              icon={Eye}
            />
            <MetricCard
              title="Leads"
              value={overview.leads.toLocaleString()}
              icon={UserCheck}
            />
            <MetricCard
              title="Partial Leads"
              value={overview.partialLeads.toLocaleString()}
              subtitle="Gave phone, didn't complete"
              icon={UserMinus}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${overview.conversionRate}%`}
              subtitle="Leads / Sessions"
              icon={TrendingUp}
            />
            <MetricCard
              title="Conv Rate w/ Partials"
              value={`${overview.sessions > 0 ? Math.round(((overview.leads + overview.partialLeads) / overview.sessions) * 100 * 100) / 100 : 0}%`}
              subtitle="(Leads + Partials) / Sessions"
              icon={TrendingUp}
            />
          </div>

          {/* Funnel Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Funnel Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <FunnelChart data={funnel} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
