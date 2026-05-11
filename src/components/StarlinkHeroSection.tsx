import { useState, useRef, useCallback } from "react";
import { Loader2, Check, ArrowRight, Star, Satellite, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-starscape.jpg";

interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

const useAddressAutocomplete = () => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const sessionTokenRef = useRef<string>(crypto.randomUUID());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchPredictions = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setPredictions([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!supabase) {
        setIsAvailable(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("google-places-autocomplete", {
          body: { 
            input, 
            sessionToken: sessionTokenRef.current 
          },
        });

        if (error) {
          console.error("Error fetching predictions:", error);
          setIsAvailable(false);
          setPredictions([]);
          return;
        }

        setPredictions(data?.predictions || []);
      } catch (err) {
        console.error("Error:", err);
        setIsAvailable(false);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
    sessionTokenRef.current = crypto.randomUUID();
  }, []);

  return { predictions, isLoading, isAvailable, fetchPredictions, clearPredictions };
};

const StarlinkHeroSection = () => {
  const [address, setAddress] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const { predictions, isLoading, isAvailable, fetchPredictions, clearPredictions } = useAddressAutocomplete();

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setIsAddressSelected(false);
    fetchPredictions(value);
    setShowSuggestions(true);
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setIsAddressSelected(true);
    setShowSuggestions(false);
    clearPredictions();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.length >= 5) {
      // Store selected address and scroll to form
      sessionStorage.setItem("heroAddress", address);
      const formSection = document.getElementById("quote-form");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Gradient Overlay - Mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001a2e]/60 via-[#000a1a]/70 to-[#000000]/85 md:hidden" />

      {/* Gradient Overlay - Desktop */}
      <div className="absolute inset-0 hidden md:block bg-gradient-to-b from-[#001a2e]/40 via-[#000a1a]/50 to-[#000000]/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="opacity-0 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
            <Satellite className="w-4 h-4" />
            Certified Starlink Installation Experts
          </span>
        </div>

        {/* H1 Title */}
        <h1 className="opacity-0 animate-fade-in-up animation-delay-100 mt-8 text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
          High-Speed Internet
          <br className="hidden sm:block" />
          <span className="text-primary"> Anywhere You Live</span>
        </h1>

        {/* Subtitle */}
        <p className="opacity-0 animate-fade-in-up animation-delay-200 mt-6 text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto">
          Professional Starlink installation by certified technicians. Get connected to 
          high-speed satellite internet with expert mounting, configuration, and optimization.
        </p>

        {/* Address Form */}
        <form
          onSubmit={handleSubmit}
          className="opacity-0 animate-fade-in-up animation-delay-300 mt-10 max-w-xl mx-auto"
        >
          <div className="relative">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 z-10" />
                <Input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() => predictions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="h-14 pl-12 pr-12 bg-black/80 border-white/20 text-white placeholder:text-white/50 text-lg rounded-xl focus:border-primary focus:ring-primary"
                />
                {/* Status Icons */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isLoading && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {isAddressSelected && !isLoading && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={address.length < 5}
                className="h-14 px-6 rounded-xl"
              >
                <span className="hidden sm:inline">Get Started</span>
                <ArrowRight className="w-5 h-5 sm:ml-2" />
              </Button>
            </div>

            {/* Address Suggestions Dropdown */}
            {showSuggestions && predictions.length > 0 && (
              <div className="absolute z-[9999] w-full mt-2 bg-black/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 max-h-64 overflow-auto">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.placeId}
                    type="button"
                    onClick={() => handleAddressSelect(prediction.description)}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-start gap-3 border-b border-white/5 last:border-0"
                  >
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-white">{prediction.mainText}</div>
                      <div className="text-sm text-white/60">{prediction.secondaryText}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Fallback message */}
            {!isAvailable && address.length >= 3 && (
              <p className="text-xs text-white/60 mt-2 text-left">
                Enter your full address manually
              </p>
            )}
          </div>
        </form>

        {/* Trust Marks */}
        <div className="opacity-0 animate-fade-in-up animation-delay-400 mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {/* Google Rating */}
          <div className="col-span-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-white font-bold text-lg">5.0</span>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white/60 text-xs mt-1">Google Reviews</span>
          </div>

          {/* Trustpilot */}
          <div className="col-span-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-1">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#00B67A"/>
              </svg>
              <span className="text-white font-bold">Trustpilot</span>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#00B67A] flex items-center justify-center">
                  <Star className="w-3 h-3 fill-white text-white" />
                </div>
              ))}
            </div>
            <span className="text-white/60 text-xs mt-1">Excellent</span>
          </div>

          {/* Stats */}
          <div className="col-span-2 md:col-span-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-white font-bold text-2xl">5,000+</span>
            <span className="text-white/60 text-xs">Installations Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StarlinkHeroSection;
