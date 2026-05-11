import { Package, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const props = [
  {
    icon: Package,
    title: "All-in-One Solution",
    description:
      "We provide everything you need to get connected, from purchasing your equipment to expert installation—all in one place.",
  },
  {
    icon: Truck,
    title: "Same-Week Installation",
    description:
      "Same-week scheduling in most areas, with clear communication before and after your installation.",
  },
  {
    icon: ShieldCheck,
    title: "Clear, Upfront Pricing",
    description:
      "Know exactly what's included before work begins. No hidden fees.",
  },
];

const GusValueProps = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section section-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-3 sm:mb-4">
            Your Complete Starlink Solution
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Residential, Commercial, Marine, and Mobile Installations Available Nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-14">
          {props.map((prop) => (
            <div
              key={prop.title}
              className="bg-muted rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center mb-5">
                <prop.icon className="text-background" size={28} />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2 text-foreground">
                {prop.title}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {prop.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" onClick={scrollToTop}>
            Check Availability
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GusValueProps;
