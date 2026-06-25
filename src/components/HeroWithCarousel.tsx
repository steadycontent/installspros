import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import InlineQuoteFlow from "@/components/InlineQuoteFlow";
import residentialAsset from "@/assets/starlink-residential-opt.webp.asset.json";
import commercialImage from "@/assets/starlink-commercial-opt.webp";
import mobileImage from "@/assets/starlink-mobile-rv-new-opt.webp";
const slides = [{
  id: "residential",
  title: "Residential Satellite Internet",
  image: residentialAsset.url
}, {
  id: "commercial",
  title: "Commercial Satellite Internet",
  image: commercialImage
}, {
  id: "mobile",
  title: "Mobile/RV Satellite Internet",
  image: mobileImage
}];
const HeroWithCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, []);
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images with crossfade */}
      {slides.map((slide, index) => <div key={slide.id} className={cn("absolute inset-0 transition-opacity duration-1000", index === currentSlide ? "opacity-100" : "opacity-0",
    // Mobile slide gets a gradient background to blend the image edges
    slide.id === "mobile" && "bg-gradient-to-b from-[#0a1628] via-[#0a0f1a] to-black")}>
          <img src={slide.image} alt={slide.title} className={cn("w-full h-full object-cover", slide.id === "mobile" ? "brightness-[2.25] contrast-[1.1] object-[20%_top]" : "brightness-150")} />
        </div>)}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-64 sm:pt-72 pb-16 sm:pb-24">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#00A3FF] animate-fade-in-up mb-4 sm:mb-6 text-center leading-tight [word-break:keep-all] [overflow-wrap:normal] [hyphens:none] whitespace-nowrap w-full">
          Complete Satellite Internet Installation Solutions
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 animate-fade-in-up opacity-0 animation-delay-200 text-center px-4 sm:px-6 [word-break:keep-all] [overflow-wrap:normal] [hyphens:none]" style={{
        animationFillMode: 'forwards'
      }}>
          Expert nationwide installs with the best pricing on satellite internet hardware and smart home integrations.
        </p>
        
        {/* Inline Quote Form with dark backdrop */}
        <div className="bg-black/50 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 animate-fade-in-up opacity-0 animation-delay-400 my-0" style={{
        animationFillMode: 'forwards'
      }}>
          <InlineQuoteFlow variant="transparent" />
        </div>
      </div>

      {/* Dot indicators - bottom left */}
      <div className="absolute bottom-8 left-8 flex gap-3 z-20">
        {slides.map((slide, index) => <button key={slide.id} onClick={() => goToSlide(index)} aria-label={slide.title} className={cn("w-3 h-3 rounded-full transition-all duration-300", index === currentSlide ? "bg-primary scale-110 opacity-100" : "bg-black/80 hover:bg-black")} />)}
      </div>

      {/* Scroll indicator - hidden on small screens */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-float hidden sm:block">
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>;
};
export default HeroWithCarousel;