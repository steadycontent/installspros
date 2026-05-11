import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, Trophy, RotateCcw, Flame, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { VariantTable } from "@/components/admin/VariantTable";
import { VariantComparisonChart } from "@/components/admin/VariantComparisonChart";
import { VariantEmptyState } from "@/components/admin/VariantEmptyState";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "sonner";

interface ExperimentVariant {
  id: string;
  experiment_id: string;
  variant_id: string;
  is_winner: boolean;
  traffic_weight: number;
}

interface ExperimentEvent {
  id: string;
  experiment_id: string;
  action: string;
  variant_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

interface Experiment {
  id: string;
  name: string;
  description: string | null;
  status: string;
  auto_promote: boolean;
  auto_promote_min_sessions: number;
  auto_promote_min_lift: number;
  started_at: string;
  ended_at: string | null;
  variants: ExperimentVariant[];
  events: ExperimentEvent[];
}

async function invokeExperiment(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("manage-experiment", { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export default function AdminVariants() {
  const { dateRange, setDateRange, variants, isLoading, error } = useAnalytics();
  const queryClient = useQueryClient();
  const [selectedWinner, setSelectedWinner] = useState<string>("");

  // Fetch experiments
  const { data: experiments, isLoading: isLoadingExperiments } = useQuery({
    queryKey: ["experiments"],
    queryFn: async () => {
      const result = await invokeExperiment({ action: "list" });
      return result as Experiment[];
    },
  });

  const activeExperiment = experiments?.find(e => e.status === "running") || experiments?.[0];
  const currentWinner = activeExperiment?.variants.find(v => v.is_winner);

  // Promote mutation
  const promoteMutation = useMutation({
    mutationFn: async (variantId: string) => {
      return invokeExperiment({
        action: "promote",
        experiment_id: activeExperiment!.id,
        variant_id: variantId,
      });
    },
    onSuccess: (_, variantId) => {
      toast.success(`"${variantId}" promoted as winner — receiving 100% traffic`);
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // Rollback mutation
  const rollbackMutation = useMutation({
    mutationFn: async () => {
      return invokeExperiment({
        action: "rollback",
        experiment_id: activeExperiment!.id,
      });
    },
    onSuccess: () => {
      toast.success("Rolled back — traffic split reset to equal weights");
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      setSelectedWinner("");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // Auto-promote toggle
  const autoPromoteMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return invokeExperiment({
        action: "update_settings",
        experiment_id: activeExperiment!.id,
        auto_promote: enabled,
      });
    },
    onSuccess: (_, enabled) => {
      toast.success(enabled ? "Auto-promotion enabled" : "Auto-promotion disabled");
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // Find best performer
  const bestVariant = variants.length > 0
    ? variants.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      )
    : null;

  const controlVariant = variants.find(v => v.variant === "control");

  const hasData = variants.length > 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Variant Comparison</h1>
          <p className="text-sm text-muted-foreground">
            Compare performance and promote winning variants
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load variant data. Please try again.</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Variants Content */}
      {!isLoading && !error && (
        <>
          {hasData ? (
            <>
              {/* Best Performer Highlight */}
              {bestVariant && bestVariant.sessions > 10 && (
                <Card className="border-green-500/30 bg-green-500/5">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Best Performing Variant</p>
                    <p className="text-xl font-bold text-foreground">
                      <code className="bg-muted px-1.5 py-0.5 rounded">{bestVariant.variant}</code>
                      <span className="ml-2 text-green-600">{bestVariant.conversionRate}% conversion</span>
                    </p>
                    {controlVariant && bestVariant.variant !== "control" && controlVariant.conversionRate > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.round(((bestVariant.conversionRate - controlVariant.conversionRate) / controlVariant.conversionRate) * 100)}% lift vs control
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Visual Charts */}
              <VariantComparisonChart data={variants} />

              {/* Variants Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Variants</CardTitle>
                  <CardDescription>
                    Sessions, leads, and conversion rates by variant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VariantTable data={variants} />
                </CardContent>
              </Card>

              {/* ── EXPERIMENT MANAGEMENT ── */}
              {activeExperiment && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          Winner Promotion
                        </CardTitle>
                        <CardDescription>
                          {activeExperiment.name} — {activeExperiment.status === "completed" ? "Completed" : "Running"}
                        </CardDescription>
                      </div>
                      <Badge variant={activeExperiment.status === "running" ? "default" : "secondary"}>
                        {activeExperiment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Variant Performance Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {variants.map(v => {
                        const lift = controlVariant && v.variant !== "control" && controlVariant.conversionRate > 0
                          ? Math.round(((v.conversionRate - controlVariant.conversionRate) / controlVariant.conversionRate) * 100)
                          : 0;
                        const expVariant = activeExperiment.variants.find(ev => ev.variant_id === v.variant);
                        return (
                          <div key={v.variant} className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <code className="text-sm font-medium">{v.variant}</code>
                              <div className="flex items-center gap-1">
                                {expVariant?.is_winner && (
                                  <Badge variant="default" className="text-[10px] bg-yellow-500 text-yellow-950">Winner</Badge>
                                )}
                                <Badge variant="outline" className="text-[10px]">{expVariant?.traffic_weight ?? 50}%</Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <p className="text-lg font-bold text-foreground">{v.sessions}</p>
                                <p className="text-[10px] text-muted-foreground">Sessions</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-foreground">{v.leads}</p>
                                <p className="text-[10px] text-muted-foreground">Leads</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-foreground">{v.conversionRate}%</p>
                                <p className="text-[10px] text-muted-foreground">CVR</p>
                              </div>
                            </div>
                            {v.variant !== "control" && lift !== 0 && (
                              <p className={`text-xs text-center font-medium ${lift > 0 ? "text-green-600" : "text-red-500"}`}>
                                {lift > 0 ? "+" : ""}{lift}% vs control
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Winner Selector */}
                    {activeExperiment.status === "running" && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold text-foreground">Select Winner</h4>
                        <RadioGroup value={selectedWinner} onValueChange={setSelectedWinner}>
                          {activeExperiment.variants.map(v => {
                            const stats = variants.find(vd => vd.variant === v.variant_id);
                            const hasMinSessions = (stats?.sessions || 0) >= 50;
                            return (
                              <div key={v.variant_id} className="flex items-center gap-3">
                                <RadioGroupItem value={v.variant_id} id={`winner-${v.variant_id}`} disabled={!hasMinSessions} />
                                <Label htmlFor={`winner-${v.variant_id}`} className="flex items-center gap-2 cursor-pointer">
                                  <code>{v.variant_id}</code>
                                  {!hasMinSessions && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Shield className="h-3 w-3" /> &lt;50 sessions
                                    </span>
                                  )}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>

                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => promoteMutation.mutate(selectedWinner)}
                            disabled={!selectedWinner || promoteMutation.isPending}
                          >
                            {promoteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Trophy className="h-4 w-4 mr-2" />
                            )}
                            Promote Winner
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Rollback (when completed) */}
                    {activeExperiment.status === "completed" && currentWinner && (
                      <div className="pt-4 border-t border-border space-y-3">
                        <p className="text-sm text-muted-foreground">
                          <code className="bg-muted px-1 py-0.5 rounded">{currentWinner.variant_id}</code> is receiving 100% traffic.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => rollbackMutation.mutate()}
                          disabled={rollbackMutation.isPending}
                        >
                          {rollbackMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <RotateCcw className="h-4 w-4 mr-2" />
                          )}
                          Revert to Previous Split
                        </Button>
                      </div>
                    )}

                    {/* Auto-Promote Toggle */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Flame className="h-4 w-4 text-orange-500" />
                            Auto Winner Selection
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Auto-promote when ≥{activeExperiment.auto_promote_min_sessions} sessions/variant and ≥{activeExperiment.auto_promote_min_lift}% lift
                          </p>
                        </div>
                        <Switch
                          checked={activeExperiment.auto_promote}
                          onCheckedChange={(checked) => autoPromoteMutation.mutate(checked)}
                          disabled={autoPromoteMutation.isPending || activeExperiment.status === "completed"}
                        />
                      </div>
                    </div>

                    {/* Event History */}
                    {activeExperiment.events.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">History</h4>
                        <div className="space-y-1">
                          {activeExperiment.events.slice(0, 10).map(evt => (
                            <div key={evt.id} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px]">{evt.action}</Badge>
                                {evt.variant_id && <code>{evt.variant_id}</code>}
                              </div>
                              <span className="text-muted-foreground">
                                {new Date(evt.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {isLoadingExperiments && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </>
          ) : (
            <VariantEmptyState />
          )}

          {/* Note */}
          <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
            <strong>Note:</strong> This is directional data for decision-making, not statistical A/B testing. 
            Consider sample size when comparing variants. Minimum 50 sessions per variant required to promote.
          </div>
        </>
      )}
    </div>
  );
}
