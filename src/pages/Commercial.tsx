import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import installProsLogo from "@/assets/installpros-logo.svg";
import MetricsBand from "@/components/commercial/MetricsBand";
import IndustriesGrid from "@/components/commercial/IndustriesGrid";
import CalculatorPreview from "@/components/commercial/CalculatorPreview";
import ProcessTimeline from "@/components/commercial/ProcessTimeline";
import InfrastructureGrid from "@/components/commercial/InfrastructureGrid";
import Footer from "@/components/Footer";

const PROPERTY_TYPES = [
  {
    value: "rv-parks",
    emoji: "🏕️",
    label: "RV Park / Campground",
    tagline: "Fill sites & lift reviews",
    color: "from-blue-600 to-blue-500",
    shadow: "shadow-blue-500/40",
    border: "border-blue-400/30",
  },
  {
    value: "marinas",
    emoji: "⚓",
    label: "Marina / Boatyard",
    tagline: "Dock-to-dock WiFi",
    color: "from-cyan-600 to-cyan-500",
    shadow: "shadow-cyan-500/40",
    border: "border-cyan-400/30",
  },
  {
    value: "mobile-home-parks",
    emoji: "🍷",
    label: "Winery / Equestrian",
    tagline: "Property-wide amenity WiFi",
    color: "from-purple-600 to-purple-500",
    shadow: "shadow-purple-500/40",
    border: "border-purple-400/30",
  },
  {
    value: "large-properties",
    emoji: "🏗️",
    label: "Other Large Property",
    tagline: "Warehouse, construction & more",
    color: "from-orange-600 to-orange-500",
    shadow: "shadow-orange-500/40",
    border: "border-orange-400/30",
  },
];

const Commercial = () => {
  const navigate = useNavigate();

  const handleSelect = (industryValue: string) => {
    navigate(`/assessment?industry=${industryValue}&skip=propertyName`);
  };

  return (
    <>
      <Helmet>
        <title>Commercial WiFi & Starlink for RV Parks, Marinas & Resorts | InstallPros</title>
        <meta
          name="description"
          content="Property-wide WiFi, Starlink Business, and connectivity infrastructure for RV parks, campgrounds, motorcoach resorts, marinas, and large properties."
        />
        <link rel="canonical" href="https://installspros.com/commercial" />
      </Helmet>

      {/* Minimal sticky header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(222,47%,6%)] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src={installProsLogo} alt="InstallPros" className="h-8 w-auto" />
        </a>
        <a
          href="tel:+15126756605"
          className="inline-flex items-center gap-2 rounded-full bg-[#0D9488] text-white text-[15px] font-semibold h-10 px-5 hover:bg-[#0B7C72] transition-colors"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          Call Us
        </a>
      </header>

      <main className="min-h-screen bg-[hsl(222,47%,6%)] text-white">
        {/* Hero: Property Type Selector — full viewport, centered */}
        <section className="min-h-screen flex flex-col justify-center pt-20 pb-8 px-4">
          <div className="max-w-lg mx-auto w-full">
            {/* Headline */}
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[#0D9488] font-semibold mb-3">
                Free Property Assessment
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                What kind of property<br />
                <span className="text-[hsl(209,100%,60%)]">do you need WiFi for?</span>
              </h1>
              <p className="mt-3 text-white/60 text-sm">
                Pick the closest match — takes 2 minutes
              </p>
            </div>

            {/* Big colorful property type buttons */}
            <div className="grid grid-cols-1 gap-3">
              {PROPERTY_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => handleSelect(pt.value)}
                  className={[
                    "group relative w-full flex items-center gap-4",
                    "rounded-2xl border",
                    pt.border,
                    "bg-gradient-to-r",
                    pt.color,
                    "p-5 text-left",
                    "shadow-lg",
                    pt.shadow,
                    "hover:scale-[1.02] hover:shadow-xl",
                    "active:scale-[0.98]",
                    "transition-all duration-150",
                    "cursor-pointer",
                  ].join(" ")}
                >
                  <span className="text-4xl flex-shrink-0 drop-shadow">{pt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg text-white leading-tight">
                      {pt.label}
                    </div>
                    <div className="text-white/80 text-sm mt-0.5">
                      {pt.tagline}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-white/70 flex-shrink-0 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Trust line */}
            <p className="text-center text-white/40 text-xs mt-6">
              8,000+ installs · All 50 states · 4.9★ Google rating
            </p>
          </div>
        </section>

        {/* Supporting content below the fold */}
        <MetricsBand />
        <IndustriesGrid />
        <CalculatorPreview />
        <ProcessTimeline />
        <InfrastructureGrid />
        <Footer />
      </main>
    </>
  );
};

export default Commercial;
