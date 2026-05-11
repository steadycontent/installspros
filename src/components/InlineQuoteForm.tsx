import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  MapPin, User, Mail, Phone, Wrench, 
  ArrowRight, ArrowLeft, Check, Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

const stepSchemas = {
  address: z.string().trim().min(5, "Please enter a valid address"),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().min(10, "Please enter a valid phone number"),
  installationType: z.string().min(1, "Please select an installation type"),
};

const installationTypes = [
  { value: "residential-starlink", label: "Residential Starlink", icon: "🏠" },
  { value: "commercial-starlink", label: "Commercial Starlink", icon: "🏢" },
  { value: "marine-starlink", label: "Marine Starlink", icon: "🚢" },
  { value: "mobile-starlink", label: "Mobile/RV Starlink", icon: "🚐" },
];

interface InlineQuoteFormProps {
  className?: string;
  theme?: "light" | "dark";
}

const InlineQuoteForm = ({ className, theme = "light" }: InlineQuoteFormProps) => {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    email: "",
    phone: "",
    installationType: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { predictions, isLoading: isPredictionsLoading, isAvailable: isAutocompleteAvailable, fetchPredictions, clearPredictions } = useAddressAutocomplete();

  // Check for pre-filled address from session storage
  useEffect(() => {
    const heroAddress = sessionStorage.getItem("heroAddress");
    if (heroAddress) {
      setFormData(prev => ({ ...prev, address: heroAddress }));
      setCurrentStep(1); // Skip to next step
      sessionStorage.removeItem("heroAddress"); // Clean up
    }
  }, []);

  const handleAddressSelect = useCallback((address: string) => {
    setFormData(prev => ({ ...prev, address }));
    setErrors({});
    setShowSuggestions(false);
    clearPredictions();
  }, [clearPredictions]);

  const handleAddressChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
    setErrors({});
    fetchPredictions(value);
    setShowSuggestions(true);
  }, [fetchPredictions]);

  const steps = [
    {
      key: "address" as const,
      title: "Where should we install?",
      subtitle: "Enter your installation address",
      icon: MapPin,
      placeholder: "123 Main St, City, State ZIP",
      type: "text",
    },
    {
      key: "name" as const,
      title: "What's your name?",
      subtitle: "So we know who to contact",
      icon: User,
      placeholder: "John Smith",
      type: "text",
    },
    {
      key: "email" as const,
      title: "What's your email?",
      subtitle: "We'll send your quote here",
      icon: Mail,
      placeholder: "john@example.com",
      type: "email",
    },
    {
      key: "phone" as const,
      title: "What's your phone number?",
      subtitle: "For scheduling your installation",
      icon: Phone,
      placeholder: "(555) 123-4567",
      type: "tel",
    },
    {
      key: "installationType" as const,
      title: "What do you need installed?",
      subtitle: "Select the service you're interested in",
      icon: Wrench,
      type: "select",
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = (): boolean => {
    const key = currentStepData.key;
    const schema = stepSchemas[key];
    const result = schema.safeParse(formData[key]);
    
    if (!result.success) {
      setErrors({ [key]: result.error.errors[0].message });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < steps.length - 1) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection("backward");
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentStepData.type !== "select") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      sessionStorage.setItem("quoteFormData", JSON.stringify(formData));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Quote Request Submitted!",
        description: "We'll be in touch shortly.",
      });
      
      navigate("/thank-you");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputField = () => {
    const Icon = currentStepData.icon;
    const key = currentStepData.key;
    
    if (currentStepData.type === "select") {
      return (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {installationTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => {
                setFormData({ ...formData, installationType: type.value });
                setErrors({});
              }}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all duration-200",
                "hover:border-primary",
                isDark ? "hover:bg-primary/20" : "hover:bg-primary/5",
                formData.installationType === type.value
                  ? isDark 
                    ? "border-primary bg-primary/20 shadow-lg" 
                    : "border-primary bg-primary/10 shadow-lg"
                  : isDark 
                    ? "border-white/20 bg-white/5" 
                    : "border-border bg-background"
              )}
            >
              <span className="text-2xl mb-2 block">{type.icon}</span>
              <span className={cn(
                "font-medium text-sm",
                isDark ? "text-white" : "text-foreground"
              )}>{type.label}</span>
            </button>
          ))}
        </div>
      );
    }

    const isAddressField = key === "address";

    if (isAddressField) {
      return (
        <div className="relative mt-6 group">
          <Icon className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 group-focus-within:text-primary transition-colors duration-300 z-10",
            isDark ? "text-white/50" : "text-muted-foreground"
          )} />
          <Input
            ref={addressInputRef}
            type="text"
            placeholder={currentStepData.placeholder}
            value={formData.address}
            onChange={(e) => handleAddressChange(e.target.value)}
            onFocus={() => predictions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            data-hj-allow
            className={cn(
              "pl-10 h-14 text-xl md:text-2xl font-medium bg-transparent border-0 border-b-2 rounded-none focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300",
              isDark 
                ? "border-white/30 text-white placeholder:text-white/40" 
                : "border-muted-foreground/30 placeholder:text-muted-foreground/40"
            )}
            autoFocus
          />
          {isPredictionsLoading && (
            <Loader2 className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin",
              isDark ? "text-white/50" : "text-muted-foreground"
            )} />
          )}
          {showSuggestions && predictions.length > 0 && (
            <div className={cn(
              "absolute z-50 w-full mt-2 rounded-xl shadow-lg max-h-64 overflow-auto",
              isDark 
                ? "bg-gray-900/95 backdrop-blur-md border border-white/20" 
                : "bg-background border border-border"
            )}>
              {predictions.map((prediction) => (
                <button
                  key={prediction.placeId}
                  type="button"
                  onClick={() => handleAddressSelect(prediction.description)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors flex items-start gap-3 border-b last:border-0",
                    isDark 
                      ? "hover:bg-white/10 border-white/10" 
                      : "hover:bg-muted border-border"
                  )}
                >
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className={cn(
                      "font-medium",
                      isDark ? "text-white" : "text-foreground"
                    )}>{prediction.mainText}</div>
                    <div className={cn(
                      "text-sm",
                      isDark ? "text-white/60" : "text-muted-foreground"
                    )}>{prediction.secondaryText}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {!isAutocompleteAvailable && formData.address.length >= 3 && (
            <p className={cn(
              "text-xs mt-2",
              isDark ? "text-white/50" : "text-muted-foreground"
            )}>
              Enter your full address manually
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="relative mt-6 group">
        <Icon className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 group-focus-within:text-primary transition-colors duration-300",
          isDark ? "text-white/50" : "text-muted-foreground"
        )} />
        <Input
          type={currentStepData.type}
          placeholder={currentStepData.placeholder}
          value={formData[key]}
          onChange={(e) => {
            setFormData({ ...formData, [key]: e.target.value });
            setErrors({});
          }}
          onKeyDown={handleKeyDown}
          data-hj-allow
          className={cn(
            "pl-10 h-14 text-xl md:text-2xl font-medium bg-transparent border-0 border-b-2 rounded-none focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300",
            isDark 
              ? "border-white/30 text-white placeholder:text-white/40" 
              : "border-muted-foreground/30 placeholder:text-muted-foreground/40"
          )}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div className={cn(
      "rounded-2xl shadow-xl overflow-hidden",
      isDark 
        ? "bg-white/5 backdrop-blur-md border border-white/10" 
        : "bg-card border border-border",
      className
    )}>
      {/* Progress bar */}
      <div className={cn("h-1", isDark ? "bg-white/10" : "bg-muted")}>
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Step indicator */}
        <div className={cn("text-sm mb-2", isDark ? "text-white/60" : "text-muted-foreground")}>
          {currentStep + 1} of {steps.length}
        </div>

        {/* Animated content */}
        <div
          key={currentStep}
          className={cn(
            "transition-all duration-300",
            direction === "forward" 
              ? "animate-fade-in" 
              : "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-xl md:text-2xl font-bold mb-1",
            isDark ? "text-white" : "text-foreground"
          )}>
            {currentStepData.title}
          </h2>
          <p className={isDark ? "text-white/70" : "text-muted-foreground"}>
            {currentStepData.subtitle}
          </p>

          {renderInputField()}

          {errors[currentStepData.key] && (
            <p className="text-destructive text-sm mt-2 animate-fade-in">
              {errors[currentStepData.key]}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-end gap-4 mt-8">
          {currentStepData.type !== "select" && (
            <p className={cn(
              "text-xs",
              isDark ? "text-white/50" : "text-muted-foreground"
            )}>
              Press <kbd className={cn(
                "px-2 py-1 rounded",
                isDark ? "bg-white/10 text-white" : "bg-muted text-foreground"
              )}>Enter ↵</kbd> to continue
            </p>
          )}

          <Button
            onClick={handleNext}
            disabled={isSubmitting || (currentStepData.type === "select" && !formData.installationType)}
            className="px-6 py-3 rounded-xl font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Get My Quote
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InlineQuoteForm;
