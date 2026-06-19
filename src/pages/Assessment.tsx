import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InlineAssessmentForm from "@/components/commercial/InlineAssessmentForm";

const Assessment = () => {
  const [searchParams] = useSearchParams();
  const defaultIndustry = searchParams.get("industry") || undefined;
  const skipPropertyName = searchParams.get("skip") === "propertyName";

  return (
    <>
      <Helmet>
        <title>Free Property Connectivity Assessment | InstallPros</title>
        <meta
          name="description"
          content="Request a free commercial connectivity assessment for your RV park, marina, resort, or large property. Coverage feasibility, equipment plan, and revenue model."
        />
        <link rel="canonical" href="https://installspros.com/assessment" />
      </Helmet>
      <main className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <section className="pt-28 md:pt-36 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
              Free Property Assessment
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Let's design your property's network.
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl">
              A few quick questions. We'll come back with coverage feasibility,
              equipment plan, and ROI model.
            </p>
            <InlineAssessmentForm
              defaultIndustry={defaultIndustry}
              skipPropertyName={skipPropertyName}
            />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Assessment;
