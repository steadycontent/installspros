import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";
import { Cable, Wrench, Shield, Radio } from "lucide-react";
import heroImage from "@/assets/service-equipment.jpg";
import starlinkKit from "@/assets/starlink-kit.jpg";

const categories = [
  { icon: Radio, title: "Mounting Solutions", desc: "Professional-grade roof, wall, and pole mounts engineered for every environment — from residential rooftops to marine vessels.", image: starlinkKit },
  { icon: Cable, title: "Cables & Adapters", desc: "Weather-resistant ethernet cables, power adapters, and extension kits rated for outdoor use and extreme temperatures." },
  { icon: Wrench, title: "Installation Tools", desc: "Signal optimization meters, alignment tools, and professional installation kits for a perfect setup every time." },
  { icon: Shield, title: "Protection & Warranty", desc: "Surge protectors, weatherproof enclosures, and extended warranty plans to keep your equipment running for years." },
];

const Shop = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Satellite Internet Equipment & Accessories | InstallPros</title>
        <meta name="description" content="Shop professional-grade satellite internet mounts, cables, signal tools, and accessories. Everything you need for a perfect installation." />
      </Helmet>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="Satellite internet equipment and accessories" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Essential Equipment & Accessories
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 text-balance">
              Professional-grade mounts, cables, and tools designed for maximum satellite internet performance and longevity.
            </p>
            <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("shop_hero", navigate)}>
              Request a Quote
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section className="section section-light">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-12">Product Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((c) => (
                <div key={c.title} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-lg transition-shadow">
                  <c.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{c.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section section-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Need Help Choosing?</h2>
            <p className="text-lg text-primary-foreground/70 mb-8">Our team will recommend the right equipment for your specific installation.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("shop_cta", navigate)}>Get Your Free Quote</Button>
              <Button variant="heroOutline" size="default" asChild>
                <a href="tel:+15126756605">Sales (512) 675-6605</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Shop;
