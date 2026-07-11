import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import rvParkImg from "@/assets/property-rv-park.jpg";
import marinaImg from "@/assets/property-marina.jpg";
import wineryImg from "@/assets/property-winery.jpg";
import largePropertyImg from "@/assets/property-large.jpg";
import { fireMetaPixelEvent } from "@/lib/metaPixel";
import MetricsBand from "@/components/commercial/MetricsBand";
import IndustriesGrid from "@/components/commercial/IndustriesGrid";
import CalculatorPreview from "@/components/commercial/CalculatorPreview";
import ProcessTimeline from "@/components/commercial/ProcessTimeline";
import InfrastructureGrid from "@/components/commercial/InfrastructureGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const PROPERTY_TYPES = [
  {
    value: "rv-parks",
    image: rvParkImg,
    label: "RV Park / Campground",
    tagline: "Fill sites & lift reviews",
    shadow: "shadow-blue-500/15",
  },
  {
    value: "marinas",
    image: marinaImg,
    label: "Marina / Boatyard",
    tagline: "Dock-to-dock WiFi",
    shadow: "shadow-cyan-500/15",
  },
  {
    value: "mobile-home-parks",
    image: wineryImg,
    label: "Winery / Equestrian",
    tagline: "Property-wide amenity WiFi",
    shadow: "shadow-purple-500/15",
  },
  {
    value: "large-properties",
    image: largePropertyImg,
    label: "Other Large Property",
    tagline: "Warehouse, construction & more",
    shadow: "shadow-orange-500/15",
  },
];


const Commercial = () => {
  const navigate = useNavigate();

  const handleSelect = (industryValue: string) => {
    // Micro-conversion: gives Meta signal before the full Lead event fires
    try { fireMetaPixelEvent("InitiateCheckout", { content_category: industryValue }); } catch { /* noop */ }
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

      <Navbar />

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
            <div className="grid grid-cols-1 gap-4">
              {PROPERTY_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => handleSelect(pt.value)}
                  className={[
                    "group relative w-full overflow-hidden",
                    "rounded-2xl border border-white/10",
                    "h-32 text-left",
                    "shadow-lg",
                    pt.shadow,
                    "hover:scale-[1.02] hover:shadow-xl",
                    "active:scale-[0.98]",
                    "transition-all duration-150",
                    "cursor-pointer",
                  ].join(" ")}
                >
                  <img
                    src={pt.image}
                    alt={pt.label}
                    loading="lazy"
                    width={800}
                    height={512}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={[
                      "absolute inset-0 bg-gradient-to-r",
                      pt.value === "rv-parks"
                        ? "from-black/85 via-black/45 to-transparent"
                        : "from-black/90 via-black/60 to-transparent",
                    ].join(" ")}
                  />
                  <div className="relative h-full flex items-center gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xl text-white leading-tight drop-shadow">
                        {pt.label}
                      </div>
                      <div className="text-white/85 text-base mt-0.5 drop-shadow">
                        {pt.tagline}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-white flex-shrink-0 group-hover:translate-x-1 transition-transform drop-shadow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
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
