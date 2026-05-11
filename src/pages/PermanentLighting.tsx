import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MapPin, Ruler, FileText, CalendarCheck, CheckCircle2, Shield, Wrench, CloudRain, Clock, ArrowDown, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import LightingDesignModal from "@/components/lighting/LightingDesignModal";
import heroImg from "@/assets/permanent-lighting-hero.jpg";
import lifestyleImg from "@/assets/permanent-lighting-lifestyle.jpg";
import colorfulImg from "@/assets/permanent-lighting-colorful.jpg";
import warmImg from "@/assets/permanent-lighting-warm.jpg";
import gamedayImg from "@/assets/permanent-lighting-gameday.jpg";

/* ------------------------------------------------------------------ */
/*  Scoped colour tokens — light, warm, uplifting                     */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#ffffff",
  bgSoft: "#f8fafc",
  surface: "#ffffff",
  accent: "#3b82f6",
  accentBright: "#2563eb",
  accentGlow: "rgba(59,130,246,0.25)",
  purple: "#8b5cf6",
  purpleGlow: "rgba(139,92,246,0.2)",
  amber: "#f59e0b",
  green: "#10b981",
  heading: "#1e293b",
  body: "#475569",
  muted: "#94a3b8",
  white: "#ffffff"
};

/* ------------------------------------------------------------------ */
/*  Scroll helpers                                                    */
/* ------------------------------------------------------------------ */
const scrollToQuote = () => {
  document.getElementById("pl-quote")?.scrollIntoView({ behavior: "smooth", block: "center" });
};
const scrollToHowItWorks = () => {
  document.getElementById("pl-how")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */
const steps = [
{ icon: MapPin, title: "Enter Your Address", desc: "Provide your home address to begin.", color: C.accent },
{ icon: Ruler, title: "We Map Your Roofline", desc: "We digitally measure and design your layout.", color: C.purple },
{ icon: FileText, title: "Receive Your Quote", desc: "Transparent pricing and installation timeline.", color: C.amber },
{ icon: CalendarCheck, title: "Schedule Installation", desc: "Approve digitally and book your install date.", color: C.green }];


const benefits = [
"No in-home consultation required",
"Accurate digital measurements",
"Transparent pricing",
"Fast turnaround",
"Professionally installed by licensed technicians"];


const trustPoints = [
{ icon: Wrench, text: "Clean wire management" },
{ icon: Shield, text: "Custom-fit aluminum track" },
{ icon: CloudRain, text: "Weather-resistant components" },
{ icon: Clock, text: "Long-term durability" }];


const gallery = [
{ src: colorfulImg, label: "Holiday & Party Mode", alt: "Home with colorful LED roofline lighting" },
{ src: warmImg, label: "Everyday Elegance", alt: "Home with warm white roofline lighting at dusk" },
{ src: gamedayImg, label: "Game Day Spirit", alt: "Home with blue game day roofline lighting" }];


/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
const PermanentLighting = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <>
    <Helmet>
      <title>Permanent Smart Lighting Virtual Quote | InstallPros</title>
      <meta name="description" content="Get a professional virtual quote for permanent smart roofline lighting. Enter your address, receive accurate pricing, and schedule installation — all online." />
    </Helmet>
    <Navbar />

    <main>
      {/* ============================================================= */}
      {/*  HERO — Video bg fading to white                              */}
      {/* ============================================================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover" poster={heroImg} ref={(el) => {if (el) el.playbackRate = 0.75;}}>
            <source src="/videos/jellyfish-lighting.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28">
          <motion.div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-5 bg-white/90 backdrop-blur-sm shadow-sm"
              style={{ color: C.accent }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}>

            <Sparkles className="h-4 w-4" /> Permanent Smart Lighting
          </motion.div>

          <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-3 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}>Let's Get Lit!


            </motion.h1>

          <motion.p
              className="text-lg md:text-xl font-medium mb-3 text-white/90 drop-shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}>

            Stunning Roofline Lighting — Quoted Without Leaving Home.
          </motion.p>

          <motion.p
              className="text-base md:text-lg mb-8 max-w-xl mx-auto text-white/80 drop-shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}>

            Enter your address for a fast, accurate virtual estimate — hassle-free.
          </motion.p>

          <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}>

            <Button
                size="lg"
                className="text-base px-8 py-4 h-auto rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, color: C.white }}
                onClick={openModal}>

              See My Home Professionally Lit
            </Button>
            <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-4 h-auto rounded-full border-2 border-white/40 text-white backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300"
                onClick={scrollToHowItWorks}>

              How It Works <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================= */}
      <section id="pl-how" className="py-16 md:py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-white">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">How It Works</h2>
          <p className="text-lg text-white/70">Four simple steps to a beautifully lit home.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) =>
            <motion.div
              key={i}
              className="rounded-2xl p-6 text-center transition-all duration-300 group cursor-default bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}>

              <div
                className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${s.color}12` }}>

                <s.icon className="h-6 w-6" style={{ color: s.color }} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: s.color }}>
                Step {i + 1}
              </p>
              <h3 className="text-base font-semibold mb-1" style={{ color: C.heading }}>{s.title}</h3>
              <p className="text-sm" style={{ color: C.body }}>{s.desc}</p>
            </motion.div>
            )}
        </div>
      </section>

      {/* ============================================================= */}
      {/*  GALLERY — "Every Night, Your Way"                            */}
      {/* ============================================================= */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: C.bgSoft }}>
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.heading }}>
            Every Night, <span style={{ color: C.accent }}>Your Way.</span>
          </h2>
          <p style={{ color: C.body }} className="text-lg max-w-lg mx-auto">
            Holiday parties, game days, or everyday curb appeal — one system, endless looks.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {gallery.map((g, i) =>
            <motion.div
              key={i}
              className="rounded-2xl overflow-hidden relative group shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}>

              <img src={g.src} alt={g.alt} className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-sm font-semibold tracking-wide uppercase text-white">{g.label}</p>
              </div>
            </motion.div>
            )}
        </div>
      </section>

      {/* ============================================================= */}
      {/*  BENEFITS + IMAGE                                             */}
      {/* ============================================================= */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: C.bg }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: C.heading }}>
              Professional Results. <span style={{ color: C.accent }}>Zero Sales Pressure.</span>
            </h2>
            <ul className="space-y-3">
              {benefits.map((b, i) =>
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-base"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}>

                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: C.green }} />
                  <span style={{ color: C.body }}>{b}</span>
                </motion.li>
                )}
            </ul>
          </div>
          <motion.div
              className="rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

            <img src={heroImg} alt="Luxury home with permanent LED roofline lighting" className="w-full h-auto object-cover" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  LIFESTYLE / VISION                                           */}
      {/* ============================================================= */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: C.bgSoft }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
              className="rounded-2xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}>

            <img src={lifestyleImg} alt="Home with warm permanent smart lighting" className="w-full h-auto object-cover" />
          </motion.div>

          <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}>

            <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ color: C.heading }}>
              See the Vision <span style={{ color: C.purple }}>Before You Commit.</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: C.body }}>
              Our virtual quoting system lets you visualize your home with permanent smart lighting before installation. Holiday colors, game day themes, or everyday elegance — all professionally designed and ready to install.
            </p>
            <Button
                size="lg"
                className="rounded-full px-8 py-4 h-auto text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, color: C.white }}
                onClick={openModal}>

              See My Home Professionally Lit
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  TRUST                                                        */}
      {/* ============================================================= */}
      <section className="py-16 md:py-20 px-4" style={{ backgroundColor: C.bg }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: C.heading }}>
            Installed by Professionals. <span style={{ color: C.accent }}>Built to Last.</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustPoints.map((t, i) =>
              <motion.div
                key={i}
                className="rounded-xl p-5 text-center bg-white shadow-md border border-gray-100 transition-shadow duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}>

                <t.icon className="h-7 w-7 mx-auto mb-2" style={{ color: C.accent }} />
                <p className="text-sm font-medium" style={{ color: C.heading }}>{t.text}</p>
              </motion.div>
              )}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/*  FINAL CTA                                                    */}
      {/* ============================================================= */}
      <section id="pl-quote" className="py-16 md:py-24 px-4 relative overflow-hidden" style={{ backgroundColor: C.bgSoft }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-2" style={{ color: C.heading }}>
            Ready to{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${C.accent}, ${C.purple})` }}>
              Get Lit?
            </span>
          </h2>
          <p className="text-base md:text-lg mb-8" style={{ color: C.body }}>
            Start your virtual quote in minutes — see what permanent smart lighting can do for your home.
          </p>

          <Button
              size="xl"
              className="rounded-full text-lg px-10 py-5 h-auto transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, color: C.white }}
              onClick={openModal}>

            See My Home Professionally Lit
          </Button>

          <p className="text-sm mt-5" style={{ color: C.muted }}>
            No obligation. Fast response. Professional design included.
          </p>
        </div>
      </section>
    </main>

    <Footer />
    <LightingDesignModal open={modalOpen} onClose={() => setModalOpen(false)} />
  </>);

};

export default PermanentLighting;