import { MapPin } from "lucide-react";
import usaMap from "@/assets/usa-map-hires.png";
import { cityLocations } from "@/data/usCities";

interface CoverageSectionProps {
  statesCount?: string;
  installCount?: string;
}

const CoverageSection = ({ statesCount = "37", installCount = "5,000+" }: CoverageSectionProps) => {
  return (
    <section className="section section-light">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Nationwide Satellite Internet Installation Coverage
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
          Professional installation services available across America. Check if we service your area.
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
          {[
            { value: "49", label: "States Covered" },
            { value: "310+", label: "Cities with Service", highlight: true },
            { value: "5855+", label: "Installations Completed" },
            { value: "98%", label: "US Coverage" },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/50 rounded-xl px-4 py-6 text-center">
              <p className={`text-3xl md:text-4xl font-bold ${stat.highlight ? "text-primary" : "text-foreground"}`}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        
        {/* US Map with city markers */}
        <div className="relative max-w-3xl mx-auto">
          <img 
            src={usaMap} 
            alt="USA coverage map" 
            className="w-full opacity-80"
            loading="lazy"
          />
          
          {/* City location markers */}
          {cityLocations.map((city, i) => (
            <div
              key={i}
              className="absolute group cursor-pointer"
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Ping animation */}
              <div 
                className="absolute w-3 h-3 bg-primary/40 rounded-full animate-ping"
                style={{ animationDelay: `${(i * 100) % 3000}ms`, animationDuration: '2s' }}
              />
              {/* Marker dot */}
              <div className="relative w-2 h-2 md:w-2.5 md:h-2.5 bg-primary rounded-full shadow-lg group-hover:scale-150 transition-transform" />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {city.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Service type badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {["Residential", "Commercial", "Marine", "Mobile"].map((type) => (
            <div
              key={type}
              className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-card"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{type}</span>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-muted-foreground mt-8">
          Available in {statesCount} states — {installCount} fast, professional installations guaranteed.
        </p>
      </div>
    </section>
  );
};

export default CoverageSection;
