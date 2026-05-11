import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";
import { DoorOpen, Smartphone, Shield, Wifi, Clock, Users } from "lucide-react";
import heroImage from "@/assets/service-garage-hero.jpg";

const features = [
  { icon: Smartphone, title: "App-Controlled", desc: "Open and close your garage from anywhere using your phone — never wonder if you left it open again." },
  { icon: Shield, title: "Enhanced Security", desc: "Encrypted signals, auto-close timers, and real-time alerts keep your garage secure." },
  { icon: Clock, title: "Scheduled Access", desc: "Set automatic open/close schedules for deliveries, dog walkers, or daily routines." },
  { icon: Users, title: "Guest Access", desc: "Share temporary access codes with family, friends, or service providers." },
  { icon: Wifi, title: "Starlink Connected", desc: "Reliable Starlink internet ensures your smart opener never loses connectivity." },
  { icon: DoorOpen, title: "Voice Control", desc: "Works with Alexa and Google Home — just say the word to open or close." },
];

const GarageOpeners = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Smart Garage Opener Installation | InstallPros</title>
        <meta name="description" content="Professional smart garage door opener installation. App-controlled, voice-enabled, and fully integrated with your smart home." />
      </Helmet>
      <Navbar />
      <main>
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="Modern smart garage" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">Smart Garage Openers</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 text-balance">Control your garage from anywhere. Smart openers with app control, voice commands, and scheduled access.</p>
            <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("garage_hero", navigate)}>Get Your Free Quote</Button>
          </div>
        </section>

        <section className="section section-light">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-12">Smart Garage Features</h2>
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

        <section className="section section-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Upgrade Your Garage</h2>
            <p className="text-lg text-primary-foreground/70 mb-8">Quick installation with most jobs completed in under 2 hours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("garage_cta", navigate)}>Get Your Free Quote</Button>
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

export default GarageOpeners;
