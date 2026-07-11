import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";

interface CTASectionProps {
  installCount?: string;
  statesServed?: string;
  heading?: string;
  subheading?: string;
  hidePhoneCTA?: boolean;
}

const CTASection = ({ installCount = "5,000+", statesServed = "37", heading = "Ready for Satellite Internet?", subheading = "Join thousands of homeowners who trust InstallPros for professional satellite internet installations.", hidePhoneCTA = false }: CTASectionProps) => {
  const navigate = useNavigate();

  return (
    <section id="quote" className="section !pb-6 md:!pb-20 section-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
          {heading}
        </h2>
        <p className="text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
          {subheading}
        </p>

        {/* Stats - above CTA buttons */}
        <div className="mb-6 md:mb-8 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: installCount, label: "Installations" },
            { value: statesServed, label: "States Served" },
            { value: "5.0★", label: "Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("cta_section_quote", navigate)}>
            Get My Quote
          </Button>
          {!hidePhoneCTA && (
            <Button variant="heroOutline" size="default" asChild>
              <a href="tel:+15128070716">Call Now (512) 807-0716</a>
            </Button>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6 max-w-xl mx-auto">
          Compatible with Starlink®, Gen 3, Roam, and other satellite internet systems.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
