import { trackCtaClick } from "@/lib/analytics/tracker";

/**
 * Global CTA handler for the single-funnel architecture.
 * - On homepage: smooth-scrolls to the inline funnel with a pulse highlight
 * - On other pages: stores a resume flag and navigates to homepage
 */
export function handleQuoteCTA(ctaId: string, navigate?: (path: string) => void) {
  trackCtaClick(ctaId);

  if (window.location.pathname === "/") {
    // Reveal the funnel (bypasses intent gate) then scroll
    window.dispatchEvent(new CustomEvent("installpros:reveal-funnel"));
    // Wait one frame for React to render the funnel container
    requestAnimationFrame(() => {
      setTimeout(() => scrollToQuoteFunnel(), 50);
    });
  } else {
    sessionStorage.setItem("installpros_resume_quote", "true");
    if (navigate) {
      navigate("/?resumeQuote=true");
    } else {
      window.location.href = "/?resumeQuote=true";
    }
  }
}

export function scrollToQuoteFunnel() {
  const container = document.getElementById("quote-funnel-container");
  if (!container) return;

  const headerOffset = 80;
  const elementPosition = container.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  // Pulse highlight
  container.classList.add("funnel-highlight");
  setTimeout(() => {
    container.classList.remove("funnel-highlight");
  }, 600);

  // Focus first incomplete field after scroll finishes
  setTimeout(() => {
    const firstInput = container.querySelector<HTMLInputElement | HTMLButtonElement>(
      'input:not([value]:not([value=""])), input[value=""], button[data-funnel-start]'
    );
    firstInput?.focus();
  }, 600);
}
