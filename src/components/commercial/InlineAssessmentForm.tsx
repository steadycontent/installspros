import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Tag, FileText, User, Phone,
  ArrowRight, ArrowLeft, Check, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelStep } from "@/lib/analytics/tracker";

interface AssessmentData {
  industry: string;
  propertyDetails: string;
  name: string;
  phone: string;
}

const initial: AssessmentData = {
  industry: "",
  propertyDetails: "",
  name: "",
  phone: "",
};

const schemas = {
  industry: z.string().min(1, "Select a property type"),
  propertyDetails: z
    .string()
    .trim()
    .min(3, "Tell us a bit about your property")
    .max(1000, "Keep it under 1000 characters"),
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(100, "Keep it under 100 characters"),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid 10-digit phone"),
} as const;

type StepKey = keyof AssessmentData;

interface Step {
  key: StepKey;
  title: string;
  subtitle: string;
  type: "text" | "tel" | "select" | "textarea";
  placeholder?: string;
  icon: typeof Tag;
}

const INDUSTRY_OPTIONS: { value: string; label: string; tagline: string }[] = [
  { value: "rv-parks", label: "RV Park, Motorcoach, Campground", tagline: "Property-wide WiFi that fills sites and lifts reviews." },
  { value: "marinas", label: "Marinas", tagline: "Dock-to-dock WiFi that holds up in salt air." },
  { value: "mobile-home-parks", label: "Winery / Equestrian", tagline: "Property-wide internet as a community amenity." },
  { value: "large-properties", label: "Other Large Property", tagline: "Warehouse, Construction, etc" },
];

const ALL_STEPS: Step[] = [
  { key: "industry", title: "What kind of property is it?", subtitle: "Pick the closest match.", type: "select", icon: Tag },
  { key: "propertyDetails", title: "What's your property like?", subtitle: "Tell us whatever you know — no pressure.", type: "textarea", placeholder: "e.g. 120-site RV park on 35 acres, current internet is slow DSL...", icon: FileText },
  { key: "name", title: "What's your name?", subtitle: "So we know who we're talking to.", type: "text", placeholder: "Your full name", icon: User },
  { key: "phone", title: "How can we reach you?", subtitle: "We'll call to schedule your assessment.", type: "tel", placeholder: "(555) 123-4567", icon: Phone },
];

interface Props {
  className?: string;
  defaultIndustry?: string;
  skipPropertyName?: boolean;
}

const InlineAssessmentForm = ({ className, defaultIndustry }: Props) => {
  const navigate = useNavigate();

  // If industry is pre-selected (came from /commercial), start at step 1
  const initialStep = defaultIndustry ? 1 : 0;

  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState<AssessmentData>({
    ...initial,
    industry: defaultIndustry || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const STEPS = ALL_STEPS;
  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const validate = () => {
    const key = current.key;
    const result = schemas[key].safeParse(data[key]);
    if (!result.success) {
      setErrors({ [key]: result.error.errors[0].message });
      return false;
    }
    setErrors({});
    return true;
  };

  const next = () => {
    if (!validate()) return;
    trackFunnelStep(step + 1, { funnel: "assessment", field: current.key });
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      submit();
    }
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
    else if (defaultIndustry && step === 0) {
      navigate("/commercial");
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const sessionStr = sessionStorage.getItem("urlParams") || "{}";
      let utm: Record<string, string> = {};
      try { utm = JSON.parse(sessionStr); } catch { /* noop */ }

      const commercialTypeMap: Record<string, string> = {
        "rv-parks": "Commercial-RVPark",
        "marinas": "Commercial-Marina",
        "mobile-home-parks": "Commercial-WineryEquestrian",
        "large-properties": "Commercial-Other",
      };
      const commercialType = commercialTypeMap[data.industry] || "Commercial-Other";

      const payload = {
        name: data.name,
        email: "",
        phone: data.phone,
        street: "",
        city: "",
        state: "",
        zip: "",
        installationType: "commercial",
        lead_type: "commercial",
        property_meta: {
          property_name: data.name,
          industry: data.industry,
          commercial_type: commercialType,
          property_details: data.propertyDetails,
        },
        utm_source: utm.utm_source || "",
        utm_medium: utm.utm_medium || "",
        utm_campaign: utm.utm_campaign || "",
        utm_term: utm.utm_term || "",
        utm_content: utm.utm_content || "",
        utm_agency: utm.utm_agency || "",
        gclid: utm.gclid || "",
        fbclid: utm.fbclid || "",
        is_partial: false,
        session_id: sessionStorage.getItem("session_id") || crypto.randomUUID(),
        device_type: window.innerWidth < 768 ? "mobile" : "desktop",
        landing_host: window.location.hostname,
        source_domain: window.location.hostname,
      };

      sessionStorage.setItem("assessmentData", JSON.stringify(data));

      if (supabase) {
        await supabase.functions.invoke("forward-lead-webhook", { body: payload });
      }

      toast({
        title: "Assessment requested",
        description: "We'll be in touch within one business day.",
      });
      navigate("/thank-you-assessment");
    } catch (err) {
      console.error("Assessment submit error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && current.type !== "select" && current.type !== "textarea") {
      e.preventDefault();
      next();
    }
  };

  const Icon = current.icon;

  return (
    <div
      id="quote-funnel-container"
      className={cn(
        "rounded-[4px] border border-white/5 overflow-hidden",
        className
      )}
    >
      <div className="h-0.5 bg-white/5">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 md:p-8 text-white">
        <div className="flex items-center justify-between text-xs text-white/40 mb-3">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="tracking-wide">
            Free assessment
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-1">{current.title}</h2>
        <p className="text-white/70 text-sm md:text-base">{current.subtitle}</p>

        {current.type === "select" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {INDUSTRY_OPTIONS.map((opt) => {
              const selected =
                data.industry === opt.value ||
                (opt.value === "rv-parks" &&
                  (data.industry === "campgrounds" || data.industry === "motorcoach-resorts"));
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setData({ ...data, industry: opt.value });
                    setErrors({});
                  }}
                  className={cn(
                    "p-4 rounded-[4px] border-2 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/20"
                      : "border-white/15 bg-white/5 hover:border-white/30"
                  )}
                >
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-[11px] text-white/60 mt-1">
                    {opt.tagline}
                  </div>
                </button>
              );
            })}
          </div>
        ) : current.type === "textarea" ? (
          <div className="mt-6">
            <Textarea
              placeholder={current.placeholder}
              value={data[current.key]}
              onChange={(e) => {
                setData({ ...data, [current.key]: e.target.value.slice(0, 1000) });
                setErrors({});
              }}
              data-hj-allow
              autoFocus
              rows={5}
              className="text-base bg-white/5 border-white/20 rounded-[4px] text-white placeholder:text-white/40 focus-visible:ring-primary"
            />
          </div>
        ) : (
          <div className="relative mt-6 group">
            <Icon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
            <Input
              type={current.type === "tel" ? "tel" : current.type}
              inputMode={current.type === "tel" ? "numeric" : undefined}
              maxLength={current.type === "tel" ? 14 : 100}
              placeholder={current.placeholder}
              value={data[current.key]}
              onChange={(e) => {
                let v = e.target.value;
                if (current.type === "tel") {
                  const d = v.replace(/\D/g, "").slice(0, 10);
                  if (d.length > 6) v = `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
                  else if (d.length > 3) v = `(${d.slice(0,3)}) ${d.slice(3)}`;
                  else if (d.length > 0) v = `(${d}`;
                  else v = "";
                }
                setData({ ...data, [current.key]: v });
                setErrors({});
              }}
              onKeyDown={onKey}
              data-hj-allow
              autoFocus
              className="pl-9 h-14 text-xl md:text-2xl font-medium bg-transparent border-0 border-b-2 border-white/30 rounded-none text-white placeholder:text-white/40 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        )}

        {errors[current.key] && (
          <p className="text-destructive text-sm mt-2">
            {errors[current.key]}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-8">
          {step > 0 || defaultIndustry ? (
            <Button
              variant="ghost"
              onClick={back}
              className="text-white/70 hover:text-white hover:bg-white/10 h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button
            onClick={next}
            disabled={submitting || (current.type === "select" && !data.industry)}
            className="h-12 px-6 rounded-[4px] font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : step === STEPS.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Request Assessment
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

export default InlineAssessmentForm;
