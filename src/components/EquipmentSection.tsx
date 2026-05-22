import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import starlinkKitImage from "@/assets/starlink-kit.jpg";

const EquipmentSection = () => {
  return (
    <section id="shop" className="section section-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60" />
            <img
              src={starlinkKitImage}
              alt="Satellite internet equipment kit"
              className="relative rounded-2xl shadow-lg w-full"
            />
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Optimize Your Experience with Essential Equipment
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Enhance your satellite internet setup with professional-grade mounts, cables, and accessories designed for maximum performance and longevity.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Premium mounting solutions",
                "Weather-resistant cables",
                "Signal optimization tools",
                "Extended warranty options",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="default" size="lg" asChild>
              <Link to="/shop">Shop Essentials</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
