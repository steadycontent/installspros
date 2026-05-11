import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertTriangle, Lightbulb, BarChart3, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { FunnelStep, OverviewMetrics } from "@/lib/analytics/types";
import { cn } from "@/lib/utils";

interface AIAnalysis {
  summary: string;
  health_score: number;
  critical_issues: { step: number; issue: string; impact: string }[];
  recommendations: {
    title: string;
    description: string;
    priority: string;
    type: string;
    expected_impact: string;
  }[];
  benchmarks: { overall_conversion: string; biggest_opportunity: string };
}

interface FunnelAIInsightsProps {
  funnel: FunnelStep[];
  overview: OverviewMetrics;
}

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  low: "bg-muted text-muted-foreground border-border",
};

const typeLabels: Record<string, string> = {
  quick_win: "⚡ Quick Win",
  ab_test: "🧪 A/B Test",
  redesign: "🔧 Redesign",
};

function HealthScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "text-green-500" : score >= 40 ? "text-orange-500" : "text-destructive";
  return (
    <div className="flex items-center gap-3">
      <div className={cn("text-3xl font-bold", color)}>{score}</div>
      <div className="text-xs text-muted-foreground leading-tight">
        Health<br />Score
      </div>
    </div>
  );
}

export function FunnelAIInsights({ funnel, overview }: FunnelAIInsightsProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (funnel.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-funnel", {
        body: { funnel_data: funnel, overview_data: overview },
      });

      if (fnError) throw fnError;
      setAnalysis(data as AIAnalysis);
    } catch (err) {
      console.error("AI analysis failed:", err);
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Not yet run state
  if (!analysis && !isLoading && !error) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
          <Sparkles className="h-10 w-10 text-primary/50" />
          <div className="text-center">
            <p className="font-medium text-foreground">AI Funnel Analysis</p>
            <p className="text-sm text-muted-foreground mt-1">
              Get GPT-powered recommendations to improve your conversion rates
            </p>
          </div>
          <Button onClick={runAnalysis} disabled={funnel.length === 0}>
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze Funnel
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing your funnel with GPT…</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex flex-col items-center justify-center py-8 gap-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={runAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI Funnel Analysis</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={runAnalysis} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-1" /> Re-analyze
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary + Health Score */}
        <div className="flex items-start gap-6 p-4 rounded-lg bg-muted/50">
          <HealthScoreRing score={analysis.health_score} />
          <p className="text-sm text-foreground flex-1">{analysis.summary}</p>
        </div>

        {/* Critical Issues */}
        {analysis.critical_issues.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Critical Issues
            </div>
            {analysis.critical_issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                <Badge variant="outline" className="shrink-0 mt-0.5">Step {issue.step}</Badge>
                <p className="text-sm text-foreground">{issue.issue}</p>
                <Badge className={cn("shrink-0 ml-auto", priorityColors[issue.impact])}>
                  {issue.impact}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lightbulb className="h-4 w-4 text-primary" />
            Recommendations
          </div>
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="p-3 rounded-lg border border-border space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-foreground">{rec.title}</span>
                <Badge variant="outline" className={cn("text-xs", priorityColors[rec.priority])}>
                  {rec.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {typeLabels[rec.type] || rec.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <p className="text-xs text-primary">Expected: {rec.expected_impact}</p>
            </div>
          ))}
        </div>

        {/* Benchmarks */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            Industry Benchmarks
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="text-xs text-muted-foreground mb-1">Conversion vs. Industry</p>
              <p className="text-foreground">{analysis.benchmarks.overall_conversion}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="text-xs text-muted-foreground mb-1">Biggest Opportunity</p>
              <p className="text-foreground">{analysis.benchmarks.biggest_opportunity}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
