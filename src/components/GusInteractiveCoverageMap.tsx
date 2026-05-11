import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, CheckCircle, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUSAMapData, zipToState } from "@/data/usa-map-dimensions";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";

const COMING_SOON_STATES = ["ND"];

const stats = [
  { value: 49, label: "States Covered", suffix: "" },
  { value: 310, label: "Cities with Service", suffix: "+", highlight: true },
  { value: 3488, label: "Installations Completed", suffix: "+" },
  { value: 98, label: "US Coverage", suffix: "%" },
];

function easeOutQuad(t: number) {
  return t * (2 - t);
}

function AnimatedCounter({ target, suffix, highlight }: { target: number; suffix: string; highlight?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1500;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(easeOutQuad(progress) * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="bg-muted/50 rounded-xl px-4 py-6 text-center">
      <p className={`text-3xl md:text-4xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>
        {count.toLocaleString()}{suffix}
      </p>
    </div>
  );
}

const GusInteractiveCoverageMap = () => {
  const mapData = getUSAMapData();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: "", available: true });
  const [zip, setZip] = useState("");
  const [zipResult, setZipResult] = useState<null | { state: string; name: string; available: boolean }>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent, stateAbbr: string, stateName: string) => {
    const rect = (e.currentTarget as Element).closest("svg")?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 12,
      name: stateName,
      available: !COMING_SOON_STATES.includes(stateAbbr),
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }));
  }, []);

  const checkZip = () => {
    if (zip.length < 3) return;
    const prefix = zip.substring(0, 3);
    const stateAbbr = zipToState[prefix];
    if (!stateAbbr || !mapData[stateAbbr]) {
      setZipResult(null);
      return;
    }
    setZipResult({
      state: stateAbbr,
      name: mapData[stateAbbr]?.name ?? stateAbbr,
      available: !COMING_SOON_STATES.includes(stateAbbr),
    });
  };

  return (
    <section className="section section-light">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          Nationwide Starlink Installation Coverage
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto text-center">
          Professional installation services available across America.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div key={s.label}>
              <AnimatedCounter target={s.value} suffix={s.suffix} highlight={s.highlight} />
              <p className="text-sm text-muted-foreground mt-1 text-center">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SVG Map - full width */}
        <div className="relative max-w-4xl mx-auto mb-10">
          <svg
            ref={svgRef}
            viewBox="0 0 959 593"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="glow-green">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22c55e" floodOpacity="0.5" />
              </filter>
              <filter id="glow-orange">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f97316" floodOpacity="0.5" />
              </filter>
            </defs>
            {Object.entries(mapData).map(([abbr, state]) => {
              const isComingSoon = COMING_SOON_STATES.includes(abbr);
              const isHovered = tooltip.visible && tooltip.name === state.name;
              return (
                <path
                  key={abbr}
                  d={state.dimensions}
                  fill={isComingSoon ? "#fecaca" : "#bbf7d0"}
                  stroke={isComingSoon ? "#f87171" : "#22c55e"}
                  strokeWidth={isHovered ? 2 : 0.8}
                  opacity={isHovered ? 1 : 0.85}
                  filter={isHovered ? (isComingSoon ? "url(#glow-orange)" : "url(#glow-green)") : undefined}
                  className="transition-all duration-150 cursor-pointer"
                  onMouseMove={(e) => handleMouseMove(e, abbr, state.name)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </svg>

          {/* Tooltip */}
          <div
            className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg transition-opacity duration-150 border"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              opacity: tooltip.visible ? 1 : 0,
              visibility: tooltip.visible ? "visible" : "hidden",
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
          >
            <span>{tooltip.name}</span>
            {tooltip.name && (
              <span className={`ml-2 text-xs font-semibold ${tooltip.available ? "text-green-600" : "text-orange-500"}`}>
                {tooltip.available ? "✓ Available" : "⏳ Coming Soon"}
              </span>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 border border-green-600" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-300 border border-red-500" />
              <span className="text-sm text-muted-foreground">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* ZIP Checker - below map */}
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <h3 className="text-xl font-bold text-foreground mb-2">Check Your Area</h3>
            <p className="text-sm text-muted-foreground mb-4">Enter your ZIP code to see if we service your area.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter ZIP code"
                value={zip}
                onChange={(e) => { setZip(e.target.value.replace(/\D/g, "").slice(0, 5)); setZipResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && checkZip()}
                className="flex-1"
              />
              <Button onClick={checkZip} size="md">
                <Search className="w-4 h-4 mr-1" /> Check
              </Button>
            </div>

            {zipResult && (
              <div className={`mt-4 p-4 rounded-lg border ${zipResult.available ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {zipResult.available ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-500" />
                  )}
                  <span className={`font-semibold ${zipResult.available ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"}`}>
                    {zipResult.available ? "We service your area!" : "Coming Soon"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {zipResult.available
                    ? `Professional Starlink installation is available in ${zipResult.name}.`
                    : `We're expanding to ${zipResult.name} soon. Join the waitlist!`}
                </p>
                <Button
                  variant="hero"
                  size="md"
                  className="w-full"
                  onClick={() => handleQuoteCTA("coverage-map-zip-cta")}
                >
                  {zipResult.available ? "Get Your Free Quote" : "Join Waitlist"}
                </Button>
              </div>
            )}
          </div>

          {/* Service badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {["Residential", "Commercial", "Marine", "Mobile"].map((type) => (
              <div key={type} className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-card border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GusInteractiveCoverageMap;
