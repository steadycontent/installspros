import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import SupportDisclaimerBar from "@/components/SupportDisclaimerBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { useVariant } from "@/hooks/useVariant";

// Below-the-fold sections — lazy-loaded to speed up initial render / LCP
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const HowItWorksSection = lazy(() => import("@/components/HowItWorksSection"));
const EquipmentSection = lazy(() => import("@/components/EquipmentSection"));
const SmartHomeSection = lazy(() => import("@/components/SmartHomeSection"));
const CoverageSection = lazy(() => import("@/components/CoverageSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const variant = useVariant();

  useEffect(() => {
    const host = window.location.hostname;
    if (host.includes("id-preview--") || host.includes(".lovableproject.com")) return;
    const run = () => {
      fetch("https://api64.ipify.org?format=json")
        .then((r) => r.json())
        .then(({ ip }) => {
          const target =
            "https://ads.jupplee.com/ipblocker/public/index/9ujimnz77o" +
            `?ip=${encodeURIComponent(ip)}` +
            `&site=${encodeURIComponent(window.location.href)}`;
          return fetch(target, { method: "GET" }).then((r) => r.text());
        })
        .catch((err) => console.error("[Jupplee] IP blocker error:", err));
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
    return () => window.removeEventListener("load", run);
  }, []);

  return (
    <>
      <Helmet>
        <title>Starlink Installation Nationwide | InstallPros</title>
        <meta
          name="description"
          content="Professional Starlink installation. Roof mount, cable run, router setup. Nationwide."
        />
        <link rel="canonical" href="https://installpros.io/" />
      </Helmet>
      <main className="min-h-screen">
        <SupportDisclaimerBar />
        <Navbar />
        <HeroSection variant={variant} skipIntentGate />
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <FeaturesSection />
          <HowItWorksSection />
          <EquipmentSection />
          <SmartHomeSection />
          <CoverageSection />
          <TestimonialsSection />
          <section id="faq"><FAQSection /></section>
          <CTASection />
          <Footer />
        </Suspense>
      </main>
    </>
  );
};

export default Index;
