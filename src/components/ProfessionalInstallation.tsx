import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  {
    title: "Customized Setup",
    description: "We customize installations for Residential, Commercial, Marine, and Mobile needs.",
  },
  {
    title: "Complete Installation",
    description: "We take care of everything—mounting, cabling, and router setup. Prices start at $899.",
  },
  {
    title: "Quick Install: Within 7 Days",
    description: "We supply and install your satellite internet system, typically within 7 days. Installations take 1–3 hours, with optimal performance within 12 hours.",
  },
  {
    title: "Nationwide Coverage",
    description: "Our expert installation services are available across the U.S., no matter where you're located.",
  },
];

const ProfessionalInstallation = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section section-muted">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold italic gradient-text mb-3">
            Professional Installation
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Durable, all-metal mounts for high-quality, long-lasting installations.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 bg-card rounded-2xl p-5 md:p-6 shadow-[var(--shadow-card)]"
            >
              <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-background" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base md:text-lg text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Button variant="hero" size="lg" onClick={scrollToTop}>
            Let's Get Started!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalInstallation;
