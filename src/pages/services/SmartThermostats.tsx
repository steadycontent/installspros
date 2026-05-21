import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";
import { Thermometer, Leaf, Smartphone, BarChart3, Clock, Wifi } from "lucide-react";
import heroImage from "@/assets/service-thermostat-hero.jpg";

const benefits = [
  { icon: Leaf, title: "Energy Savings", desc: "Reduce heating and cooling costs by up to 23% with AI-powered scheduling." },
  { icon: Smartphone, title: "Remote Control", desc: "Adjust your home temperature from anywhere using your phone." },
  { icon: BarChart3, title: "Usage Reports", desc: "Detailed energy reports help you understand and optimize consumption." },
  { icon: Clock, title: "Smart Scheduling", desc: "Learns your routine and auto-adjusts to save energy when you're away." },
  { icon: Wifi, title: "Starlink Powered", desc: "Reliable connectivity ensures your thermostat always stays online." },
  { icon: Thermometer, title: "Multi-Zone Control", desc: "Set different temperatures for each room or floor in your home." },
];

const SmartThermostats = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Smart Thermostat Installation | InstallPros</title>
        <meta name="description" content="Professional smart thermostat installation. Save energy, control from anywhere, and integrate with your Starlink-powered smart home." />
      </Helmet>
      <Navbar />
      <main>
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="Smart thermostat on wall" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">Smart Thermostat Installation</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 text-balance">Intelligent climate control that learns your preferences, saves energy, and keeps your home comfortable year-round.</p>
            <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("thermostat_hero", navigate)}>Get Your Free Quote</Button>
          </div>
        </section>

        <section className="section section-light">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-12">Why Go Smart?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((b) => (
                <div key={b.title} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-lg transition-shadow">
                  <b.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Upgrade Your Climate Control</h2>
            <p className="text-lg text-primary-foreground/70 mb-8">We install and configure all major smart thermostat brands — Nest, Ecobee, Honeywell, and more.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("thermostat_cta", navigate)}>Get Your Free Quote</Button>
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

export default SmartThermostats;
