import { FileText, Phone, CalendarCheck, Wifi } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Submit Your Info",
    time: "1 min",
    description: "Tell us your location and installation type to get started.",
    icon: FileText,
  },
  {
    number: 2,
    title: "Speak with an Advisor",
    time: "4 mins",
    description: "A dedicated expert will walk you through your best options.",
    icon: Phone,
  },
  {
    number: 3,
    title: "Schedule Your Install",
    time: "2 mins",
    description: "Pick a convenient date — we handle the rest.",
    icon: CalendarCheck,
  },
  {
    number: 4,
    title: "Enjoy High-Speed Internet!",
    time: "forever",
    description: "Sit back and enjoy blazing-fast satellite internet connectivity.",
    icon: Wifi,
  },
];

interface HowItWorksSectionProps {
  maxSteps?: number;
}

const HowItWorksSection = ({ maxSteps }: HowItWorksSectionProps = {}) => {
  const visibleSteps = maxSteps ? steps.slice(0, maxSteps) : steps;
  const stepWord = visibleSteps.length === 1 ? "step" : "steps";

  return (
    <section className="section section-muted">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From quote to connected in {visibleSteps.length === 4 ? "four" : visibleSteps.length === 3 ? "three" : visibleSteps.length} simple {stepWord}.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          {visibleSteps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 md:gap-6 rounded-2xl bg-card p-4 md:p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              {/* Number */}
              <span className="shrink-0 text-2xl md:text-3xl font-bold text-primary leading-none mt-1">
                {step.number}
              </span>

              {/* Icon with gradient background */}
              <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <step.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" strokeWidth={1.8} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="font-semibold text-base md:text-lg text-foreground leading-snug">
                    {step.title}
                  </h3>
                  <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {step.time}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
