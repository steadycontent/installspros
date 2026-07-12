import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { handleQuoteCTA } from "@/lib/handleQuoteCTA";
import InlineQuoteFlow from "@/components/InlineQuoteFlow";
import { 
  Satellite, CheckCircle, Package, Truck, DollarSign, 
  Star, MapPin, Phone, ChevronDown, ChevronUp, ArrowRight
} from "lucide-react";
import heroImage from "@/assets/vr-hero.webp";
import trustpilotBadge from "@/assets/trustpilot-badge.png";
import googleLogo from "@/assets/google-logo.svg";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Package,
    title: "All-in-One Solution",
    description: "We provide everything you need to get connected, from purchasing your equipment to expert installation—all in one place."
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Order your equipment from us and enjoy fast delivery, getting you online with high-speed internet in no time."
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Our Starlink kits are competitively priced, with straightforward installation fees that save you money."
  }
];

const installationFeatures = [
  {
    title: "Customized Setup",
    description: "We customize installations for Residential, Commercial, Marine, and Mobile needs."
  },
  {
    title: "Complete Installation",
    description: "We take care of everything—mounting, cabling, and router setup. Prices start at $899."
  },
  {
    title: "Quick Install: Within 7 Days",
    description: "We supply and install your Starlink system, typically within 7 days. Installations take 1-3 hours."
  },
  {
    title: "Nationwide Coverage",
    description: "Our expert installation services are available across the U.S., no matter where you're located."
  }
];

const testimonials = [
  {
    name: "David Parkinson",
    time: "1 month ago",
    text: "Hi. These guys were good. We have metre thick stone walls, three stories, and in the middle of nowhere. Loved the way they...",
    rating: 5
  },
  {
    name: "Steve Titley",
    time: "1 month ago",
    text: "If you are having Starlink installed then this is the company to use. Professional throughout and always a speedy response on...",
    rating: 5
  },
  {
    name: "Kerry Jean",
    time: "2 months ago",
    text: "Amazing experience from the very first enquiry to the installation and I have contacted them a few times to ask questions and always a...",
    rating: 5
  }
];

const stats = [
  { value: "37", label: "States Covered" },
  { value: "310+", label: "Cities with Service" },
  { value: "7,000+", label: "Installations Completed" },
  { value: "98%", label: "US Coverage" }
];

const faqs = [
  {
    question: "What if I haven't received my Starlink kit yet?",
    answer: "No problem! We can help you order your Starlink kit through us, or you can schedule your installation for after your kit arrives. Just let us know your expected delivery date."
  },
  {
    question: "Do you install on roofs, barns, or poles?",
    answer: "Yes! We install on all types of structures including rooftops (metal, shingle, flat), barns, poles, and ground mounts. We'll assess your property and recommend the best mounting solution."
  },
  {
    question: "Can I get help with Wi-Fi inside my home too?",
    answer: "Absolutely! We offer mesh network setup and Wi-Fi optimization services to ensure you have strong signal throughout your entire home."
  },
  {
    question: "How much does Starlink installation cost?",
    answer: "Our standard installation starts at $899, which includes mounting, cabling, router setup, and speed verification. Complex installations may have additional costs."
  },
  {
    question: "How long does the installation take?",
    answer: "Most installations take between 1-3 hours. Your system will reach optimal performance within 12 hours of activation."
  },
  {
    question: "Does Starlink come with a router?",
    answer: "Yes, Starlink comes with its own router. We'll set it up and optimize it during installation, and can also integrate it with your existing network if needed."
  },
  {
    question: "What happens after installation?",
    answer: "We verify your speeds, walk you through the system, and provide a 30-day workmanship warranty. Our support team is available for any questions after installation."
  }
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-muted-foreground animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
};

const StarlinkLp1 = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Starlink Installation | Fast, Reliable Internet | InstallPros</title>
        <meta name="description" content="Get fast, reliable internet without the installation headache. Professional Starlink installers handling all roof types. Same-week scheduling available." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section with Inline Quote Form */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 w-full py-24 px-6 md:py-16 lg:py-20">
            {/* Badge */}
            <div 
              className="text-center mb-8 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-primary/10 border border-primary/20">
                <span className="text-sm font-semibold text-primary">🇺🇸 37 States Nationwide</span>
              </span>
            </div>
            
            {/* Inline Quote Form */}
            <div 
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <InlineQuoteFlow />
            </div>

            {/* Trust badges */}
            <div 
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              {/* Google Rating */}
              <div className="flex items-center gap-3 bg-card backdrop-blur-sm rounded-lg px-4 py-3 border border-border shadow-card">
                <img src={googleLogo} alt="Google" className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground font-medium">Google rating</div>
                  <div className="flex items-center gap-1">
                    <span className="text-foreground font-bold">5.0</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Trustpilot */}
              <div className="flex items-center gap-3 bg-card backdrop-blur-sm rounded-lg px-4 py-3 border border-border shadow-card">
                <img src={trustpilotBadge} alt="Trustpilot" className="h-8 w-auto" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground font-medium">Trustpilot</div>
                  <div className="text-foreground font-bold">Excellent</div>
                </div>
              </div>
              
              {/* Installations Count */}
              <div className="flex items-center gap-3 bg-card backdrop-blur-sm rounded-lg px-4 py-3 border border-border shadow-card">
                <div className="text-left">
                  <div className="text-2xl font-bold text-primary">7,000+</div>
                  <div className="text-xs text-muted-foreground font-medium">U.S. Installations</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Your Complete Solution Section */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your Complete Starlink Solution
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Residential, Commercial, Marine, and Mobile Installations Available Nationwide
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {features.map((feature) => (
                <div key={feature.title} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={() => handleQuoteCTA("lp1_solution_cta", navigate)} size="lg">
                LET'S GET STARTED!
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Top-Rated by Our Clients
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.time}</div>
                    </div>
                    <img src={googleLogo} alt="Google" className="ml-auto w-5 h-5" />
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">{testimonial.text}</p>
                  <button className="text-primary text-sm mt-2 hover:underline">Read more</button>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <div className="bg-card rounded-xl px-6 py-4 border border-border inline-flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <img src={googleLogo} alt="Google" className="w-8 h-8" />
                  <span className="text-xl font-bold text-foreground">5.0</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">Top Rated Service 2025</div>
                  <div className="text-sm text-muted-foreground">verified by Trustindex</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Installation Section */}
        <section className="py-20 px-6 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground italic mb-4">
                Professional Installation
              </h2>
              <p className="text-muted-foreground">
                Durable, all-metal mounts for high-quality, long-lasting installations.
              </p>
            </div>

            <div className="space-y-6">
              {installationFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button onClick={() => handleQuoteCTA("lp1_install_cta", navigate)} size="lg">
                LET'S GET STARTED!
              </Button>
            </div>
          </div>
        </section>

        {/* Coverage Section - Light theme */}
        <section className="py-20 px-6 bg-muted">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Nationwide Starlink Installation Coverage
              </h2>
              <p className="text-muted-foreground">
                Professional installation services available across America. Check if we service your area.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="bg-card rounded-xl p-6 border border-border shadow-card">
                <h3 className="font-bold text-xl mb-4 text-foreground">Check Your Availability</h3>
                <Button 
                  onClick={() => handleQuoteCTA("lp1_zip_check", navigate)}
                  variant="outline"
                  className="w-full h-12 mb-4"
                >
                  Enter your ZIP code...
                </Button>
                <Button onClick={() => handleQuoteCTA("lp1_find_installer", navigate)} className="w-full" size="lg">
                  Find My Installer
                </Button>
                
                <div className="mt-6">
                  <div className="text-sm font-semibold mb-2 text-foreground">Availability</div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-foreground">Available (37 States)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">North Dakota - Coming Soon</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                {/* Placeholder for US map */}
                <div className="bg-card border border-border rounded-xl p-8 h-64 flex items-center justify-center shadow-card">
                  <Satellite className="w-24 h-24 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              FAQ's
            </h2>
            <div>
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-card rounded-2xl p-12 border border-border shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready To Get Your Starlink Installed?
              </h2>
              <p className="text-muted-foreground mb-8">
                Let's make your Starlink setup stress-free, fast, and fully optimized.
              </p>
              <Button onClick={() => handleQuoteCTA("lp1_final_cta", navigate)} size="lg">
                GET STARTED
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground mt-8 max-w-2xl mx-auto">
              <strong>Disclaimer:</strong> installpros.io is an independent entity and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Starlink, SpaceX, or any of their subsidiaries or affiliates.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default StarlinkLp1;
