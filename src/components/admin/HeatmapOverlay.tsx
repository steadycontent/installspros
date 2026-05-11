import { useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ClickPoint } from "@/lib/analytics/types";

interface HeatmapOverlayProps {
  clicks: ClickPoint[];
  totalClicks: number;
  className?: string;
  overlay?: boolean;
}

/** Canvas-only heatmap — renders dots. Use HeatmapClickTargets for the list. */
export function HeatmapOverlay({ clicks, totalClicks, className, overlay }: HeatmapOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxCount = useMemo(() => Math.max(...clicks.map(c => c.count), 1), [clicks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (clicks.length === 0) return;

    for (const point of clicks) {
      const px = (point.x / 100) * rect.width;
      const py = (point.y / 100) * rect.height;
      const intensity = point.count / maxCount;
      const radius = 8 + intensity * 20;

      const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius);
      if (intensity > 0.7) {
        gradient.addColorStop(0, `rgba(255, 0, 0, ${0.6 + intensity * 0.3})`);
        gradient.addColorStop(0.4, `rgba(255, 80, 0, ${0.3 + intensity * 0.2})`);
        gradient.addColorStop(1, "rgba(255, 80, 0, 0)");
      } else if (intensity > 0.3) {
        gradient.addColorStop(0, `rgba(255, 165, 0, ${0.5 + intensity * 0.3})`);
        gradient.addColorStop(0.4, `rgba(255, 200, 0, ${0.2 + intensity * 0.2})`);
        gradient.addColorStop(1, "rgba(255, 200, 0, 0)");
      } else {
        gradient.addColorStop(0, `rgba(0, 150, 255, ${0.4 + intensity * 0.3})`);
        gradient.addColorStop(0.4, `rgba(0, 200, 255, ${0.15 + intensity * 0.15})`);
        gradient.addColorStop(1, "rgba(0, 200, 255, 0)");
      }

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      if (point.count >= 2) {
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
      }
    }
  }, [clicks, maxCount]);

  if (overlay) {
    // Overlay mode: just the canvas, no wrapper
    return (
      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0 w-full h-full z-[15] pointer-events-none", className)}
      />
    );
  }

  // Standalone mode (fallback)
  if (clicks.length === 0) {
    return (
      <div className={cn("flex items-center justify-center text-muted-foreground text-sm", className)}>
        No click data for this step yet
      </div>
    );
  }

  return (
    <div className={cn("relative w-full aspect-[390/844] max-h-[420px] rounded-lg border border-border bg-muted/30 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-[10px] text-muted-foreground font-medium">
        🔥 {totalClicks} clicks
      </div>
    </div>
  );
}

/** Separate list of top click targets */
export function HeatmapClickTargets({ clicks }: { clicks: ClickPoint[] }) {
  const topElements = [...clicks].sort((a, b) => b.count - a.count).slice(0, 8);

  if (topElements.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-foreground mb-2">Top Click Targets</h4>
      <div className="space-y-1">
        {topElements.map((point, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-muted-foreground font-mono">&lt;{point.element_tag}&gt;</span>
              {point.element_text && (
                <span className="text-foreground truncate">{point.element_text}</span>
              )}
            </div>
            <span className="font-mono font-semibold text-foreground ml-2">{point.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
