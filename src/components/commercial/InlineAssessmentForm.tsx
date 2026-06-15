import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Building2, Tag, Hash, Trees, Wifi, Phone, Mail,
  ArrowRight, ArrowLeft, Check, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRIES } from "@/lib/industries";
import { trackFunnelStep } from "@/lib/analytics/tracker";
// trackFunnelStep takes a step number

interface AssessmentData {
  propertyName: string;
  industry: string;
  sites: string;
  acreage: string;
  currentIsp: string;
  phone: string;
  email: string;
}

const initial: AssessmentData = {
  propertyName: "",
  industry: "",
  sites: "",
  acreage: "",
  currentIsp: "",
  phone: "",
  email: "",
};

const schemas = {
  propertyName: z.string().trim().min(2, "Enter the property or business name"),
  industry: z.string().min(1, "Select an industry"),
  sites: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        const n = Number(v);
        return /^\d+$/.test(v) && n >= 0 && n <= 999;
      },
      "Numbers only, max 999"
    ),
  acreage: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        const n = Number(v);
        return /^\d+$/.test(v) && n >= 0 && n <= 999;
      },
      "Numbers only, max 999"
    ),
  currentIsp: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a valid 10-digit phone"),
  email: z.string().trim().email("Enter a valid email"),
} as const;


type StepKey = keyof AssessmentData;

interface Step {
  key: StepKey;
  title: string;
  subtitle: string;
  type: "text" | "tel" | "email" | "select" | "choice";
  placeholder?: string;
  icon: typeof Building2;
  options?: { value: string; label: string }[];
}

const ISP_OPTIONS = [
  { value: "cable", label: "Cable" },
  { value: "fiber", label: "Fiber" },
  { value: "satellite", label: "Satellite" },
  { value: "other", label: "Other" },
];

const STEP2_OPTIONS: { value: string; label: string; tagline: string }[] = [
  { value: "rv-parks", label: "RV Park, Motorcoach, Campground", tagline: "Property-wide WiFi that fills sites and lifts reviews." },
  { value: "marinas", label: "Marinas", tagline: "Dock-to-dock WiFi that holds up in salt air." },
  { value: "mobile-home-parks", label: "Winery / Equestrian", tagline: "Property-wide internet as a community amenity." },
  { value: "large-properties", label: "Other Large Property", tagline: "Warehouse, Construction, etc" },
];

const STEPS: Step[] = [
  { key: "propertyName", title: "What's the property or business name?", subtitle: "So we know who we're designing for.", type: "text", placeholder: "Sunset Bay Resort", icon: Building2 },
  { key: "industry", title: "What kind of property is it?", subtitle: "Pick the closest match.", type: "select", icon: Tag },
  { key: "sites", title: "How many sites, slips, or lots?", subtitle: "Rough count is fine. (Optional)", type: "text", placeholder: "120", icon: Hash },
  { key: "acreage", title: "How many acres does it cover?", subtitle: "Approximate is fine. (Optional)", type: "text", placeholder: "35", icon: Trees },
  { key: "currentIsp", title: "What's your current internet situation?", subtitle: "Pick the closest match.", type: "choice", icon: Wifi, options: ISP_OPTIONS },
  { key: "phone", title: "Best phone for a callback?", subtitle: "We'll schedule the assessment.", type: "tel", placeholder: "(555) 123-4567", icon: Phone },
  { key: "email", title: "Where should we send your plan?", subtitle: "We'll email the assessment summary.", type: "email", placeholder: "you@property.com", icon: Mail },
];


interface Props {
  className?: string;
  defaultIndustry?: string;
}

const InlineAssessmentForm = ({ className, defaultIndustry }: Props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Prefill from calculator or default industry
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("assessmentCalculator");
      if (raw) {
        const c = JSON.parse(raw);
        setData((d) => ({ ...d, sites: String(c.sites ?? "") }));
      }
    } catch {/* noop */}
    if (defaultIndustry) {
      setData((d) => ({ ...d, industry: defaultIndustry }));
    }
  }, [defaultIndustry]);

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
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const sessionStr = sessionStorage.getItem("urlParams") || "{}";
      let utm: Record<string, string> = {};
      try { utm = JSON.parse(sessionStr); } catch { /* noop */ }

      const payload = {
        name: data.propertyName,
        email: data.email,
        phone: data.phone,
        street: "",
        city: "",
        state: "",
        zip: "",
        installationType: `commercial-${data.industry || "property"}`,
        lead_type: "commercial",
        property_meta: {
          property_name: data.propertyName,
          industry: data.industry,
          sites: data.sites,
          acreage: data.acreage,
          current_isp: data.currentIsp,
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
      };

      sessionStorage.setItem("assessmentData", JSON.stringify(data));
      sessionStorage.setItem("leadEmail", data.email);

      if (supabase) {
        await Promise.allSettled([
          supabase.functions.invoke("forward-lead-webhook", { body: payload }),
          supabase.functions.invoke("send-assessment-email", {
            body: {
              email: data.email,
              propertyName: data.propertyName,
              industry: data.industry,
              sites: data.sites,
              acreage: data.acreage,
              currentIsp: data.currentIsp,
              phone: data.phone,
            },
          }),
        ]);
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
    if (e.key === "Enter" && current.type !== "select") {
      e.preventDefault();
      next();
    }
  };

  const Icon = current.icon;

  return (
    <div
      id="quote-funnel-container"
      className={cn(
        "rounded-[4px] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden",
        className
      )}
    >
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 md:p-8 text-white">
        <div className="flex items-center justify-between text-xs text-white/60 mb-3">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="uppercase tracking-[0.18em] text-primary">
            Free Property Assessment
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mb-1">{current.title}</h2>
        <p className="text-white/70 text-sm md:text-base">{current.subtitle}</p>

        {current.type === "select" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {STEP2_OPTIONS.map((opt) => {
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
        ) : current.type === "choice" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {current.options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setData({ ...data, [current.key]: opt.value });
                  setErrors({});
                }}
                className={cn(
                  "p-4 rounded-[4px] border-2 text-center font-semibold text-sm transition-all",
                  data[current.key] === opt.value
                    ? "border-primary bg-primary/20"
                    : "border-white/15 bg-white/5 hover:border-white/30"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative mt-6 group">
            <Icon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-primary transition-colors" />
            <Input
              type={current.type === "tel" ? "tel" : current.type}
              inputMode={
                current.key === "sites" || current.key === "acreage" || current.type === "tel"
                  ? "numeric"
                  : undefined
              }
              maxLength={current.type === "tel" ? 14 : current.key === "sites" || current.key === "acreage" ? 3 : undefined}
              placeholder={current.placeholder}
              value={data[current.key]}
              onChange={(e) => {
                let v = e.target.value;
                if (current.key === "sites" || current.key === "acreage") {
                  v = v.replace(/\D/g, "").slice(0, 3);
                } else if (current.type === "tel") {
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
          {step > 0 ? (
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
