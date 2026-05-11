import { useRef, useEffect, useState, useCallback } from "react";
import type { LightSegment, LightConfig } from "./types";
import { HOLIDAY_PRESETS } from "./types";

interface LightingCanvasProps {
  imageUrl: string;
  config: LightConfig;
  onConfigChange: (config: LightConfig) => void;
  readOnly?: boolean;
  foregroundMaskUrl?: string | null;
  estimatedHomeWidthFt?: number; // calibrated from property data
}

const LightingCanvas = ({ imageUrl, config, onConfigChange, readOnly = false, foregroundMaskUrl, estimatedHomeWidthFt }: LightingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const maskRef = useRef<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [dragging, setDragging] = useState<{ segId: string; point: "start" | "end" } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSegId, setHoveredSegId] = useState<string | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth;
        const ratio = img.height / img.width;
        const ch = Math.min(cw * ratio, 600);
        setCanvasSize({ w: cw, h: ch });
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Load foreground mask
  useEffect(() => {
    if (!foregroundMaskUrl) { maskRef.current = null; return; }
    const mask = new Image();
    mask.crossOrigin = "anonymous";
    mask.onload = () => {
      maskRef.current = mask;
      // Trigger re-render
      setCanvasSize((s) => ({ ...s }));
    };
    mask.src = foregroundMaskUrl;
  }, [foregroundMaskUrl]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && imgRef.current) {
        const cw = containerRef.current.clientWidth;
        const ratio = imgRef.current.height / imgRef.current.width;
        const ch = Math.min(cw * ratio, 600);
        setCanvasSize({ w: cw, h: ch });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current preset colors
  const preset = HOLIDAY_PRESETS.find((p) => p.id === config.colorPreset) || HOLIDAY_PRESETS[0];

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imgRef.current;
    if (!canvas || !ctx || !img || canvasSize.w === 0) return;

    canvas.width = canvasSize.w;
    canvas.height = canvasSize.h;

    // Draw image
    ctx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);

    // Darken slightly for contrast
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, canvasSize.w, canvasSize.h);

    // Draw each segment's lights
    config.segments.forEach((seg) => {
      const x1 = seg.x1 * canvasSize.w;
      const y1 = seg.y1 * canvasSize.h;
      const x2 = seg.x2 * canvasSize.w;
      const y2 = seg.y2 * canvasSize.h;

      // Calculate light positions along segment
      const dx = x2 - x1;
      const dy = y2 - y1;
      const segLenPx = Math.sqrt(dx * dx + dy * dy);
      const pxPerInch = canvasSize.w / 160;
      const spacingPx = Math.max(config.spacingInches * pxPerInch, 4);
      const numLights = Math.max(Math.floor(segLenPx / spacingPx), 2);

      for (let i = 0; i <= numLights; i++) {
        const t = i / numLights;
        const lx = x1 + dx * t;
        const ly = y1 + dy * t;
        const color = preset.colors[i % preset.colors.length];

        // Outer glow
        const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 6);
        glow.addColorStop(0, color + "AA");
        glow.addColorStop(0.5, color + "44");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(lx - 6, ly - 6, 12, 12);

        // Inner bright dot
        ctx.beginPath();
        ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      // Draw draggable endpoints only on hover or while dragging this segment
      if (!readOnly && (hoveredSegId === seg.id || dragging?.segId === seg.id)) {
        [{ x: x1, y: y1 }, { x: x2, y: y2 }].forEach(({ x, y }) => {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(59,130,246,0.6)";
          ctx.fill();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }
    });

    // Composite foreground mask on top of lights (trees in front of lights)
    const mask = maskRef.current;
    if (mask) {
      // Create offscreen canvas with original image masked by AI foreground mask
      const offscreen = document.createElement("canvas");
      offscreen.width = canvasSize.w;
      offscreen.height = canvasSize.h;
      const offCtx = offscreen.getContext("2d")!;
      
      // Draw original image
      offCtx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
      
      // Use mask to keep only foreground pixels
      // The mask has foreground objects in color on black background
      // We use it as a stencil: draw mask, then use 'source-in' to keep only where mask is non-black
      offCtx.globalCompositeOperation = "destination-in";
      offCtx.drawImage(mask, 0, 0, canvasSize.w, canvasSize.h);
      offCtx.globalCompositeOperation = "source-over";
      
      // Draw the masked foreground on top of main canvas
      ctx.drawImage(offscreen, 0, 0);
    }

    // Draw in-progress line
    if (drawStart && !readOnly) {
      ctx.beginPath();
      ctx.arc(drawStart.x * canvasSize.w, drawStart.y * canvasSize.h, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59,130,246,0.8)";
      ctx.fill();
    }
  }, [canvasSize, config, drawStart, readOnly, preset, hoveredSegId, dragging]);

  // Convert mouse/touch to normalized coords
  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }, []);

  // Find which segment the cursor is near (for hover)
  const findNearSegment = useCallback((pos: { x: number; y: number }): string | null => {
    const threshold = 0.03;
    for (const seg of config.segments) {
      if (Math.hypot(pos.x - seg.x1, pos.y - seg.y1) < threshold) return seg.id;
      if (Math.hypot(pos.x - seg.x2, pos.y - seg.y2) < threshold) return seg.id;
    }
    return null;
  }, [config.segments]);

  // Find if click is near an endpoint
  const findEndpoint = useCallback((pos: { x: number; y: number }): { segId: string; point: "start" | "end" } | null => {
    const threshold = 0.03;
    for (const seg of config.segments) {
      if (Math.hypot(pos.x - seg.x1, pos.y - seg.y1) < threshold) return { segId: seg.id, point: "start" };
      if (Math.hypot(pos.x - seg.x2, pos.y - seg.y2) < threshold) return { segId: seg.id, point: "end" };
    }
    return null;
  }, [config.segments]);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return;
    e.preventDefault();
    const pos = getPos(e);
    const ep = findEndpoint(pos);
    if (ep) {
      setDragging(ep);
    } else {
      setIsDrawing(true);
      setDrawStart(pos);
    }
  }, [readOnly, getPos, findEndpoint]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return;
    e.preventDefault();
    const pos = getPos(e);
    
    // Update hover state
    if (!dragging && !isDrawing) {
      setHoveredSegId(findNearSegment(pos));
    }
    
    if (dragging) {
      const updated = config.segments.map((s) => {
        if (s.id !== dragging.segId) return s;
        return dragging.point === "start"
          ? { ...s, x1: pos.x, y1: pos.y }
          : { ...s, x2: pos.x, y2: pos.y };
      });
      onConfigChange({ ...config, segments: updated });
    }
  }, [readOnly, dragging, isDrawing, config, getPos, onConfigChange, findNearSegment]);

  const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return;
    if (dragging) {
      setDragging(null);
      return;
    }
    if (isDrawing && drawStart) {
      const pos = getPos(e);
      const dist = Math.hypot(pos.x - drawStart.x, pos.y - drawStart.y);
      if (dist > 0.02) {
        const newSeg: LightSegment = {
          id: crypto.randomUUID(),
          x1: drawStart.x,
          y1: drawStart.y,
          x2: pos.x,
          y2: pos.y,
        };
        onConfigChange({ ...config, segments: [...config.segments, newSeg] });
      }
    }
    setIsDrawing(false);
    setDrawStart(null);
  }, [readOnly, dragging, isDrawing, drawStart, config, getPos, onConfigChange]);

  const removeSegment = (id: string) => {
    onConfigChange({ ...config, segments: config.segments.filter((s) => s.id !== id) });
  };

  // Calculate total linear feet using property-calibrated width
  // Assume the home occupies ~60% of image width; use property data to estimate frontage
  const imageWidthFt = estimatedHomeWidthFt
    ? estimatedHomeWidthFt / 0.6  // home takes ~60% of image
    : 80;                          // fallback: 80ft total

  const totalFeet = config.segments.reduce((acc, seg) => {
    const dx = (seg.x2 - seg.x1) * canvasSize.w;
    const dy = (seg.y2 - seg.y1) * canvasSize.h;
    const px = Math.sqrt(dx * dx + dy * dy);
    const feetPerPx = imageWidthFt / canvasSize.w;
    return acc + px * feetPerPx;
  }, 0);

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="relative rounded-xl overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair touch-none"
          style={{ height: canvasSize.h || "auto" }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={() => { setDragging(null); setIsDrawing(false); setDrawStart(null); setHoveredSegId(null); }}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>

      {!readOnly && (
        <>
          {/* Instructions */}
          <p className="text-sm text-white/50 text-center">
            Click and drag on the image to draw light lines along your roofline. Drag endpoints to adjust.
          </p>

          {/* Segment list with delete */}
          {config.segments.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {config.segments.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => removeSegment(s.id)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/70 hover:bg-red-500/30 hover:text-red-300 transition-colors"
                >
                  Line {i + 1} ✕
                </button>
              ))}
            </div>
          )}

          {/* Spacing control */}
          <div className="flex items-center gap-4 justify-center">
            <label className="text-sm text-white/60">LED Spacing:</label>
            <input
              type="range"
              min={2}
              max={12}
              step={0.5}
              value={config.spacingInches}
              onChange={(e) => onConfigChange({ ...config, spacingInches: parseFloat(e.target.value) })}
              className="w-32 accent-blue-500"
            />
            <span className="text-sm text-white/80 font-mono w-12">{config.spacingInches}"</span>
          </div>

          {/* Holiday presets */}
          <div className="flex flex-wrap gap-2 justify-center">
            {HOLIDAY_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onConfigChange({ ...config, colorPreset: p.id })}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  config.colorPreset === p.id
                    ? "bg-blue-500/30 text-white ring-1 ring-blue-400/50"
                    : "bg-white/10 text-white/60 hover:bg-white/15"
                }`}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>

          {/* Linear footage display */}
          {config.segments.length > 0 && (
            <p className="text-center text-sm text-white/50">
              Estimated: <span className="text-white/80 font-semibold">{Math.round(totalFeet)} linear feet</span>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default LightingCanvas;
export { LightingCanvas };
