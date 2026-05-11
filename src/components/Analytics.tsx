import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackSessionStart, trackPageView, trackClick } from "@/lib/analytics/tracker";

// Determine which funnel step the user is on based on URL params
function getCurrentFunnelStep(): number | undefined {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get("preview");
  if (preview !== "funnel") return undefined;
  const step = params.get("step");
  if (!step) return 0;
  const stepMap: Record<string, number> = { name: 1, phone: 2, email: 3, address: 4 };
  return stepMap[step] ?? undefined;
}

const Analytics = () => {
  const location = useLocation();
  const throttleRef = useRef(0);

  // Track session start on mount
  useEffect(() => {
    trackSessionStart();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Global click tracking for heatmaps
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Throttle: max 1 click event per 300ms
      const now = Date.now();
      if (now - throttleRef.current < 300) return;
      throttleRef.current = now;

      // Skip clicks inside admin area
      if (window.location.pathname.startsWith("/admin")) return;

      const target = e.target as HTMLElement;
      if (!target) return;

      // Calculate position as percentage of viewport
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      const funnelStep = getCurrentFunnelStep();
      const elementTag = target.tagName?.toLowerCase() || "unknown";
      const elementText = target.textContent?.trim() || target.getAttribute("aria-label") || "";

      trackClick(x, y, funnelStep, elementTag, elementText);
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
};

export default Analytics;
