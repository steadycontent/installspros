import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fireGoogleAdsConversion } from "@/lib/googleAds";
import { fireMetaLeadEvent } from "@/lib/metaPixel";

const ThankYouAssessment = () => {
  useEffect(() => {
    try { fireGoogleAdsConversion(); } catch { /* noop */ }
    try { fireMetaLeadEvent(); } catch { /* noop */ }
  }, []);

  return (
    <>
      <Helmet>
        <title>Assessment Requested | InstallPros</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Assessment requested.
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-8">
              We'll be in touch within one business day with feasibility,
              equipment, and ROI for your property.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+15126756605"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-primary text-primary-foreground h-12 px-6 font-semibold"
              >
                Call (512) 675-6605
              </a>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-white/20 h-12 px-6 font-semibold hover:bg-white/10"
              >
                Back to Home
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default ThankYouAssessment;
