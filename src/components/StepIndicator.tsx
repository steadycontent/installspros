import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
  completed: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  variant?: "light" | "dark";
}

const StepIndicator = ({ steps, currentStep, variant = "light" }: StepIndicatorProps) => {
  const isDark = variant === "dark";
  
  return (
    <div className="flex items-start justify-center gap-0">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-start">
          {/* Step */}
          <div className="flex flex-col items-center">
            {step.completed ? (
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isDark ? "bg-white" : "bg-gray-900"
              )}>
                <Check className={cn(
                  "w-6 h-6",
                  isDark ? "text-black" : "text-white"
                )} strokeWidth={3} />
              </div>
            ) : (
              <div className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                step.number === currentStep 
                  ? isDark 
                    ? "bg-white border-white text-black" 
                    : "bg-gray-900 border-gray-900 text-white"
                  : isDark
                    ? "border-white/30 text-white/50 bg-transparent"
                    : "border-gray-300 text-gray-400 bg-white"
              )}>
                <span className="text-lg font-semibold">{step.number}</span>
              </div>
            )}
            
            {/* Label */}
            <span className={cn(
              "mt-3 text-sm font-medium text-center max-w-[120px]",
              step.completed || step.number === currentStep
                ? isDark ? "text-white" : "text-gray-900"
                : isDark ? "text-white/50" : "text-gray-400"
            )}>
              {step.label}
            </span>
          </div>

          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div className={cn(
              "w-16 md:w-24 h-0.5 mt-6 mx-2",
              step.completed 
                ? isDark ? "bg-white" : "bg-gray-900"
                : isDark ? "bg-white/20" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
