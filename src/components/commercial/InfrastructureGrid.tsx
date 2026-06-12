import { Satellite, Wifi, Network, Radio, Activity, Shield } from "lucide-react";

const items = [
  { icon: Satellite, title: "Starlink Business", detail: "Priority bandwidth uplink for SLA-grade uptime." },
  { icon: Wifi, title: "Ubiquiti Enterprise", detail: "UniFi controllers, switches, gateways." },
  { icon: Radio, title: "Outdoor Access Points", detail: "Weather-rated APs engineered for acreage." },
  { icon: Network, title: "Point-to-Point Links", detail: "Wireless backhaul for buildings without fiber." },
  { icon: Activity, title: "Network Monitoring", detail: "24/7 alerting. We watch so you don't have to." },
  { icon: Shield, title: "Guest Network Isolation", detail: "PCI-friendly, segmented, compliant." },
];

const InfrastructureGrid = () => (
  <section className="bg-dark-bg text-white py-16 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-3">
          Commercial Infrastructure
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          A connectivity partner — not an installer.
        </h2>
        <p className="mt-4 opacity-75">
          We engineer, install, and operate the full stack. One vendor, one
          accountable team.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ icon: Icon, title, detail }) => (
          <div
            key={title}
            className="rounded-[4px] border border-white/10 bg-white/5 p-6 hover:border-primary/40 transition-colors"
          >
            <Icon className="w-7 h-7 text-primary mb-4" />
            <div className="font-semibold text-lg">{title}</div>
            <p className="text-sm opacity-70 mt-1.5 leading-relaxed">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default InfrastructureGrid;
