import { useState, useEffect } from "react";
import { Star, ExternalLink, ArrowRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import InlineQuoteFlow from "@/components/InlineQuoteFlow";
import { scrollToQuoteFunnel } from "@/lib/handleQuoteCTA";
import { Button } from "@/components/ui/button";
import type { VariantId } from "@/hooks/useVariant";
import starlinkDishCompass from "@/assets/starlink-dish-compass.png";
import iconSupport from "@/assets/icon-support-help.png";

interface HeroSectionProps {
  variant?: VariantId;
  installCount?: string;
  installLabel?: string;
  subheading?: string;
  heading?: string;
  badgeAboveHeading?: boolean;
  hideInstallDisclaimer?: boolean;
  addressFirst?: boolean;
  addressButtonLabel?: string;
  addressStepTitle?: string;
  hideCompletedSummary?: boolean;
  skipIntentGate?: boolean;
  submitButtonLabel?: string;
  continueButtonLabel?: string;
  inlineTrustBadges?: boolean;
  hideSubtitles?: boolean;
  hideScrollIndicator?: boolean;
  showTrustBadges?: boolean;
  badgeText?: string;
}

const HeroSection = ({
  variant = "control",
  installCount = "5,000+",
  installLabel = "Successful Installs",
  heading,
  subheading,
  badgeAboveHeading = false,
  hideInstallDisclaimer = false,
  addressFirst = false,
  addressButtonLabel,
  addressStepTitle,
  hideCompletedSummary = false,
  skipIntentGate = false,
  submitButtonLabel,
  continueButtonLabel,
  inlineTrustBadges = false,
  hideSubtitles = false,
  hideScrollIndicator = false,
  showTrustBadges = false,
  badgeText = "37 States Nationwide 🇺🇸"
}: HeroSectionProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [intentRevealed, setIntentRevealed] = useState(skipIntentGate);

  // Listen for global CTA reveal event (bypasses intent gate)
  useEffect(() => {
    const handleReveal = () => setIntentRevealed(true);
    window.addEventListener("installpros:reveal-funnel", handleReveal);
    return () => window.removeEventListener("installpros:reveal-funnel", handleReveal);
  }, []);

  // Resume quote logic: scroll to funnel if arriving from another page CTA
  useEffect(() => {
    const shouldResume =
    sessionStorage.getItem("installpros_resume_quote") === "true" ||
    searchParams.get("resumeQuote") === "true";

    if (shouldResume) {
      sessionStorage.removeItem("installpros_resume_quote");
      searchParams.delete("resumeQuote");
      searchParams.delete("from");
      setSearchParams(searchParams, { replace: true });
      setIntentRevealed(true);
      requestAnimationFrame(() => {
        setTimeout(() => scrollToQuoteFunnel(), 300);
      });
    }
  }, []);

  const handleOrderClick = () => {
    setIntentRevealed(true);
  };

  return (
    <section className="relative min-h-[110vh] flex items-start justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-[120px] sm:pt-[140px] pb-6">
        {badgeAboveHeading &&
        <div
          className="flex justify-center mb-3 sm:mb-4 animate-fade-in-up opacity-0 animation-delay-200"
          style={{ animationFillMode: "forwards" }}>

            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm text-sm sm:text-base text-white font-semibold shadow-[0_0_20px_rgba(30,144,255,0.15)]">
              {badgeText}
            </span>
          </div>
        }

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white animate-fade-in-up mb-3 sm:mb-4 text-center leading-tight [word-break:keep-all] [overflow-wrap:normal] [hyphens:none]">
          {heading || (<>Professional Satellite Internet<br className="sm:hidden" /> Installation</>)}
        </h1>

        {/* Subheadline */}
        <p
          className="text-base sm:text-lg md:text-xl text-[#D1D5DB] max-w-3xl mx-auto mb-2 sm:mb-3 animate-fade-in-up opacity-0 animation-delay-200 text-center px-4 sm:px-6 whitespace-pre-line"
          style={{ animationFillMode: "forwards" }}>

          {subheading || "Professional residential satellite internet installations handled from start to finish."}
        </p>

        {!badgeAboveHeading &&
        <div
          className="flex justify-center my-3 sm:my-4 animate-fade-in-up opacity-0 animation-delay-400"
          style={{ animationFillMode: "forwards" }}>

            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm sm:text-base text-white/90 font-medium">
              {badgeText}
            </span>
          </div>
        }

        {/* Intent Segmentation Block */}
        {!intentRevealed &&
        <div
          className="animate-fade-in-up opacity-0 animation-delay-400 max-w-2xl mx-auto mt-6"
          style={{ animationFillMode: "forwards" }}>

            <p className="text-white/70 text-sm sm:text-base font-medium text-center mb-5">
              What brings you here today?
            </p>
            <div className="grid grid-cols-[1fr_0.7fr] gap-3 sm:gap-5 max-w-xl mx-auto items-start">
              {/* Primary: Order Starlink — larger card, image on top, text below */}
              <button
              onClick={handleOrderClick}
              className="group relative flex flex-col items-center rounded-[4px] border-2 border-white/30 bg-black hover:bg-white/5 hover:border-white/60 transition-all duration-300 text-center cursor-pointer overflow-hidden">

                <div className="w-full aspect-square overflow-hidden">
                  <img

                  alt="Starlink dish"
                  className="w-full h-full object-cover" src="/lovable-uploads/77d7f8c1-2b7f-40a6-a3ad-104e9ec44c5f.png" />

                </div>
                <div className="w-full p-3 sm:p-4">
                  <span className="block text-base sm:text-xl md:text-2xl font-bold text-white leading-tight uppercase tracking-wide">
                    Get My Quote
                  </span>
                </div>
              </button>

              {/* Secondary column: Support card + disclaimer */}
              <div className="flex flex-col gap-3">
                <a
                href="https://www.starlink.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center gap-2 sm:gap-3 aspect-square rounded-[4px] border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/60 transition-all duration-300 text-center p-3 sm:p-4">

                  <img alt="Support headset" className="w-12 h-12 sm:w-16 sm:h-16 object-fill border-0" src="/lovable-uploads/a4c57ed0-af14-4c51-a6a4-871fa399b3f0.png" />
                  <span className="text-white leading-tight font-sans font-medium sm:text-xl text-base">I Need Help<br />or Support</span>
                  <span className="text-[9px] sm:text-[10px] text-white/50">
                    Billing, outages, support
                  </span>
                  <ExternalLink className="w-3 h-3 text-white/30 absolute top-2 right-2 sm:top-3 sm:right-3" />
                </a>
                <div className="text-center text-[10px] sm:text-xs text-white/50 leading-snug">
                  <span className="mr-1">⚠️</span>
                  InstallPros does not provide account or technical support.{" "}
                  <a
                  href="https://www.starlink.com/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium">

                     Go to Starlink Support 
                  </a>
                </div>
              </div>
            </div>
            <p className="text-center text-[11px] sm:text-xs text-white/60 mt-4 px-4">
              Compatible with Starlink®, Gen 3, Roam, and other satellite internet systems.
            </p>
          </div>
        }

        {/* Conditional Quote Funnel — revealed after intent click */}
        {intentRevealed &&
        <div className="animate-fade-in-up mt-6 relative z-[100]">
            <div id="quote-funnel-container" className="relative z-50 rounded-2xl">
              <InlineQuoteFlow
              variant="transparent"
              addressFirst={addressFirst}
              addressButtonLabel={addressButtonLabel}
              addressStepTitle={addressStepTitle}
              hideCompletedSummary={hideCompletedSummary}
              submitButtonLabel={submitButtonLabel}
              continueButtonLabel={continueButtonLabel}
              hideSubtitles={hideSubtitles}
              trustBadges={inlineTrustBadges ?
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-white/80 font-semibold">5.0</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                    <span className="text-white/20 text-sm">|</span>
                    <span className="text-white/60 text-xs">
                      <span className="text-white/80 font-semibold">{installCount}</span> {installLabel}
                    </span>
                    <span className="text-white/20 text-sm">|</span>
                    <div className="flex items-center gap-1 text-white/60 text-xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#00B67A" />
                      </svg>
                      <span className="text-white/80 font-semibold">Trustpilot</span>
                      <span>Excellent</span>
                    </div>
                  </div> :
              undefined} />
            
            </div>
          </div>
        }

        {/* Trust Badges */}
        {(variant === "credibility" || showTrustBadges) &&
        <div
          className="animate-fade-in-up opacity-0 animation-delay-600 mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 max-w-2xl mx-auto py-0 px-0"
          style={{ animationFillMode: "forwards" }}>

            <div className="flex items-center gap-2 text-white/60 text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-white/80 font-semibold">5.0</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) =>
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              )}
              </div>
            </div>
            <span className="text-white/20 hidden sm:inline text-lg">|</span>
            <div className="flex items-center text-white/60 text-sm">
              <span>
                <span className="text-white/80 font-semibold">{installCount}</span> {installLabel}
              </span>
            </div>
            <span className="text-white/20 hidden sm:inline text-lg">|</span>
            <div className="flex items-center gap-1.5 text-white/60 text-sm">
              <svg className="w-5 h-5 -mr-0.5" viewBox="0 0 24 24" fill="none">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#00B67A" />
              </svg>
              <span className="text-white/80 font-semibold">Trustpilot</span>
              <span className="text-white/60">Excellent</span>
            </div>
          </div>
        }
      </div>

      {/* Scroll indicator */}
      {!hideScrollIndicator &&
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-float hidden sm:block">
          <div className="w-6 h-10 border-2 border-[#111827] rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-[#6B7280] rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      }
    </section>);

};

export default HeroSection;