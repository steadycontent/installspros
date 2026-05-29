import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building2, Anchor, Caravan, Loader2 } from "lucide-react";
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

export default function FunnelEngine({ config, variantId }: Props) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const step = config.steps[stepIndex];
  const isLast = stepIndex === config.steps.length - 1;

  const setVal = (id: string, v: string) =>
    setValues((p) => ({ ...p, [id]: v }));

  const validateCurrent = (): string | null => {
    const v = (values[step.id] || "").trim();
    if (!v) return "Required";
    if (step.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email";
    if (step.type === "phone" && v.replace(/\D/g, "").length < 10) return "Invalid phone";
    return null;
  };

  const next = () => {
    const err = validateCurrent();
    if (err) {
      toast({ title: err, variant: "destructive" });
      return;
    }
    if (isLast) {
      void handleSubmit();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const addressRaw = values["address"] || "";
      const parsed = addressRaw ? parseAddress(addressRaw) : { street: "", city: "", state: "", zip: "" };
      const installation = values["installation_type"] || values["installationType"] || "";

      if (supabase) {
        await supabase.functions.invoke("forward-lead-webhook", {
          body: {
            name: values["name"] || "",
            email: values["email"] || "",
            phone: values["phone"] || "",
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

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / config.steps.length) * 100),
    [stepIndex, config.steps.length]
  );

  return (
    <div className="w-full max-w-md mx-auto bg-dark-bg rounded-[4px] p-6 space-y-5">
      {/* Progress */}
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <StepRenderer step={step} value={values[step.id] || ""} onChange={(v) => setVal(step.id, v)} />

      <div className="flex gap-2 pt-2">
        {stepIndex > 0 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
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
    </div>
  );
}

function StepRenderer({
  step,
  value,
  onChange,
}: {
  step: FunnelStep;
  value: string;
  onChange: (v: string) => void;
}) {
  if (step.type === "choice-grid") {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">{step.title}</h2>
        <div className="grid grid-cols-2 gap-2">
          {step.options.map((opt) => {
            const Icon = (opt.icon && ICONS[opt.icon]) || Home;
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`min-h-[88px] rounded-[4px] border p-3 flex flex-col items-center justify-center gap-2 transition-colors ${
                  selected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-white/10 bg-white/5 text-foreground hover:border-primary/50"
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
    return (
      <div className="space-y-2">
        <Label className="text-foreground">{step.label}</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Street, City, State ZIP"
          className="rounded-[4px]"
        />
      </div>
    );
  }

  const inputType =
    step.type === "email" ? "email" : step.type === "phone" ? "tel" : "text";
  const placeholder =
    step.type === "text" && "placeholder" in step ? step.placeholder : "";

  return (
    <div className="space-y-2">
      <Label className="text-foreground">{step.label}</Label>
      <Input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-[4px]"
        autoFocus
      />
    </div>
  );
}
