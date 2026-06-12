import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommercialHero from "@/components/commercial/CommercialHero";
import MetricsBand from "@/components/commercial/MetricsBand";
import IndustriesGrid from "@/components/commercial/IndustriesGrid";
import CalculatorPreview from "@/components/commercial/CalculatorPreview";
import ProcessTimeline from "@/components/commercial/ProcessTimeline";
import InfrastructureGrid from "@/components/commercial/InfrastructureGrid";
import AssessmentCTA from "@/components/commercial/AssessmentCTA";

const Index = () => (
  <>
    <Helmet>
      <title>Commercial WiFi & Starlink for RV Parks, Marinas & Resorts | InstallPros</title>
      <meta
        name="description"
        content="Property-wide WiFi, Starlink Business, and connectivity infrastructure for RV parks, campgrounds, motorcoach resorts, marinas, and large properties."
      />
      <link rel="canonical" href="https://installpros.io/" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <Navbar />
      <CommercialHero />
      <MetricsBand />
      <IndustriesGrid />
      <CalculatorPreview />
      <ProcessTimeline />
      <InfrastructureGrid />
      <AssessmentCTA />
      <Footer />
    </main>
  </>
);

export default Index;
