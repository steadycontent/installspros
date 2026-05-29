import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building2, Anchor, Caravan, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseAddress } from "@/lib/parseAddress";
import type { FunnelConfig, FunnelStep } from "@/lib/funnels/schema";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  building: Building2,
  anchor: Anchor,
  rv: Caravan,
};

interface Props {
  config: FunnelConfig;
  variantId?: string;
}

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

export default function FunnelEngine({ config, variantId }: Props) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [addressComponents, setAddressComponents] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const step = config.steps[stepIndex];
  const isLast = stepIndex === config.steps.length - 1;

  const setVal = (id: string, v: string) =>
    setValues((p) => ({ ...p, [id]: v }));

  const validate = (s: FunnelStep, v: string): string | null => {
    const trimmed = (v || "").trim();
    if (!trimmed) return "Required";
    if (s.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Invalid email";
    if (s.type === "phone" && trimmed.replace(/\D/g, "").length < 10) return "Invalid phone";
    return null;
  };

  const submitAll = async (finalValues: Record<string, string>) => {
    setSubmitting(true);
    try {
      const addressRaw = finalValues["address"] || "";
      const parsed = addressComponents.street
        ? addressComponents
        : addressRaw
        ? parseAddress(addressRaw)
        : { street: "", city: "", state: "", zip: "" };
      const installation = finalValues["installation_type"] || finalValues["installationType"] || "";

      if (supabase) {
        await supabase.functions.invoke("forward-lead-webhook", {
          body: {
            name: finalValues["name"] || "",
            email: finalValues["email"] || "",
            phone: finalValues["phone"] || "",
            street: parsed.street,
            city: parsed.city,
            state: parsed.state,
            zip: parsed.zip,
            installationType: installation,
            is_partial: false,
            variant_id: variantId || "",
            session_id: sessionStorage.getItem("installpros_analytics_session") || "",
            landing_host: window.location.hostname,
          },
        });
      }

      toast({ title: "Request submitted!", description: "We'll be in touch shortly." });
      navigate(config.submit.redirect || "/thank-you");
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const advance = (nextValues: Record<string, string>) => {
    if (isLast) {
      void submitAll(nextValues);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const next = () => {
    const err = validate(step, values[step.id] || "");
    if (err) {
      toast({ title: err, variant: "destructive" });
      return;
    }
    advance(values);
  };

  // Auto-advance for choice-grid: when user selects an option, move forward immediately
  const handleChoiceSelect = (v: string) => {
    const nextValues = { ...values, [step.id]: v };
    setValues(nextValues);
    // Small delay so user sees their selection highlight
    setTimeout(() => advance(nextValues), 150);
  };

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / config.steps.length) * 100),
    [stepIndex, config.steps.length]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-[hsl(var(--dark-surface))] border border-white/10 rounded-[4px] p-6 space-y-5">
      {/* Progress */}
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <StepRenderer
        step={step}
        value={values[step.id] || ""}
        onChange={(v) => setVal(step.id, v)}
        onChoiceSelect={handleChoiceSelect}
        onAddressDetails={(addr, details) => {
          setVal("address", addr);
          setAddressComponents({
            street: details.street,
            city: details.city,
            state: details.state,
            zip: details.zip,
          });
        }}
      />

      {step.type !== "choice-grid" && (
        <div className="flex gap-2 pt-2">
          {stepIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-[4px] bg-transparent border-white/20 text-white hover:bg-white/10"
              onClick={() => setStepIndex((i) => i - 1)}
              disabled={submitting}
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            className="flex-1 rounded-[4px]"
            onClick={next}
            disabled={submitting}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting…</>
            ) : isLast ? (
              config.submit.label
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function StepRenderer({
  step,
  value,
  onChange,
  onChoiceSelect,
  onAddressDetails,
}: {
  step: FunnelStep;
  value: string;
  onChange: (v: string) => void;
  onChoiceSelect: (v: string) => void;
  onAddressDetails: (formatted: string, details: PlaceDetails) => void;
}) {
  if (step.type === "choice-grid") {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">{step.title}</h2>
        <div className="grid grid-cols-2 gap-2">
          {step.options.map((opt) => {
            const Icon = (opt.icon && ICONS[opt.icon]) || Home;
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChoiceSelect(opt.value)}
                className={`min-h-[88px] rounded-[4px] border p-3 flex flex-col items-center justify-center gap-2 transition-colors ${
                  selected
                    ? "border-primary bg-primary/20 text-white"
                    : "border-white/10 bg-white/5 text-white hover:border-primary/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.type === "address") {
    return <AddressStep label={step.label} value={value} onChange={onChange} onAddressDetails={onAddressDetails} />;
  }

  const inputType =
    step.type === "email" ? "email" : step.type === "phone" ? "tel" : "text";
  const placeholder =
    step.type === "text" && "placeholder" in step ? step.placeholder : "";

  return (
    <div className="space-y-2">
      <Label className="text-white">{step.label}</Label>
      <Input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-[4px] bg-white/5 border-white/20 text-white placeholder:text-white/40"
        autoFocus
      />
    </div>
  );
}

function AddressStep({
  label,
  value,
  onChange,
  onAddressDetails,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onAddressDetails: (formatted: string, details: PlaceDetails) => void;
}) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionTokenRef = useRef<string>(crypto.randomUUID());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchPredictions = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setPredictions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!supabase) return;
      setLoading(true);
      try {
        const { data } = await supabase.functions.invoke("google-places-autocomplete", {
          body: { input, sessionToken: sessionTokenRef.current },
        });
        setPredictions(data?.predictions || []);
      } catch {
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const selectPrediction = async (p: PlacePrediction) => {
    setShowSuggestions(false);
    setPredictions([]);
    if (!supabase) {
      onChange(p.description);
      return;
    }
    try {
      const { data } = await supabase.functions.invoke("google-places-autocomplete", {
        body: { placeId: p.placeId, sessionToken: sessionTokenRef.current },
      });
      const details: PlaceDetails | null = data?.placeDetails || null;
      if (details) {
        onAddressDetails(details.formattedAddress || p.description, details);
      } else {
        onChange(p.description);
      }
    } catch {
      onChange(p.description);
    }
    sessionTokenRef.current = crypto.randomUUID();
  };

  return (
    <div className="space-y-2 relative">
      <Label className="text-white">{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            void fetchPredictions(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Start typing your address…"
          className="rounded-[4px] pl-9 bg-white/5 border-white/20 text-white placeholder:text-white/40"
          autoComplete="off"
          autoFocus
        />
      </div>
      {showSuggestions && predictions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-[hsl(var(--dark-surface))] border border-white/15 rounded-[4px] shadow-lg max-h-64 overflow-y-auto">
          {predictions.map((p) => (
            <li key={p.placeId}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectPrediction(p)}
                className="w-full text-left px-3 py-2 hover:bg-white/10 text-white text-sm"
              >
                <div className="font-medium">{p.mainText}</div>
                <div className="text-xs text-white/60">{p.secondaryText}{p.zip ? ` ${p.zip}` : ""}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {loading && <p className="text-xs text-white/40">Searching…</p>}
    </div>
  );
}
