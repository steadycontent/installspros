import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Clock, ArrowLeft, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/installpros-logo.svg";
import { cn } from "@/lib/utils";

interface ProgressStep {
  label: string;
  status: "completed" | "current" | "upcoming";
}

const progressSteps: ProgressStep[] = [
  { label: "Submit your request", status: "completed" },
  { label: "Upload property photos", status: "completed" },
  { label: "Virtual survey review", status: "current" },
  { label: "Receive your quote", status: "upcoming" },
];

const SameDayQuote = () => {
  return (
    <>
      <Helmet>
        <title>Quote In Progress | InstallPros</title>
        <meta name="description" content="Your virtual survey is now under review. We'll contact you with pricing and availability." />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* White Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16 sm:h-20">
              <Link to="/">
                <img src={logo} alt="InstallPros" className="h-8 sm:h-10" />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-24 pb-12 px-6">
          <div className="max-w-2xl mx-auto">

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 text-center">
              Your Quote Is In Progress
            </h1>
            <p className="text-gray-400 text-center mb-6">
              Here's where things stand.
            </p>

            {/* Vertical Progress Timeline */}
            <div className="max-w-md mx-auto mb-8">
              {progressSteps.map((step, index) => (
                <div key={step.label} className="flex items-stretch gap-4">
                  {/* Timeline column */}
                  <div className="flex flex-col items-center">
                    {/* Circle */}
                    {step.status === "completed" ? (
                      <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                    ) : step.status === "current" ? (
                      <div className="w-9 h-9 rounded-full bg-blue-500 border-[3px] border-blue-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                      </div>
                    )}
                    {/* Connecting line */}
                    {index < progressSteps.length - 1 && (
                      <div className={cn(
                        "w-0.5 flex-1 min-h-[24px]",
                        step.status === "completed" ? "bg-green-500/50" : "bg-white/10"
                      )} />
                    )}
                  </div>

                  {/* Label */}
                  <div className={cn(
                    "pt-1 pb-4",
                    step.status === "completed" && "text-gray-500 line-through",
                    step.status === "current" && "text-white font-semibold",
                    step.status === "upcoming" && "text-white/40"
                  )}>
                    <span className="text-base">{step.label}</span>
                    {step.status === "current" && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* What Happens Next Card */}
            <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <h2 className="text-base font-semibold text-white mb-3">What's happening now</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">We're reviewing your photos and evaluating installation requirements</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">We'll confirm the best mounting location and setup</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">A team member will reach out with pricing and availability</p>
                </div>
              </div>
            </div>

            {/* Footer message */}
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
              <Clock className="w-4 h-4" />
              <p className="text-sm">You'll hear from us today.</p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 border-0">
                <Link to="/" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  BACK TO HOME
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SameDayQuote;
