import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import smartHomeImage from "@/assets/smart-home.jpg";

const SmartHomeSection = () => {
  return (
    <section id="learn-more" className="section section-muted">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Innovative Home Automation
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Connect your Starlink network with smart home devices, creating a unified, intelligent environment for maximum comfort and efficiency.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Voice Control", value: "Alexa & Google" },
                { label: "Thermostats", value: "Auto-Optimize" },
                { label: "Security", value: "24/7 Monitoring" },
                { label: "Lighting", value: "Smart Scenes" },
              ].map((stat, index) => (
                <div key={index} className="bg-card rounded-xl p-4 shadow-card">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
            <Button variant="default" size="lg" asChild>
              <Link to="/smart-home">Learn More</Link>
            </Button>
          </div>
          
          <div className="order-1 md:order-2 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60" />
            <img
              src={smartHomeImage}
              alt="Smart home living room"
              className="relative rounded-2xl shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartHomeSection;
