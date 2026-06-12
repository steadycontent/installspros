import { TrendingUp, Clock, Star, MessageSquareOff } from "lucide-react";

const metrics = [
  { icon: TrendingUp, label: "More Bookings", detail: "Connectivity is the #1 amenity guests filter on." },
  { icon: Clock, label: "Longer Stays", detail: "Remote workers extend trips when WiFi works." },
  { icon: Star, label: "Higher Review Scores", detail: "Cut WiFi complaints, raise overall ratings." },
  { icon: MessageSquareOff, label: "Fewer Complaints", detail: "Stop refunds and angry desk calls." },
];

const MetricsBand = () => (
  <section className="bg-background py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
          Why Connectivity Matters
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Connectivity is your top revenue lever.
        </h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg">
          Modern guests, residents, and tenants choose properties on
          bandwidth. We turn your WiFi from a complaint into a competitive
          edge.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ icon: Icon, label, detail }) => (
          <div
            key={label}
            className="rounded-[4px] border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <Icon className="w-7 h-7 text-primary mb-4" />
            <div className="font-semibold text-lg">{label}</div>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MetricsBand;
