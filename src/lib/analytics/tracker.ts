import { supabase } from "@/integrations/supabase/client";
import type { AnalyticsEventType, TrackEventPayload } from "./types";

function isLovablePreview(): boolean {
  const host = window.location.hostname;
  return host.includes("id-preview--") || host.includes(".lovableproject.com");
}

const SESSION_KEY = "installpros_analytics_session";
const VARIANT_KEY = "installpros_variant";

// Generate or retrieve session ID
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Get current variant (can be set by landing page)
export function getVariantId(): string | null {
  return sessionStorage.getItem(VARIANT_KEY);
}

// Set variant ID (call this when user lands on a specific variant)
export function setVariantId(variantId: string): void {
  sessionStorage.setItem(VARIANT_KEY, variantId);
}

// Track an event
export async function trackEvent(
  eventType: AnalyticsEventType,
  options?: {
    pagePath?: string;
    funnelStep?: number;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  if (isLovablePreview()) return;
  try {
    const sessionId = getSessionId();
    const variantId = getVariantId();

    const payload: TrackEventPayload = {
      session_id: sessionId,
      event_type: eventType,
      page_path: options?.pagePath || window.location.pathname,
      funnel_step: options?.funnelStep,
      variant_id: variantId || undefined,
      metadata: options?.metadata,
    };

    // For session_start, include browser info
    if (eventType === "session_start") {
      payload.user_agent = navigator.userAgent;
      payload.referrer = document.referrer || undefined;
    }

    // Fire and forget - don't block UI
    supabase.functions.invoke("track-event", {
      body: payload,
    }).then(({ error }) => {
      if (error) {
        console.error("[Analytics] Failed to track event:", error);
      }
    });
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error);
  }
}

// Convenience methods
export function trackSessionStart(): void {
  // Only track once per session
  const alreadyTracked = sessionStorage.getItem("installpros_session_started");
  if (alreadyTracked) return;
  
  sessionStorage.setItem("installpros_session_started", "true");
  trackEvent("session_start");
}

export function trackPageView(pagePath?: string): void {
  trackEvent("page_view", { pagePath });
}

export function trackFunnelStep(step: number, metadata?: Record<string, unknown>): void {
  trackEvent("funnel_step_view", { funnelStep: step, metadata });
}

export function trackCtaClick(ctaName: string, metadata?: Record<string, unknown>): void {
  trackEvent("cta_click", { metadata: { cta_name: ctaName, ...metadata } });
}

export function trackFormSubmit(formName: string, metadata?: Record<string, unknown>): void {
  trackEvent("form_submit", { metadata: { form_name: formName, ...metadata } });
}

// Track a click with coordinates (for heatmaps)
export function trackClick(
  x: number,
  y: number,
  funnelStep: number | undefined,
  elementTag: string,
  elementText: string
): void {
  trackEvent("click", {
    funnelStep,
    metadata: {
      click_x: Math.round(x * 100) / 100,
      click_y: Math.round(y * 100) / 100,
      element_tag: elementTag,
      element_text: elementText.slice(0, 50),
    },
  });
}

// Track a lead (inserts into analytics_leads table)
export async function trackLead(installationType: string): Promise<void> {
  if (isLovablePreview()) return;
  try {
    const sessionId = getSessionId();
    const variantId = getVariantId();

    await supabase.functions.invoke("track-event", {
      body: {
        session_id: sessionId,
        event_type: "form_submit",
        variant_id: variantId,
        metadata: {
          form_name: "quote_form",
          installation_type: installationType,
          is_lead: true,
        },
      },
    });

    // Also insert into leads table via the edge function
    // This is handled by detecting is_lead in the metadata
  } catch (error) {
    console.error("[Analytics] Error tracking lead:", error);
  }
}
