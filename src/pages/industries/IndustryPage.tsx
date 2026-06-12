import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssessmentCTA from "@/components/commercial/AssessmentCTA";
import { getIndustry } from "@/lib/industries";

const IndustryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const industry = getIndustry(slug || "");

  if (!industry) return <Navigate to="/" replace />;

  return (
    <>
      <Helmet>
        <title>{industry.seoTitle}</title>
        <meta name="description" content={industry.seoDescription} />
        <link rel="canonical" href={`https://installpros.io/industries/${industry.slug}`} />
      </Helmet>
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-dark-bg text-white pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="absolute inset-0 -z-10">
            <img
              src={industry.image}
              alt={industry.label}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
              {industry.label}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl leading-[1.05]">
              {industry.headline}
            </h1>
            <p className="mt-5 text-base md:text-xl text-white/75 max-w-2xl">
              {industry.intro}
            </p>
            <div className="mt-8">
              <Link
                to={`/assessment?industry=${industry.slug}`}
                className="inline-flex items-center gap-2 rounded-[4px] bg-primary text-primary-foreground h-14 px-6 font-semibold hover:bg-primary/90 transition-colors"
              >
                {industry.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pain points + Challenges */}
        <section className="bg-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                What we keep hearing.
              </h2>
              <ul className="space-y-3">
                {industry.painPoints.map((p) => (
                  <li key={p} className="flex gap-3 text-muted-foreground">
                    <span className="text-destructive mt-1">✕</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5">
                The connectivity challenges.
              </h2>
              <ul className="space-y-3">
                {industry.challenges.map((p) => (
                  <li key={p} className="flex gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Revenue impact */}
        <section className="bg-dark-bg text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 max-w-2xl">
              What the right network unlocks.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industry.revenueImpact.map((r) => (
                <div
                  key={r}
                  className="rounded-[4px] border border-white/10 bg-white/5 p-5"
                >
                  <Check className="w-5 h-5 text-primary mb-2" />
                  <p>{r}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {industry.roiExample.map((r) => (
                <div
                  key={r.label}
                  className="rounded-[4px] border border-primary/30 bg-primary/10 p-6"
                >
                  <div className="text-xs uppercase tracking-wider opacity-70">
                    {r.label}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mt-1">
                    {r.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs opacity-50 mt-4">
              Illustrative — request your assessment for property-specific numbers.
            </p>
          </div>
        </section>

        <AssessmentCTA />
        <Footer />
      </main>
    </>
  );
};

export default IndustryPage;
