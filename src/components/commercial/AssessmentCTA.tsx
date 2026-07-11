import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

const AssessmentCTA = () => (
  <section className="bg-background py-16 md:py-24">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="rounded-[4px] border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
          Free Property Connectivity Assessment
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">
          Let's see what your property could earn with the right network.
        </h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-xl">
          Tell us a few things about your property. We'll come back with
          coverage feasibility, equipment plan, and revenue model.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <Link
            to="/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-primary text-primary-foreground h-14 px-6 font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Free Property Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:+15128070716"
            className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-border bg-card h-14 px-6 font-semibold hover:bg-muted transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call (512) 807-0716
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default AssessmentCTA;
