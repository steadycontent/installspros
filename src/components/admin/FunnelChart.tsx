import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeatmapOverlay, HeatmapClickTargets } from "@/components/admin/HeatmapOverlay";
import type { FunnelStep, ClickPoint } from "@/lib/analytics/types";

const stepUrls: Record<number, string> = {
  0: "/?preview=funnel",
  1: "/?preview=funnel&step=name",
  2: "/?preview=funnel&step=phone",
  3: "/?preview=funnel&step=email",
  4: "/?preview=funnel&step=address",
};

interface FunnelChartProps {
  data: FunnelStep[];
  className?: string;
  onStepChange?: (step: number) => void;
  heatmapClicks?: ClickPoint[];
  heatmapTotalClicks?: number;
  isLoadingHeatmap?: boolean;
}

export function FunnelChart({ data, className, onStepChange, heatmapClicks = [], heatmapTotalClicks = 0, isLoadingHeatmap }: FunnelChartProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [mountedSteps, setMountedSteps] = useState<Set<number>>(new Set([0]));
  const [loadedSteps, setLoadedSteps] = useState<Set<number>>(new Set());
  const [showHeatmap, setShowHeatmap] = useState(false);

  const handleIframeLoad = (step: number) => {
    setLoadedSteps((prev) => new Set([...prev, step]));
    const next = step + 1;
    if (next <= 4) {
      setMountedSteps((prev) => new Set([...prev, next]));
    }
  };

  const changeStep = (step: number) => {
    setActiveStep(step);
    onStepChange?.(step);
  };
  const goUp = useCallback(() => {
    const next = activeStep <= 0 ? data.length - 1 : activeStep - 1;
    changeStep(next);
  }, [data.length, activeStep, onStepChange]);
  const goDown = useCallback(() => {
    const next = activeStep >= data.length - 1 ? 0 : activeStep + 1;
    changeStep(next);
  }, [data.length, activeStep, onStepChange]);

  // Keyboard navigation
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") { e.preventDefault(); goUp(); }
      if (e.key === "ArrowDown") { e.preventDefault(); goDown(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goUp, goDown]);

  if (!data || data.length === 0) {
    return (
      <div className={cn("text-center text-muted-foreground py-12", className)}>
        No funnel data available for this period
      </div>
    );
  }

  const maxUsers = Math.max(...data.map(d => d.users), 1);

  return (
    <div className={cn("flex gap-6", className)}>
      {/* Left: Preview + nav */}
      <div className="w-[260px] flex-shrink-0">
        <div className="sticky top-6 space-y-3">
          {/* Phone preview with optional heatmap overlay */}
          <div className="w-[260px] h-[563px] rounded-xl border border-border bg-black shadow-lg overflow-hidden relative">
            {data.map((_, i) => (
              mountedSteps.has(i) && (
                <iframe
                  key={i}
                  src={stepUrls[i]}
                  className="w-[390px] h-[844px] origin-top-left absolute top-0 left-0"
                  style={{
                    transform: "scale(0.667)",
                    transformOrigin: "top left",
                    opacity: activeStep === i ? 1 : 0,
                    pointerEvents: activeStep === i ? "auto" : "none",
                    zIndex: activeStep === i ? 10 : 1,
                  }}
                  tabIndex={-1}
                  title={`Step ${i} preview`}
                  onLoad={() => handleIframeLoad(i)}
                />
              )
            ))}
            {/* Heatmap canvas overlay */}
            {showHeatmap && heatmapClicks.length > 0 && (
              <HeatmapOverlay clicks={heatmapClicks} totalClicks={heatmapTotalClicks} overlay />
            )}
            {/* Loading spinner */}
            {!loadedSteps.has(activeStep) && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* Click count badge when heatmap is on */}
            {showHeatmap && (
              <div className="absolute top-2 left-2 z-20 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-[10px] text-muted-foreground font-medium">
                🔥 {heatmapTotalClicks} clicks
              </div>
            )}
          </div>

          {/* Step label with fire toggle */}
          <div className="flex items-center gap-2 justify-center">
            <Button
              variant={showHeatmap ? "default" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowHeatmap(!showHeatmap)}
              title="Toggle click heatmap"
            >
              {isLoadingHeatmap ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Flame className="h-3.5 w-3.5" />
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Step {activeStep}: {data[activeStep]?.name || ""}
            </p>
          </div>

          {/* Up / Down navigation */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={goUp} className="h-9 w-9">
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goDown} className="h-9 w-9">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Top click targets (visible when heatmap is on) */}
          {showHeatmap && heatmapClicks.length > 0 && (
            <HeatmapClickTargets clicks={heatmapClicks} />
          )}
        </div>
      </div>

      {/* Right: 3-column layout — title | bar | counts */}
      <div className="flex-1 min-w-0">
        {/* Column headers */}
        <div className="grid grid-cols-[140px_1fr_70px_100px] gap-x-4 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Step</span>
          <span>Visitors</span>
          <span></span>
          <span className="text-right">Count</span>
        </div>
        {data.map((step) => {
          const widthPercent = (step.users / maxUsers) * 100;
          const basePercent = data[0]?.users > 0
            ? Math.round((step.users / data[0].users) * 100)
            : 0;
          const isActive = activeStep === step.step;

          return (
            <div
              key={step.step}
              className={cn(
                "rounded-lg cursor-pointer transition-colors",
                isActive ? "bg-muted/70 ring-1 ring-primary/20" : "hover:bg-muted/40"
              )}
              onClick={() => changeStep(step.step)}
            >
              <div className="grid grid-cols-[140px_1fr_70px_100px] gap-x-4 items-center px-3 py-3">
                <span className="font-medium text-sm text-foreground whitespace-nowrap truncate">
                  Step {step.step}: {step.name}
                </span>
                <div className="h-7 rounded-md overflow-hidden" style={{ backgroundColor: '#69BE28' }}>
                  <div
                    className="h-full transition-all duration-500 ease-out rounded-md flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(widthPercent, 3)}%`, backgroundColor: '#002244' }}
                  >
                    {widthPercent > 12 && (
                      <span className="text-xs font-medium text-white">
                        {step.users.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  {step.dropOffRate > 0 && (
                    <span className="text-xs text-destructive">
                      ↓ {step.dropOffRate}%
                    </span>
                  )}
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="font-mono text-sm font-semibold text-foreground">{step.users.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground ml-1">({basePercent}%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
