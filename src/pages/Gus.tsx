import { Helmet } from "react-helmet-async";
import GusNavbar from "@/components/GusNavbar";
import HeroSection from "@/components/HeroSection";
import { useVariant } from "@/hooks/useVariant";
import FeaturesSection from "@/components/FeaturesSection";
import GusValueProps from "@/components/GusValueProps";
import HowItWorksSection from "@/components/HowItWorksSection";

import GusInteractiveCoverageMap from "@/components/GusInteractiveCoverageMap";
import ProfessionalInstallation from "@/components/ProfessionalInstallation";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Gus = () => {
  const variant = useVariant();

  return (
    <>
      <Helmet>
        <title>InstallPros – Starlink Installation & Smart Home Experts</title>
        <meta
          name="description"
          content="All-in-One Starlink installation services and smart home automation solutions across the U.S. Expert nationwide installs with the best pricing."
        />
        <meta name="keywords" content="Starlink installation, smart home, satellite internet, home automation, security systems" />
        <link rel="canonical" href="https://installpros.io/gus" />
      </Helmet>

      <main className="min-h-screen">
        <GusNavbar />
        <HeroSection
          variant={variant}
          installCount="3,488+"
          installLabel="Installations"
          heading={"Get Starlink Installed\nThis Week"}
          subheading={"Expert mounting, weatherproof sealing & full setup.\nMost customers are online within 7 days."}
          badgeAboveHeading
          hideInstallDisclaimer
          addressFirst
          addressButtonLabel="Next"
          addressStepTitle="Check availability in your area"
          hideCompletedSummary
          skipIntentGate
          submitButtonLabel="Check Availability"
          continueButtonLabel="Next"
          inlineTrustBadges={false}
          badgeText="⚡ Same-Week Installs Available"
          hideScrollIndicator
          showTrustBadges
        />
        <FeaturesSection />
        <HowItWorksSection maxSteps={3} />
        <GusValueProps />
        
        <GusInteractiveCoverageMap />
        <ProfessionalInstallation />
        <TestimonialsSection />
        <section id="faq">
          <FAQSection />
        </section>
        <CTASection installCount="3,488+" statesServed="49" heading="Don't Wait — Get Installed This Week" subheading="Join thousands who skipped the DIY headache. Professional setup, guaranteed." hidePhoneCTA />
        <Footer />
      </main>
    </>
  );
};

export default Gus;
