import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";
import { Wifi, Thermometer, Shield, Lightbulb, Mic, Home } from "lucide-react";
import heroImage from "@/assets/service-smart-home.jpg";

const features = [
  { icon: Mic, title: "Voice Control", desc: "Seamless integration with Alexa and Google Home for hands-free control of your entire home." },
  { icon: Thermometer, title: "Smart Thermostats", desc: "AI-powered climate control that learns your preferences and saves on energy bills." },
  { icon: Shield, title: "Security Systems", desc: "24/7 monitoring with smart cameras, sensors, and instant mobile alerts." },
  { icon: Lightbulb, title: "Smart Lighting", desc: "Automated scenes, schedules, and mood lighting throughout your home." },
  { icon: Wifi, title: "Network Integration", desc: "Your Starlink connection powers every smart device with reliable, high-speed internet." },
  { icon: Home, title: "Whole-Home Automation", desc: "Unified control of locks, blinds, garage doors, and more from a single app." },
];

const SmartHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Smart Home Automation | InstallPros</title>
        <meta name="description" content="Transform your home with professional smart home automation. Voice control, smart thermostats, security systems, and lighting — all powered by Starlink." />
      </Helmet>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="Smart home interior" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Innovative Home Automation
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 text-balance">
              Connect your Starlink network with smart home devices, creating a unified, intelligent environment for maximum comfort and efficiency.
            </p>
            <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("smart_home_hero", navigate)}>
              Get Your Free Quote
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="section section-light">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-12">What We Install</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <div key={f.title} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-lg transition-shadow">
                  <f.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section section-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Ready to Automate Your Home?</h2>
            <p className="text-lg text-primary-foreground/70 mb-8">Our experts design and install complete smart home systems tailored to your lifestyle.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("smart_home_cta", navigate)}>Get Your Free Quote</Button>
              <Button variant="heroOutline" size="default" asChild>
                <a href="tel:+15128817007">Sales (512) 881-7007</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SmartHome;
