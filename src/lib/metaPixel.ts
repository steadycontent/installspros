/**
 * Meta (Facebook) Pixel tracking helper.
 *
 * The base pixel loader lives in index.html and initialises `window.fbq`
 * synchronously so it is available before any React component mounts.
 *
 * Pixel ID: 898862795583500  (InstallPros Dataset)
 *
 * Usage:
 *   import { fireMetaLeadEvent } from "@/lib/metaPixel";
 *   fireMetaLeadEvent();          // on ThankYou / Confirmed pages
 */

export const META_PIXEL_ID = "898862795583500";

const DEDUPE_KEY = "installpros_meta_lead_fired";

function isPreviewHost(): boolean {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return (
    host.includes("localhost") ||
    host.includes("id-preview--") ||
    host.includes(".lovableproject.com")
  );
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Fire a Meta Pixel standard event.
 * Safe to call multiple times — dedupes per browser session via sessionStorage.
 */
export function fireMetaPixelEvent(
  eventName: string,
  params: Record<string, unknown> = {}
): void {
  try {
    if (typeof window === "undefined") return;
    if (isPreviewHost()) return;
    if (typeof window.fbq !== "function") {
      console.warn("[MetaPixel] fbq not available. Is the pixel loaded in index.html?");
      return;
    }
    window.fbq("track", eventName, params);
  } catch (err) {
    console.error("[MetaPixel] fireMetaPixelEvent failed:", err);
  }
}

/**
 * Fire the Meta Pixel "Lead" conversion event.
 * Deduped per session so it can be called from both form-submit handlers
 * and thank-you pages without double-counting.
 */
export function fireMetaLeadEvent(params: Record<string, unknown> = {}): void {
  try {
    if (typeof window === "undefined") return;
    if (isPreviewHost()) return;
    if (sessionStorage.getItem(DEDUPE_KEY) === "1") return;
    fireMetaPixelEvent("Lead", params);
    sessionStorage.setItem(DEDUPE_KEY, "1");
  } catch (err) {
    console.error("[MetaPixel] fireMetaLeadEvent failed:", err);
  }
}
