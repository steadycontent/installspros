import { ClipboardList, Map, Wrench, Gauge, Activity } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Property Assessment", detail: "Walk the site, audit current ISP, model demand." },
  { icon: Map, title: "Coverage Design", detail: "Engineered heatmap, AP placement, backhaul plan." },
  { icon: Wrench, title: "Installation", detail: "Licensed crews. Trenching, mounting, configuration." },
  { icon: Gauge, title: "Optimization", detail: "Tune for peak occupancy. Validate every site." },
  { icon: Activity, title: "Monitoring", detail: "24/7 alerts. We see outages before guests do." },
];

const ProcessTimeline = () => (
  <section className="bg-background py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
          Our Process
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Five steps from assessment to always-on.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map(({ icon: Icon, title, detail }, i) => (
          <div
            key={title}
            className="relative rounded-[4px] border border-border bg-card p-5"
          >
            <div className="text-[11px] font-mono text-primary mb-3">
              0{i + 1}
            </div>
            <Icon className="w-6 h-6 text-primary mb-3" />
            <div className="font-semibold">{title}</div>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessTimeline;
