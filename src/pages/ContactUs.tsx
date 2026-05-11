import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUrlParams } from "@/contexts/UrlParamsContext";

const inquiryOptions = [
  { value: "sales", label: "Sales / Get a Quote" },
  { value: "support", label: "Technical Support" },
  { value: "scheduling", label: "Scheduling" },
  { value: "billing", label: "Billing" },
  { value: "other", label: "Other" },
];

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiry: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const urlParams = useUrlParams();

  const handleInquirySelect = (value: string) => {
    if (value === "sales") {
      navigate("/?from=quote");
      return;
    }
    setFormData({ ...formData, inquiry: value });
  };

  const getFbclid = (): string => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("fbclid") || sessionStorage.getItem("installpros_fbclid") || "";
  };

  useState(() => {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) {
      sessionStorage.setItem("installpros_fbclid", fbclid);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiry: formData.inquiry || 'Sales Inquiry',
          message: formData.message,
          utm_source: urlParams.utm_source,
          utm_medium: urlParams.utm_medium,
          utm_campaign: urlParams.utm_campaign,
          utm_term: urlParams.utm_term,
          utm_content: urlParams.utm_content,
          utm_agency: urlParams.utm_agency,
          gclid: urlParams.gclid,
          fbclid: getFbclid(),
        },
      });

      if (error) throw error;

      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", phone: "", inquiry: "", message: "" });
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | InstallPros - Get in Touch</title>
        <meta
          name="description"
          content="Contact InstallPros for Starlink installation quotes, support, or questions. Call (512) 881-7007 or fill out our contact form."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
          {/* Hero Section */}
          <section className="relative pt-28 pb-16 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative max-w-6xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Let's{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Connect
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Whether you need a quote, technical support, or just have a question — our team is ready to help.
              </p>
            </div>
          </section>

          {/* Quick Contact Cards */}
          <section className="px-6 -mt-4 mb-12">
            <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
              <a
                href="tel:+15128817007"
                className="group bg-card border border-border rounded-[4px] p-6 text-center hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                <p className="text-primary font-medium">(512) 881-7007</p>
                <p className="text-xs text-muted-foreground mt-1">Mon–Fri, 8am–6pm CT</p>
              </a>

              <a
                href="mailto:support@installpros.io"
                className="group bg-card border border-border rounded-[4px] p-6 text-center hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                <p className="text-primary font-medium">support@installpros.io</p>
                <p className="text-xs text-muted-foreground mt-1">We reply within 24 hours</p>
              </a>

              <div className="bg-card border border-border rounded-[4px] p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">HQ Location</h3>
                <p className="text-sm text-muted-foreground">2028 E Ben White Blvd</p>
                <p className="text-xs text-muted-foreground">Austin, TX 78741</p>
              </div>
            </div>
          </section>

          {/* Form + Info Section */}
          <section className="px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-12">
                {/* Form - takes 3 cols */}
                <div className="lg:col-span-3">
                  <div className="bg-card border border-border rounded-[4px] p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
                    
                    {/* Subject pill buttons */}
                    <div className="mb-4">
                      <Label className="mb-2 block text-sm">Subject</Label>
                      <div className="flex flex-wrap gap-2">
                        {inquiryOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleInquirySelect(option.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                              formData.inquiry === option.value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 text-sm">Fill out the form and our team will get back to you promptly.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="rounded-[4px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="rounded-[4px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="rounded-[4px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your project or question..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          className="rounded-[4px]"
                        />
                      </div>

                      <Button type="submit" className="w-full rounded-[4px]" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                        {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Sidebar info - takes 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Why Contact Us */}
                  <div className="bg-muted/30 border border-border rounded-[4px] p-6">
                    <h3 className="font-semibold text-foreground mb-4">Why reach out?</h3>
                    <ul className="space-y-3">
                      {[
                        "Get a custom Starlink installation quote",
                        "Schedule a same-week installation",
                        "Technical support for existing installs",
                        "Commercial & multi-site project inquiries",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Response Time */}
                  <div className="bg-muted/30 border border-border rounded-[4px] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Response Time</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Most inquiries receive a response within <span className="text-foreground font-medium">2–4 hours</span> during business hours.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-muted-foreground">Available now</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-primary to-accent rounded-[4px] p-6 text-white">
                    <h3 className="font-semibold mb-4">Trusted Nationwide</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold">5,000+</p>
                        <p className="text-xs text-white/70">Installations</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">37</p>
                        <p className="text-xs text-white/70">States Served</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">5.0 ★</p>
                        <p className="text-xs text-white/70">Google Rating</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">&lt;24h</p>
                        <p className="text-xs text-white/70">Avg Response</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;
