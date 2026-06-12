import { Link } from "react-router-dom";
import { ArrowRight, Calculator, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/commercial/hero-rv-resort-coverage.jpg";

const CommercialHero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-dark-bg text-white pt-24 pb-12 md:pt-32 md:pb-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Aerial view of a large RV resort with WiFi coverage overlay"
          className="w-full h-full object-cover opacity-50"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, rgba(30,144,255,0.35) 0px, transparent 40%), radial-gradient(circle at 70% 60%, rgba(30,144,255,0.25) 0px, transparent 40%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Commercial Connectivity Infrastructure
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
          Reliable Internet Across Your{" "}
          <span className="text-primary">Entire Property.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
          Commercial Starlink, WiFi infrastructure, and connectivity systems
          for RV parks, resorts, campgrounds, marinas, and large properties.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl">
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-primary text-primary-foreground h-14 px-6 font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Get Free Property Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-white/20 bg-white/5 backdrop-blur h-14 px-6 font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Calculate Revenue Impact
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            30,000+ installs nationwide
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Licensed in 37 states
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            4.9★ Google rating
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommercialHero;
