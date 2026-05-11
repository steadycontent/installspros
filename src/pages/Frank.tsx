import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroWithCarousel from "@/components/HeroWithCarousel";
import HowItWorksSection from "@/components/HowItWorksSection";
import EquipmentSection from "@/components/EquipmentSection";
import SmartHomeSection from "@/components/SmartHomeSection";
import CoverageSection from "@/components/CoverageSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Frank = () => {
  return (
    <>
      <Helmet>
        <title>InstallPros – Starlink Installation & Smart Home Experts</title>
        <meta
          name="description"
          content="All-in-One Starlink installation services and smart home automation solutions across the U.S. Expert nationwide installs with the best pricing."
        />
        <meta name="keywords" content="Starlink installation, smart home, satellite internet, home automation, security systems" />
        <link rel="canonical" href="https://installpros.io/frank" />
      </Helmet>

      <main className="min-h-screen">
        <Navbar />
        <HeroWithCarousel />
        <HowItWorksSection />
        <EquipmentSection />
        <SmartHomeSection />
        <CoverageSection />
        <TestimonialsSection />
        <section id="faq">
          <FAQSection />
        </section>
        <CTASection />
        <Footer />
      </main>
    </>
  );
};

export default Frank;
