import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";
import { Shield, Camera, Bell, Smartphone, Lock, Eye } from "lucide-react";
import heroImage from "@/assets/service-security-hero.jpg";

const features = [
  { icon: Camera, title: "Smart Cameras", desc: "HD indoor and outdoor cameras with night vision, motion detection, and cloud recording." },
  { icon: Bell, title: "Instant Alerts", desc: "Real-time push notifications to your phone whenever activity is detected." },
  { icon: Lock, title: "Smart Locks", desc: "Keyless entry with auto-lock, temporary guest codes, and remote access." },
  { icon: Eye, title: "24/7 Monitoring", desc: "Professional monitoring services ensure your home is always protected." },
  { icon: Smartphone, title: "Mobile App Control", desc: "Arm, disarm, and monitor your entire system from anywhere in the world." },
  { icon: Shield, title: "Integrated System", desc: "All devices work together — cameras, sensors, locks, and alarms in one ecosystem." },
];

const SecuritySystems = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Security System Installation | InstallPros</title>
        <meta name="description" content="Professional security system installation. Smart cameras, motion sensors, smart locks, and 24/7 monitoring powered by satellite internet." />
      </Helmet>
      <Navbar />
      <main>
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <img src={heroImage} alt="Home security camera system" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">Smart Security Systems</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 text-balance">Protect your home with intelligent security — cameras, sensors, and smart locks all connected through your satellite internet network.</p>
            <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("security_hero", navigate)}>Get Your Free Quote</Button>
          </div>
        </section>

        <section className="section section-light">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-12">Complete Protection</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Secure Your Home Today</h2>
            <p className="text-lg text-primary-foreground/70 mb-8">Professional installation with same-day setup available in most areas.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => handleQuoteCTA("security_cta", navigate)}>Get Your Free Quote</Button>
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

export default SecuritySystems;
