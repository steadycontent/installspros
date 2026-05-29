import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { FunnelAIInsights } from "@/components/admin/FunnelAIInsights";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import FunnelManagerCard from "@/components/admin/FunnelManagerCard";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AdminFunnel() {
  const { dateRange, setDateRange, funnel, overview, heatmap, activeHeatmapStep, setActiveHeatmapStep, isLoading, isLoadingHeatmap, error } = useAnalytics();

  // Sync heatmap step when funnel chart step changes
  const handleStepChange = (step: number) => {
    setActiveHeatmapStep(step);
  };

  // Calculate totals
  const firstStep = funnel[0];
  const lastStep = funnel[funnel.length - 1];
  const overallDropOff = firstStep && lastStep && firstStep.users > 0
    ? Math.round(((firstStep.users - lastStep.users) / firstStep.users) * 100)
    : 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funnel Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Step-by-step progression through your quote flow
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      <FunnelManagerCard />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load funnel data. Please try again.</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Funnel Content */}
      {!isLoading && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Started Funnel</p>
                <p className="text-2xl font-bold text-foreground">
                  {(firstStep?.users || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Completed Funnel</p>
                <p className="text-2xl font-bold text-foreground">
                  {(lastStep?.users || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Overall Drop-off</p>
                <p className="text-2xl font-bold text-orange-500">
                  {overallDropOff}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Funnel + Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Breakdown</CardTitle>
              <CardDescription>
                See where users drop off and click in your quote flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FunnelChart
                data={funnel}
                onStepChange={handleStepChange}
                heatmapClicks={heatmap.clicks}
                heatmapTotalClicks={heatmap.totalClicks}
                isLoadingHeatmap={isLoadingHeatmap}
              />
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <FunnelAIInsights funnel={funnel} overview={overview} />
        </>
      )}
    </div>
  );
}
