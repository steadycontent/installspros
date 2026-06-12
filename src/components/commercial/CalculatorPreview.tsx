import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Props {
  variant?: "embedded" | "full";
}

const CalculatorPreview = ({ variant = "embedded" }: Props) => {
  const [sites, setSites] = useState(120);
  const [occupancy, setOccupancy] = useState(75);
  const [rate, setRate] = useState(65);
  const [reviewScore, setReviewScore] = useState(4.2);

  const { revenue, complaintReduction, payback } = useMemo(() => {
    const annualRev = sites * (occupancy / 100) * rate * 365;
    // Illustrative 5% revenue lift from better connectivity
    const lift = Math.round(annualRev * 0.05);
    const complaint = Math.min(90, Math.round((5 - reviewScore) * 40 + 30));
    const installCost = 18000 + sites * 60; // illustrative
    const months = Math.max(6, Math.round((installCost / Math.max(lift, 1)) * 12));
    return {
      revenue: lift,
      complaintReduction: complaint,
      payback: `${months}–${months + 6} months`,
    };
  }, [sites, occupancy, rate, reviewScore]);

  const persist = () => {
    try {
      sessionStorage.setItem(
        "assessmentCalculator",
        JSON.stringify({ sites, occupancy, rate, reviewScore })
      );
    } catch {
      /* ignore */
    }
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <section
      id="calculator"
      className={`${
        variant === "full" ? "bg-dark-bg text-white" : "bg-background"
      } py-16 md:py-24`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
            Revenue Impact
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Connectivity Revenue Calculator.
          </h2>
          <p className="mt-4 text-base md:text-lg opacity-80">
            Move the sliders. We'll show you what reliable, property-wide
            internet is worth on your books.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div
            className={`rounded-[4px] p-6 md:p-8 space-y-7 border ${
              variant === "full"
                ? "bg-white/5 border-white/10"
                : "bg-card border-border"
            }`}
          >
            <Field label="Number of Sites / Slips / Lots" value={sites}>
              <Slider
                value={[sites]}
                min={10}
                max={500}
                step={5}
                onValueChange={(v) => setSites(v[0])}
              />
            </Field>
            <Field label="Average Occupancy" value={`${occupancy}%`}>
              <Slider
                value={[occupancy]}
                min={20}
                max={100}
                step={1}
                onValueChange={(v) => setOccupancy(v[0])}
              />
            </Field>
            <Field label="Average Nightly Rate" value={`$${rate}`}>
              <Slider
                value={[rate]}
                min={15}
                max={250}
                step={5}
                onValueChange={(v) => setRate(v[0])}
              />
            </Field>
            <Field label="Current Review Score" value={reviewScore.toFixed(1)}>
              <Slider
                value={[reviewScore * 10]}
                min={20}
                max={50}
                step={1}
                onValueChange={(v) => setReviewScore(v[0] / 10)}
              />
            </Field>
          </div>

          {/* Outputs */}
          <div
            className={`rounded-[4px] p-6 md:p-8 flex flex-col justify-between gap-6 border ${
              variant === "full"
                ? "bg-primary/10 border-primary/30"
                : "bg-primary/5 border-primary/20"
            }`}
          >
            <div className="space-y-5">
              <Output
                label="Potential Annual Revenue Lift"
                value={`+$${fmt(revenue)}`}
                large
              />
              <Output
                label="Estimated Complaint Reduction"
                value={`${complaintReduction}%`}
              />
              <Output label="Estimated Payback Period" value={payback} />
            </div>

            <div>
              <Link
                to="/assessment"
                onClick={persist}
                className="inline-flex items-center justify-center w-full gap-2 rounded-[4px] bg-primary text-primary-foreground h-12 px-6 font-semibold hover:bg-primary/90 transition-colors"
              >
                Run Full Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] opacity-60 mt-3 leading-relaxed">
                Illustrative figures based on industry benchmarks. Request a
                full assessment for engineering-grade numbers tied to your
                property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({
  label,
  value,
  children,
}: {
  label: string;
  value: string | number;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <label className="text-sm font-medium opacity-80">{label}</label>
      <span className="text-sm font-semibold text-primary">{value}</span>
    </div>
    {children}
  </div>
);

const Output = ({
  label,
  value,
  large,
}: {
  label: string;
  value: string;
  large?: boolean;
}) => (
  <div>
    <div className="text-xs uppercase tracking-wider opacity-70 mb-1">
      {label}
    </div>
    <div
      className={`font-bold tabular-nums ${
        large ? "text-3xl md:text-4xl text-primary" : "text-xl md:text-2xl"
      }`}
    >
      {value}
    </div>
  </div>
);

export default CalculatorPreview;
