import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  MapPin, User, Mail, Phone, Wrench,
  ArrowRight, Check, Loader2,
  Home, Building2, Ship, Caravan } from
"lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useUrlParams } from "@/contexts/UrlParamsContext";
import { parseAddress } from "@/lib/parseAddress";
import { trackFunnelStep, trackFormSubmit } from "@/lib/analytics/tracker";
import { fireGoogleAdsConversion } from "@/lib/googleAds";
import { setBingUetUserData } from "@/lib/bingUet";

interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  zip?: string | null;
}

interface PlaceDetails {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Detect device type from user agent
const detectDeviceType = (): "mobile" | "tablet" | "desktop" => {
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Mobi|Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
};

// Helper function for phone number formatting
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// Haptic feedback utility
const triggerHaptic = (pattern: number | number[] = 15) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

// Address abbreviation helper
const abbreviateAddress = (text: string): string => {
  const abbreviations: Record<string, string> = {
    'Street': 'St',
    'Avenue': 'Ave',
    'Boulevard': 'Blvd',
    'Drive': 'Dr',
    'Lane': 'Ln',
    'Road': 'Rd',
    'Court': 'Ct',
    'Circle': 'Cir',
    'Place': 'Pl',
    'Terrace': 'Ter',
    'Highway': 'Hwy',
    'Parkway': 'Pkwy',
    'Square': 'Sq',
    'South': 'S',
    'North': 'N',
    'East': 'E',
    'West': 'W',
    'Northeast': 'NE',
    'Northwest': 'NW',
    'Southeast': 'SE',
    'Southwest': 'SW'
  };

  let result = text;
  for (const [full, abbr] of Object.entries(abbreviations)) {
    // Match whole words only
    result = result.replace(new RegExp(`\\b${full}\\b`, 'gi'), abbr);
  }
  return result;
};

// Format prediction for display with abbreviations and zip code
const formatPredictionDisplay = (mainText: string, secondaryText: string, zip?: string | null): {main: string;secondary: string;} => {
  const cleanSecondary = secondaryText.replace(/, USA$/i, '').trim();
  return {
    main: abbreviateAddress(mainText),
    secondary: zip ? `${cleanSecondary} ${zip}` : cleanSecondary
  };
};

// Hook for fetching address predictions and place details from edge function
const useAddressAutocomplete = () => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
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
          }
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

  // Fetch place details to get full address with ZIP
  const fetchPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!supabase) return null;

    setIsFetchingDetails(true);
    try {
      const { data, error } = await supabase.functions.invoke("google-places-autocomplete", {
        body: {
          placeId,
          sessionToken: sessionTokenRef.current
        }
      });

      if (error) {
        console.error("Error fetching place details:", error);
        return null;
      }

      return data?.placeDetails || null;
    } catch (err) {
      console.error("Error:", err);
      return null;
    } finally {
      setIsFetchingDetails(false);
    }
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
    sessionTokenRef.current = crypto.randomUUID();
  }, []);

  return { predictions, isLoading, isFetchingDetails, isAvailable, fetchPredictions, fetchPlaceDetails, clearPredictions };
};

// Validation schemas for each step (hardened with max-length + HTML rejection)
const noHtmlChars = (val: string) => !/<|>/.test(val);
const stepSchemas = {
  address: z.string().trim().min(5, "Please enter a valid address").max(500, "Address is too long"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long").
  refine(noHtmlChars, "Name contains invalid characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20, "Phone number is too long"),
  installationType: z.string().min(1, "Please select an installation type")
};

const installationTypes = [
{ value: "residential", label: "Residential", icon: Home },
{ value: "commercial", label: "Commercial", icon: Building2 },
{ value: "marine", label: "Marine", icon: Ship },
{ value: "mobile", label: "Mobile/RV", icon: Caravan }];


interface InlineQuoteFlowProps {
  variant?: "card" | "transparent";
  addressFirst?: boolean;
  addressButtonLabel?: string;
  addressStepTitle?: string;
  hideCompletedSummary?: boolean;
  submitButtonLabel?: string;
  continueButtonLabel?: string;
  trustBadges?: React.ReactNode;
  hideSubtitles?: boolean;
}

const InlineQuoteFlow = ({ variant = "card", addressFirst = false, addressButtonLabel, addressStepTitle, hideCompletedSummary = false, submitButtonLabel, continueButtonLabel, trustBadges, hideSubtitles = false }: InlineQuoteFlowProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParams = useUrlParams();

  // currentStep initialized below after steps array is built
  const initialStepRef = useRef<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    email: "",
    phone: "",
    installationType: "residential" // Pre-selected since 90% of business is residential
  });
  // Store parsed address components separately
  const [addressComponents, setAddressComponents] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });
  // Track if user selected from autocomplete
  const [isAddressFromAutocomplete, setIsAddressFromAutocomplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const addressDisplayRef = useRef<HTMLDivElement>(null);
  const generalInputRef = useRef<HTMLInputElement>(null);
  const { predictions, isLoading: isPredictionsLoading, isFetchingDetails, isAvailable: isAutocompleteAvailable, fetchPredictions, fetchPlaceDetails, clearPredictions } = useAddressAutocomplete();

  // Partial lead capture refs
  const hasSubmittedRef = useRef(false);
  const partialLeadArmedRef = useRef(false);
  const partialSentRef = useRef(sessionStorage.getItem("partialSent") === "true"); // Synchronous dedup guard
  const visibilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendPartialLeadRef = useRef<() => void>(() => {});

  const defaultSteps = [
  {
    key: "installationType" as const,
    title: "What type of installation?",
    subtitle: "",
    icon: Wrench,
    type: "select",
    buttonLabel: "Get My Quote"
  },
  {
    key: "name" as const,
    title: "What's your name?",
    subtitle: "So we know who to contact",
    icon: User,
    placeholder: "John Smith",
    type: "text",
    buttonLabel: "Continue"
  },
  {
    key: "phone" as const,
    title: "What's your phone number?",
    subtitle: "For scheduling your installation",
    icon: Phone,
    placeholder: "(555) 123-4567",
    type: "tel",
    buttonLabel: "Get My Estimate"
  },
  {
    key: "email" as const,
    title: "What's your email?",
    subtitle: "",
    icon: Mail,
    placeholder: "john@example.com",
    type: "email",
    buttonLabel: "Send My Results"
  },
  {
    key: "address" as const,
    title: addressStepTitle || "Where should we install?",
    subtitle: "Used to confirm service availability",
    icon: MapPin,
    placeholder: "123 Main St",
    type: "text",
    buttonLabel: "Check Availability"
  }];


  // When addressFirst is true, move address to first and type to second
  const steps = addressFirst ?
  [defaultSteps[4], defaultSteps[0], ...defaultSteps.slice(1, 4)] :
  defaultSteps;
  // Derive step names from steps for URL sync
  const stepNames: string[] = steps.map((s) => s.key === "installationType" ? "type" : s.key);

  // Compute initial step from URL (only once)
  if (initialStepRef.current === null) {
    const param = searchParams.get("step");
    const idx = stepNames.indexOf(param || "");
    initialStepRef.current = idx >= 0 ? idx : 0;
  }
  const [currentStep, setCurrentStep] = useState(initialStepRef.current);

  const currentStepData = steps[currentStep];
  const isTransparent = variant === "transparent";
  const totalSteps = steps.length;

  // Sync URL query param with current step
  useEffect(() => {
    trackFunnelStep(currentStep, { step_name: steps[currentStep]?.key });
    const sNames = stepNames;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (currentStep <= 1) {
        next.delete("step");
      } else {
        next.set("step", sNames[currentStep] || String(currentStep));
      }
      return next;
    }, { replace: currentStep <= 1 });
  }, [currentStep]);

  // Handle browser back/forward button
  useEffect(() => {
    const sNames: string[] = steps.map((s) => s.key === "installationType" ? "type" : s.key);
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const stepParam = params.get("step");
      const idx = sNames.indexOf(stepParam || "");
      if (idx >= 0 && idx !== currentStep) {
        setDirection(idx < currentStep ? "backward" : "forward");
        setCurrentStep(idx);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep]);

  // Keep sendPartialLeadRef updated with latest closure values
  useEffect(() => {
    sendPartialLeadRef.current = () => {
      if (partialSentRef.current || hasSubmittedRef.current) return;
      if (!partialLeadArmedRef.current) return;
      // Don't send partial leads without a communication method
      const emailCheck = stepSchemas.email.safeParse(formData.email);
      const hasPhone = formData.phone && formData.phone.trim().length > 0;
      const hasEmail = emailCheck.success;
      if (!hasPhone && !hasEmail) return;

      partialSentRef.current = true; // Synchronous guard — blocks all subsequent calls

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!supabaseUrl || !supabaseKey) return;

      const beaconUrl = `${supabaseUrl}/functions/v1/forward-lead-webhook`;
      const searchParams = new URLSearchParams(window.location.search);
      const fbclid = searchParams.get("fbclid") || sessionStorage.getItem("installpros_fbclid") || "";

      // Send empty string if email isn't a valid format (avoids breaking Zapier)
      const emailVal = stepSchemas.email.safeParse(formData.email);
      const safeEmail = emailVal.success ? formData.email : "";

      const payload = {
        name: formData.name,
        email: safeEmail,
        phone: formData.phone,
        street: addressComponents.street || "",
        city: addressComponents.city || "",
        state: addressComponents.state || "",
        zip: addressComponents.zip || "",
        installationType: formData.installationType,
        utm_source: urlParams.utm_source,
        utm_medium: urlParams.utm_medium,
        utm_campaign: urlParams.utm_campaign,
        utm_term: urlParams.utm_term,
        utm_content: urlParams.utm_content,
        utm_agency: urlParams.utm_agency,
        gclid: urlParams.gclid,
        fbclid,
        is_partial: true,
        variant_id: sessionStorage.getItem("installpros_variant") || "",
        session_id: sessionStorage.getItem("installpros_analytics_session") || "",
        device_type: detectDeviceType(),
        landing_host: window.location.hostname
      };

      // Use fetch with keepalive (survives page unload, supports auth headers)
      fetch(beaconUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {}); // Best effort
    };
  });

  // Register page-unload listeners for partial lead capture
  useEffect(() => {
    const handleBeforeUnload = () => sendPartialLeadRef.current();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Start 10-minute timer — only send if user doesn't come back
        visibilityTimerRef.current = setTimeout(() => {
          sendPartialLeadRef.current();
        }, 10 * 60 * 1000); // 10 minutes
      } else {
        // User came back — cancel pending partial send
        if (visibilityTimerRef.current) {
          clearTimeout(visibilityTimerRef.current);
          visibilityTimerRef.current = null;
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (visibilityTimerRef.current) clearTimeout(visibilityTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Auto-focus input when step changes (mobile optimization)
  // scrollIntoView after focus ensures the input stays visible above Android keyboards
  // Skip when rendered inside an iframe (admin preview) to avoid unwanted scrolling
  // Skip scrollIntoView on initial mount to prevent auto-scroll when page loads
  const hasInteractedRef = useRef(false);
  useEffect(() => {
    const isInIframe = window.self !== window.top;
    if (currentStepData.type !== 'select' && !isInIframe) {
      const timer = setTimeout(() => {
        const target = currentStepData.key === 'address' ?
        addressInputRef.current :
        generalInputRef.current;
        if (target) {
          target.focus({ preventScroll: !hasInteractedRef.current });
          // Only scroll into view after user has interacted (not on initial mount)
          if (hasInteractedRef.current) {
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
          hasInteractedRef.current = true;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentStepData.key, currentStepData.type]);

  // Helper to strip ", USA" from addresses for cleaner display
  const stripUSA = (address: string) => address.replace(/,?\s*USA$/i, "").trim();

  // Handle address selection with Place Details fetch for ZIP
  const handleAddressSelect = useCallback(async (prediction: PlacePrediction) => {
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    clearPredictions();

    // Fetch place details to get full address with ZIP
    const details = await fetchPlaceDetails(prediction.placeId);

    if (details) {
      // Use formatted address from Google, strip ", USA" for cleaner display
      const cleanAddress = stripUSA(details.formattedAddress);
      setFormData((prev) => ({ ...prev, address: cleanAddress }));
      setAddressComponents({
        street: details.street,
        city: details.city,
        state: details.state,
        zip: details.zip
      });
      setIsAddressFromAutocomplete(true);
    } else {
      // Fallback to description if details fetch fails, also strip USA
      const cleanAddress = stripUSA(prediction.description);
      setFormData((prev) => ({ ...prev, address: cleanAddress }));
      setIsAddressFromAutocomplete(true);
    }

    setErrors({});
    // Focus the two-line display div so Enter key works immediately
    setTimeout(() => addressDisplayRef.current?.focus(), 50);

    // Start 10-minute idle timer — capture if form is completed but not submitted
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      sendPartialLeadRef.current();
    }, 10 * 60 * 1000); // 10 minutes
  }, [clearPredictions, fetchPlaceDetails]);

  const handleAddressChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, address: value }));
    setIsAddressFromAutocomplete(false); // Reset when user types
    setErrors({});
    setHighlightedIndex(-1);
    fetchPredictions(value);
    setShowSuggestions(true);
  }, [fetchPredictions]);

  // Handle phone number change with auto-formatting
  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    setErrors({});
  }, []);

  const validateCurrentStep = (): boolean => {
    const key = currentStepData.key;
    const schema = stepSchemas[key];
    const result = schema.safeParse(formData[key]);

    if (!result.success) {
      setErrors({ [key]: result.error.errors[0].message });
      return false;
    }

    // For address step, require selection from autocomplete
    if (key === "address" && isAutocompleteAvailable && !isAddressFromAutocomplete) {
      setErrors({ address: "Please select an address from the suggestions" });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    // Trigger haptic feedback on step completion
    triggerHaptic();

    // Arm partial lead capture once phone step is completed
    if (currentStepData.key === "phone") {
      partialLeadArmedRef.current = true;
    }

    if (currentStep < steps.length - 1) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleAddressKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || predictions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
        prev < predictions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : predictions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < predictions.length) {
          handleAddressSelect(predictions[highlightedIndex]);
        } else {
          handleNext();
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSubmit = async () => {
    // Mark as submitted immediately to prevent partial lead from firing
    hasSubmittedRef.current = true;
    partialSentRef.current = true;
    sessionStorage.setItem("partialSent", "true");
    // Clear idle timer since user is submitting
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    setIsSubmitting(true);

    // Trigger haptic feedback on form submission
    triggerHaptic([15, 50, 15]);

    try {
      // Track form submission
      trackFormSubmit("quote_form", { installation_type: formData.installationType });

      // Use Google-provided address components if available, otherwise parse manually
      const finalAddressComponents = addressComponents.zip ?
      addressComponents :
      parseAddress(formData.address);

      sessionStorage.setItem("quoteFormData", JSON.stringify({
        ...formData,
        ...finalAddressComponents
      }));

      if (supabase) {
        const searchParams = new URLSearchParams(window.location.search);
        const fbclid = searchParams.get("fbclid") || sessionStorage.getItem("installpros_fbclid") || "";

        supabase.functions.invoke("forward-lead-webhook", {
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            street: finalAddressComponents.street,
            city: finalAddressComponents.city,
            state: finalAddressComponents.state,
            zip: finalAddressComponents.zip,
            installationType: formData.installationType,
            utm_source: urlParams.utm_source,
            utm_medium: urlParams.utm_medium,
            utm_campaign: urlParams.utm_campaign,
            utm_term: urlParams.utm_term,
            utm_content: urlParams.utm_content,
            utm_agency: urlParams.utm_agency,
            gclid: urlParams.gclid,
            fbclid: fbclid,
            is_partial: false,
            variant_id: sessionStorage.getItem("installpros_variant") || "",
            session_id: sessionStorage.getItem("installpros_analytics_session") || "",
            device_type: detectDeviceType(),
            landing_host: window.location.hostname
          }
        }).then(({ error }) => {
          if (error) {
            console.error("Failed to forward lead to webhook:", error);
          }
        });
      }

      toast({
        title: "Quote Request Submitted!",
        description: "We'll be in touch shortly."
      });

      // Fire Google Ads conversion (deduped per-session)
      fireGoogleAdsConversion();

      navigate("/thank-you");
    } catch {
      hasSubmittedRef.current = false; // Allow retry on error
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive"
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
        <div
          className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6 mb-3 sm:mb-4 max-w-md mx-auto outline-none focus:outline-none focus-visible:outline-none"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          ref={(el) => el?.focus()}>
          
          {installationTypes.map((type) => {
            const TypeIcon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, installationType: type.value }));
                  setErrors({});
                  triggerHaptic(10);
                  setTimeout(() => handleNext(), 300);
                }}
                onKeyDown={handleKeyDown}
                className={cn(
                  "p-3 sm:p-4 rounded-[4px] border-2 text-center transition-all duration-200 min-h-[80px] sm:min-h-[100px] flex flex-col items-center justify-center",
                  "hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-0",
                  formData.installationType === type.value ?
                  "border-primary bg-primary/20 shadow-lg" :
                  isTransparent ?
                  "border-white/20 bg-white/5" :
                  "border-border bg-card"
                )}>
                
                <TypeIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-primary" strokeWidth={2.5} />
                <span className={cn(
                  "font-semibold text-xs sm:text-sm leading-tight block tracking-wide",
                  isTransparent ? "text-white" : "text-foreground"
                )}>{type.label}</span>
              </button>);

          })}
        </div>);

    }

    const isAddressField = key === "address";
    const isPhoneField = key === "phone";

    if (isAddressField) {
      // Format address for two-line display when selected from autocomplete
      const getFormattedAddressDisplay = () => {
        if (isAddressFromAutocomplete && addressComponents.street && addressComponents.city) {
          const line1 = abbreviateAddress(addressComponents.street);
          const line2 = `${addressComponents.city}, ${addressComponents.state} ${addressComponents.zip}`;
          return { line1, line2, isTwoLine: true };
        }
        return { line1: formData.address, line2: '', isTwoLine: false };
      };

      const addressDisplay = getFormattedAddressDisplay();

      return (
        <div className="relative mt-4 sm:mt-6 group z-[100]">
          <div className="relative">
              <Icon className={cn(
              "absolute left-0 z-10",
              addressDisplay.isTwoLine ? "top-2" : "top-1/2 -translate-y-1/2",
              isTransparent ? "text-[#1E90FF]" : "text-primary"
            )} style={{ width: 20, height: 20 }} strokeWidth={2.5} />
              
              {addressDisplay.isTwoLine ?
            <div
              ref={addressDisplayRef}
              tabIndex={0}
              onClick={() => {
                setIsAddressFromAutocomplete(false);
                setTimeout(() => addressInputRef.current?.focus(), 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNext();
                }
              }}
              className={cn(
                "w-full pl-8 sm:pl-10 pt-0 pb-2 font-medium bg-transparent border-0 border-b-2 cursor-text select-text -mt-1 outline-none",
                isTransparent ?
                "text-white border-[#1E90FF]" :
                "text-foreground border-primary"
              )}>
              
                  <div className="text-lg sm:text-xl md:text-2xl leading-snug truncate">{addressDisplay.line1}{addressDisplay.line2 ? `, ${addressDisplay.line2}` : ''}</div>
                </div> :

            <Input
              ref={addressInputRef}
              type="text"
              placeholder={currentStepData.placeholder}
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() => predictions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleAddressKeyDown}
              data-1p-ignore
              className={cn(
                "pl-8 sm:pl-10 h-14 sm:h-16 md:h-18 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium bg-transparent border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus:shadow-none transition-all duration-300",
                isTransparent ?
                "text-white placeholder:text-[#6B7280] border-[#1F2937] focus:border-[#1E90FF]" :
                "placeholder:text-muted-foreground/40 border-primary focus:border-primary"
              )}
              autoFocus />

            }
              
              {(isPredictionsLoading || isFetchingDetails) &&
            <Loader2 className={cn(
              "absolute right-2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground animate-spin",
              addressDisplay.isTwoLine ? "top-4" : "top-1/2 -translate-y-1/2"
            )} />
            }

            {showSuggestions && predictions.length > 0 &&
            <div className="absolute z-[9999] w-full top-full mt-2 bg-card rounded-xl shadow-2xl border border-border max-h-64 overflow-auto">
                {predictions.map((prediction, index) => {
                const formatted = formatPredictionDisplay(prediction.mainText, prediction.secondaryText, prediction.zip);
                return (
                  <button
                    key={prediction.placeId}
                    type="button"
                    onClick={() => handleAddressSelect(prediction)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-colors flex items-start gap-2 sm:gap-3 border-b border-border last:border-0 min-h-[44px]",
                      highlightedIndex === index ? "bg-primary/10" : "hover:bg-muted"
                    )}>
                    
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground text-base sm:text-lg">{formatted.main}</div>
                        <div className="text-sm sm:text-base text-muted-foreground">{formatted.secondary}</div>
                      </div>
                    </button>);

              })}
              </div>
            }
          </div>
          {!isAutocompleteAvailable && formData.address.length >= 3 &&
          <p className={cn(
            "text-xs mt-2",
            isTransparent ? "text-white/60" : "text-muted-foreground"
          )}>
              Enter your full address manually
            </p>
          }
          <div className="mt-4 sm:mt-6">
            <Button
              onClick={handleNext}
              disabled={isSubmitting || formData.address.trim().length < 5}
              variant="funnel"
              size="full"
              className={cn(
                "text-base transition-opacity duration-200",
                formData.address.trim().length < 5 ? "opacity-40" : "opacity-100"
              )}>
              
              {isSubmitting ?
              <Loader2 className="w-5 h-5 animate-spin" /> :

              <>
                  {addressButtonLabel || "Get My Quote"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              }
            </Button>
          </div>
        </div>);

    }

    // Phone field with auto-formatting
    if (isPhoneField) {
      return (
        <div className="relative mt-4 sm:mt-6 group">
          <div className="relative">
            <Icon className={cn(
              "absolute left-0 bottom-2 sm:bottom-2.5 md:bottom-2.5 w-5 h-5 sm:w-6 sm:h-6",
              isTransparent ? "text-[#1E90FF]" : "text-primary"
            )} strokeWidth={2.5} />
            <Input
              ref={generalInputRef}
              type="tel"
              inputMode="tel"
              placeholder={currentStepData.placeholder}
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onKeyDown={handleKeyDown}
              data-1p-ignore
              className={cn(
                "pl-8 sm:pl-10 h-10 sm:h-12 md:h-12 pb-1 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium bg-transparent border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus:shadow-none transition-all duration-300",
                isTransparent ?
                "text-white placeholder:text-[#6B7280] border-[#1F2937] focus:border-[#1E90FF]" :
                "placeholder:text-muted-foreground/40 border-primary focus:border-primary"
              )} />
            
          </div>
          <p className={cn(
            "text-xs mt-2",
            isTransparent ? "text-[#9CA3AF]" : "text-muted-foreground"
          )}>By submitting, you agree to be contacted by InstallPros via calls or texts, automated or human, about your request.

          </p>
        </div>);

    }

    return (
      <div className="relative mt-4 sm:mt-6 group">
        <div className="relative">
            <Icon className={cn(
            "absolute left-0 bottom-2 sm:bottom-2.5 md:bottom-2.5 w-5 h-5 sm:w-6 sm:h-6",
            isTransparent ? "text-[#1E90FF]" : "text-primary"
          )} strokeWidth={2.5} />
          <Input
            ref={generalInputRef}
            type={currentStepData.type}
            placeholder={currentStepData.placeholder}
            value={formData[key]}
            onChange={(e) => {
              setFormData({ ...formData, [key]: e.target.value });
              setErrors({});
            }}
            onKeyDown={handleKeyDown}
            data-1p-ignore
            className={cn(
              "pl-8 sm:pl-10 h-10 sm:h-12 md:h-12 pb-1 text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium bg-transparent border-0 border-b-2 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none focus:shadow-none transition-all duration-300",
              isTransparent ?
              "text-white placeholder:text-[#6B7280] border-[#1F2937] focus:border-[#1E90FF]" :
              "placeholder:text-muted-foreground/40 border-primary focus:border-primary"
            )} />
          
        </div>
      </div>);

  };

  return (
    <div className={cn("w-full max-w-xl mx-auto p-4 sm:p-6 md:p-8 pb-6 sm:pb-8 md:pb-10 min-w-0 py-0",

    isTransparent ?
    "bg-transparent" :
    "bg-card rounded-2xl shadow-2xl border border-border"
    )}>
      {/* Progress Indicator - hidden on first step to reduce perceived effort */}
      {!hideCompletedSummary && currentStep > 0 &&
      <div className={cn(
        "text-xs font-medium mb-4",
        isTransparent ? "text-[#9CA3AF]" : "text-muted-foreground"
      )}>
          Step {currentStep + 1} of {totalSteps}
        </div>
      }

      {/* Completed fields summary - all 4 slots always rendered to prevent vertical jumping */}
      {!hideCompletedSummary && currentStep > 0 &&
      <div className="mb-0 space-y-0.5">
          {/* Installation Type */}
          <button
          onClick={() => {
            setDirection("backward");
            setCurrentStep(0);
          }}
          className={cn("w-full flex items-center gap-3 transition-colors group text-left py-[4px]",

          !formData.installationType && "invisible"
          )}>
          
            {(() => {
            const selected = installationTypes.find((t) => t.value === formData.installationType);
            const TypeIcon = selected?.icon || Wrench;
            return <TypeIcon className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />;
          })()}
            <span className={cn(
            "text-sm truncate flex-1 text-left",
            isTransparent ? "text-white/80" : "text-muted-foreground"
          )}>
              {installationTypes.find((t) => t.value === formData.installationType)?.label || formData.installationType}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              Edit
            </span>
          </button>
          {/* Name slot - invisible placeholder until step 2+ */}
          <button
          onClick={() => {
            setDirection("backward");
            setCurrentStep(1);
          }}
          className={cn("w-full flex items-center gap-3 transition-colors group text-left py-0",

          !(currentStep > 1 && formData.name) && "hidden"
          )}>
          
            <User className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
            <span className={cn(
            "text-sm truncate flex-1 text-left",
            isTransparent ? "text-white/80" : "text-muted-foreground"
          )}>
              {formData.name || "\u00A0"}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              Edit
            </span>
          </button>
          {/* Phone slot - invisible placeholder until step 3+ */}
          <button
          onClick={() => {
            setDirection("backward");
            setCurrentStep(2);
          }}
          className={cn(
            "w-full py-1.5 flex items-center gap-3 transition-colors group text-left",
            !(currentStep > 2 && formData.phone) && "hidden"
          )}>
          
            <Phone className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
            <span className={cn(
            "text-sm truncate flex-1 text-left",
            isTransparent ? "text-white/80" : "text-muted-foreground"
          )}>
              {formData.phone || "\u00A0"}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              Edit
            </span>
          </button>
          {/* Email slot - invisible placeholder until step 4+ */}
          <button
          onClick={() => {
            setDirection("backward");
            setCurrentStep(3);
          }}
          className={cn(
            "w-full py-1.5 flex items-center gap-3 transition-colors group text-left",
            !(currentStep > 3 && formData.email) && "hidden"
          )}>
          
            <Mail className="w-4 h-4 text-primary shrink-0" strokeWidth={2.5} />
            <span className={cn(
            "text-sm truncate flex-1 text-left",
            isTransparent ? "text-white/80" : "text-muted-foreground"
          )}>
              {formData.email || "\u00A0"}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              Edit
            </span>
          </button>
        </div>
      }

      {/* Animated content */}
      <div
        key={currentStep}
        className={cn("transition-all duration-300 my-0 py-0",

        direction === "forward" ?
        "animate-fade-in" :
        "animate-fade-in"
        )}>
        
        <h2 className={cn("text-xl sm:text-2xl md:text-3xl font-semibold text-left mb-1 py-0 my-[5px]",

        isTransparent ? "text-white" : "text-foreground"
        )}>
          {currentStepData.title}
        </h2>
        {!hideSubtitles && currentStepData.subtitle &&
        <p className={cn(
          "text-left text-sm sm:text-base",
          isTransparent ? "text-[#9CA3AF]" : "text-muted-foreground"
        )}>{currentStepData.subtitle}</p>
        }

        {renderInputField()}

        {errors[currentStepData.key] &&
        <p className="text-destructive text-sm mt-2 animate-fade-in">
            {errors[currentStepData.key]}
          </p>
        }
      </div>

      {/* Sticky CTA for mobile on installation type step - ONLY show on mobile, hide regular button */}

      {/* Navigation - only show for non-address steps */}
      {currentStepData.key !== "address" &&
      <div className="mt-4 sm:mt-6">
          <div className={cn(
          currentStepData.type === "select" ?
          "grid grid-cols-2 gap-2 sm:gap-3 max-w-md mx-auto" :
          "flex flex-wrap items-center gap-3 sm:gap-4"
        )}>
            {/* Empty spacer for left column when on select step */}
            {currentStepData.type === "select" && <div />}
            <Button
            onClick={handleNext}
            disabled={isSubmitting || currentStepData.type === "select" && !formData.installationType}
            variant="funnel"
            size={currentStepData.type === "select" ? "full" : "lg"}
            className={cn(
              "text-base",
              currentStepData.type !== "select" && "shrink-0 w-full sm:w-auto"
            )}>
            
              {isSubmitting ?
            <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </> :
            <>
                  {currentStep === steps.length - 1 ?
              submitButtonLabel || currentStepData.buttonLabel || "Get My Quote" :
              continueButtonLabel || currentStepData.buttonLabel || "Get My Quote"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
            }
            </Button>
            {trustBadges && currentStepData.type !== "select" &&
          <div className="flex-1 min-w-0">{trustBadges}</div>
          }
          </div>
        </div>
      }


    </div>);

};

export default InlineQuoteFlow;