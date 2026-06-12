import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SupportDisclaimerBar from "@/components/SupportDisclaimerBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { useVariant } from "@/hooks/useVariant";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import EquipmentSection from "@/components/EquipmentSection";
import SmartHomeSection from "@/components/SmartHomeSection";
import CoverageSection from "@/components/CoverageSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

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
        <FeaturesSection />
        <HowItWorksSection />
        <EquipmentSection />
        <SmartHomeSection />
        <CoverageSection />
        <TestimonialsSection />
        <section id="faq"><FAQSection /></section>
        <CTASection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
