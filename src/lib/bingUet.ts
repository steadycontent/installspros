/**
 * Bing UET enhanced conversions helper.
 *
 * The base UET tag (ti: 187255623) loads via window.onload in index.html.
 * This helper pushes normalized user identifiers (email + phone) so Microsoft
 * Advertising can perform enhanced conversion matching.
 *
 * Normalization follows Bing's published rules:
 *   - Email: trim, lowercase, strip whitespace + accents, remove +tag, remove
 *     periods before @.
 *   - Phone: E.164 (leading +, country code, digits only). Defaults to US (+1)
 *     when a 10-digit number is provided without a country code.
 */

const DEDUPE_KEY = "installpros_bing_uet_user_data";

declare global {
  interface Window {
    uetq?: unknown[];
  }
}

function isLovablePreview(): boolean {
  if (typeof window === "undefined") return true;
  const host = window.location.hostname;
  return host.includes("id-preview--") || host.includes(".lovableproject.com");
}

function normalizeEmail(raw?: string): string | undefined {
  if (!raw) return undefined;
  let email = raw.trim().toLowerCase();
  // Strip accents/diacritics
  email = email.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Remove all whitespace
  email = email.replace(/\s+/g, "");
  if (!email.includes("@")) return undefined;
  const [localRaw, domain] = email.split("@");
  if (!localRaw || !domain) return undefined;
  // Remove +tag
  let local = localRaw.split("+")[0];
  // Remove periods before @
  local = local.replace(/\./g, "");
  if (!local) return undefined;
  return `${local}@${domain}`;
}

function normalizePhoneE164(raw?: string, defaultCountry = "1"): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return undefined;
  if (hasPlus) return `+${digits}`;
  if (digits.length === 10) return `+${defaultCountry}${digits}`;
  if (digits.length === 11 && digits.startsWith(defaultCountry)) return `+${digits}`;
  return `+${digits}`;
}

interface UserIdentifiers {
  email?: string;
  phone?: string;
}

/**
 * Push normalized user identifiers to UET for enhanced conversion matching.
 * - No-ops on Lovable preview hosts.
 * - Dedupes per session so it can be called from submit and /thank-you safely.
 */
export function setBingUetUserData({ email, phone }: UserIdentifiers): void {
  try {
    if (typeof window === "undefined") return;
    if (isLovablePreview()) return;

    const em = normalizeEmail(email);
    const ph = normalizePhoneE164(phone);
    if (!em && !ph) return;

    // Dedupe per session if same payload
    const payloadKey = `${em ?? ""}|${ph ?? ""}`;
    if (sessionStorage.getItem(DEDUPE_KEY) === payloadKey) return;

    const pid: Record<string, string> = {};
    if (em) pid.em = em;
    if (ph) pid.ph = ph;

    window.uetq = window.uetq || [];
    window.uetq.push("set", { pid });

    sessionStorage.setItem(DEDUPE_KEY, payloadKey);
  } catch (err) {
    console.error("[BingUET] setBingUetUserData failed:", err);
  }
}
