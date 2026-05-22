import residentialImage from "@/assets/starlink-residential-opt.jpg";
import commercialImage from "@/assets/starlink-commercial-opt.jpg";
import marineImage from "@/assets/starlink-marine-new-opt.jpg";
import mobileImage from "@/assets/starlink-mobile-rv-new-opt.jpg";

const features = [
  {
    title: "Residential Satellite Internet",
    description: "Professional home installation with optimal roof positioning for maximum signal.",
    image: residentialImage,
  },
  {
    title: "Commercial Satellite Internet",
    description: "Enterprise-grade connectivity for offices, warehouses, and business facilities.",
    image: commercialImage,
  },
  {
    title: "Marine Satellite Internet",
    description: "Stay connected at sea with durable marine-grade satellite installations.",
    image: marineImage,
  },
  {
    title: "Mobile/RV Satellite Internet",
    description: "Internet anywhere you roam with portable and RV-mounted solutions.",
    image: mobileImage,
  },
];

const FeaturesSection = () => {
  return (
    <section id="services" className="section section-light">
      <div className="max-w-7xl mx-auto min-w-0">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-3 sm:mb-4">
            Satellite Internet Installation Services
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Expert installation for every environment—home, business, sea, or road.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 child-min-w-0">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-feature min-w-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="overflow-hidden rounded-xl mb-3 sm:mb-4">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 sm:h-44 md:h-48 object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-1 sm:mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
