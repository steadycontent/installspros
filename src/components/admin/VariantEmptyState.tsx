import { BarChart3, FlaskConical, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function VariantEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-primary" />
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          A/B Test Running — Waiting for Data
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-8">
          The split test between <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">control</code> and{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">credibility</code> is now live.
          Data will appear here once visitors start hitting the homepage.
        </p>

        {/* Placeholder chart preview */}
        <div className="w-full max-w-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Placeholder variant cards */}
            <div className="rounded-lg border border-dashed p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(215,70%,55%)]" />
                <span className="text-sm font-medium text-foreground">control</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-muted rounded-full w-full" />
                <div className="h-2 bg-muted rounded-full w-3/4" />
                <div className="h-2 bg-muted rounded-full w-1/2" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Sessions: —</span>
                <span>Conv: —%</span>
              </div>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[hsl(150,60%,45%)]" />
                <span className="text-sm font-medium text-foreground">credibility</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-muted rounded-full w-full" />
                <div className="h-2 bg-muted rounded-full w-3/4" />
                <div className="h-2 bg-muted rounded-full w-1/2" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Sessions: —</span>
                <span>Conv: —%</span>
              </div>
            </div>
          </div>

          {/* Placeholder bar chart skeleton */}
          <div className="rounded-lg border border-dashed p-4">
            <div className="flex items-end justify-center gap-6 h-24">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-16 bg-[hsl(215,70%,55%)]/20 rounded-t border border-dashed border-[hsl(215,70%,55%)]/40" />
                <span className="text-[10px] text-muted-foreground">control</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-20 bg-[hsl(150,60%,45%)]/20 rounded-t border border-dashed border-[hsl(150,60%,45%)]/40" />
                <span className="text-[10px] text-muted-foreground">credibility</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">Conversion comparison will appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
