import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Home, Building2, Ship, Caravan } from "lucide-react";
import residentialImage from "@/assets/starlink-residential.jpg";
import commercialImage from "@/assets/starlink-commercial.jpg";
import marineImage from "@/assets/starlink-marine.jpg";
import mobileImage from "@/assets/starlink-mobile.jpg";

const slides = [
  {
    id: "residential",
    title: "Residential Starlink",
    description: "Professional home installation with optimal roof positioning for maximum signal strength and reliability.",
    image: residentialImage,
    icon: Home,
    features: ["Optimal roof mounting", "Weather-resistant setup", "Signal optimization", "Same-day installation"],
  },
  {
    id: "commercial",
    title: "Commercial Starlink",
    description: "Enterprise-grade connectivity for offices, warehouses, and business facilities with dedicated support.",
    image: commercialImage,
    icon: Building2,
    features: ["Multi-unit installations", "Business-grade support", "Network integration", "Scalable solutions"],
  },
  {
    id: "marine",
    title: "Marine Starlink",
    description: "Stay connected at sea with durable marine-grade satellite installations built for the open water.",
    image: marineImage,
    icon: Ship,
    features: ["Saltwater resistant", "Motion-stabilized", "Maritime certified", "Global coverage"],
  },
  {
    id: "mobile",
    title: "Mobile/RV Starlink",
    description: "Internet anywhere you roam with portable and RV-mounted solutions for life on the road.",
    image: mobileImage,
    icon: Caravan,
    features: ["Quick setup", "Portable design", "RV compatible", "Travel-ready"],
  },
];

const FeaturesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const currentData = slides[currentSlide];
  const Icon = currentData.icon;

  return (
    <section 
      id="services" 
      className="relative min-h-[600px] md:min-h-[700px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images with crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30">
                <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
              </div>
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Installation Type
              </span>
            </div>

            <h2 
              key={`title-${currentSlide}`}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in"
            >
              {currentData.title}
            </h2>
            
            <p 
              key={`desc-${currentSlide}`}
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              {currentData.description}
            </p>

            {/* Features grid */}
            <div 
              key={`features-${currentSlide}`}
              className="grid grid-cols-2 gap-3 mb-8 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              {currentData.features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 text-gray-200"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Navigation dots and slide indicators */}
          <div className="flex flex-col items-center lg:items-end gap-8">
            {/* Slide cards */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
              {slides.map((slide, index) => {
                const SlideIcon = slide.icon;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left w-full",
                      index === currentSlide
                        ? "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg"
                        : "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      index === currentSlide ? "bg-primary text-black" : "bg-white/10 text-white"
                    )}>
                      <SlideIcon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-semibold text-sm md:text-base truncate",
                        index === currentSlide ? "text-white" : "text-gray-300"
                      )}>
                        {slide.title}
                      </p>
                      {index === currentSlide && (
                        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full animate-progress"
                            style={{ 
                              animation: isPaused ? "none" : "progress 5s linear forwards",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom navigation dots (mobile) */}
        <div className="flex justify-center gap-2 mt-8 lg:hidden">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentSlide 
                  ? "bg-primary w-8" 
                  : "bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}</style>
    </section>
  );
};

export default FeaturesCarousel;
