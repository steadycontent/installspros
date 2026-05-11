/**
 * Google Ads conversion tracking helper.
 *
 * The base gtag.js loader lives in index.html and initializes `window.dataLayer`
 * + `window.gtag` synchronously, then loads the actual script after window.load
 * (same deferred pattern as Hotjar) so ad tracking never blocks render.
 *
 * To rotate IDs, update GOOGLE_ADS_CONVERSION_ID + GOOGLE_ADS_CONVERSION_LABEL
 * here AND the matching `AW-...` constant in index.html.
 */

// PUBLIC values — safe to ship in the bundle (same as any client-side gtag).
export const GOOGLE_ADS_CONVERSION_ID = "AW-17712194751";
export const GOOGLE_ADS_CONVERSION_LABEL = "FJNGCOb6xZ8cEL_J6v1B";

const DEDUPE_KEY = "installpros_gads_conversion_fired";

function isLovablePreview(): boolean {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return host.includes("id-preview--") || host.includes(".lovableproject.com");
}

function isConfigured(): boolean {
  const id = GOOGLE_ADS_CONVERSION_ID as string;
  const label = GOOGLE_ADS_CONVERSION_LABEL as string;
  return id !== "AW-XXXXXXXXX" && label !== "REPLACE_WITH_LABEL" && id.startsWith("AW-");
}

interface ConversionOpts {
  value?: number;
  currency?: string;
  transactionId?: string;
}

/**
 * Fire a Google Ads conversion event.
 * - No-ops on Lovable preview hosts.
 * - No-ops if the conversion ID/label haven't been set.
 * - Dedupes per session via sessionStorage so it can be safely called from
 *   both form-submit and the /thank-you page without double-counting.
 */
export function fireGoogleAdsConversion(opts: ConversionOpts = {}): void {
  try {
    if (typeof window === "undefined") return;
    if (isLovablePreview()) return;
    if (!isConfigured()) {
      console.warn("[GoogleAds] Conversion ID/Label not configured. Skipping.");
      return;
    }

    // Dedupe per session
    if (sessionStorage.getItem(DEDUPE_KEY) === "1") return;

    const sendTo = `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`;
    const payload: Record<string, unknown> = { send_to: sendTo };
    if (typeof opts.value === "number") {
      payload.value = opts.value;
      payload.currency = opts.currency ?? "USD";
    }
    if (opts.transactionId) payload.transaction_id = opts.transactionId;

    // Fall back to dataLayer.push if gtag fn isn't ready yet (script still loading).
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", payload);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(["event", "conversion", payload]);
    }

    sessionStorage.setItem(DEDUPE_KEY, "1");
  } catch (err) {
    console.error("[GoogleAds] fireGoogleAdsConversion failed:", err);
  }
}
