import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { INDUSTRIES } from "@/lib/industries";

const IndustriesGrid = () => (
  <section id="industries" className="bg-dark-bg text-white py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
            Industries We Serve
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Built for the properties no one else can cover.
          </h2>
        </div>
        <Link
          to="/assessment"
          className="text-sm text-white/70 hover:text-primary transition-colors underline underline-offset-4"
        >
          Don't see your property? Start an assessment →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRIES.map((industry) => (
          <Link
            key={industry.slug}
            to={`/industries/${industry.slug}`}
            className="group relative overflow-hidden rounded-[4px] border border-white/10 bg-black/40 hover:border-primary/60 transition-all hover:-translate-y-0.5"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={industry.image}
                alt={industry.label}
                loading="lazy"
                width={1280}
                height={832}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{industry.label}</h3>
                <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-white/70 mt-1">{industry.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default IndustriesGrid;
