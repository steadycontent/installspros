import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Star } from "lucide-react";
import SupportDisclaimerBar from "@/components/SupportDisclaimerBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const INeedStarlink = () => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate("/?resumeQuote=true");
  };

  return (
    <>
      <Helmet>
        <title>Get Starlink Installed – InstallPros</title>
        <meta
          name="description"
          content="Choose between ordering a professional Starlink installation or getting support for your existing Starlink service."
        />
        <link rel="canonical" href="https://installpros.io/i-need-starlink" />
      </Helmet>

      <main className="min-h-screen">
        <SupportDisclaimerBar />
        <Navbar />

        <section className="relative min-h-[110vh] flex items-start justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 bg-black" />

          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-[120px] sm:pt-[140px] pb-6">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white animate-fade-in-up mb-3 sm:mb-4 text-center leading-tight [word-break:keep-all] [overflow-wrap:normal] [hyphens:none]">
              Order Starlink Internet Installed at Your Home
            </h1>

            {/* Subheadline */}
            <p
              className="text-base sm:text-lg md:text-xl text-[#D1D5DB] max-w-3xl mx-auto mb-2 sm:mb-3 animate-fade-in-up opacity-0 animation-delay-200 text-center px-4 sm:px-6 text-balance"
              style={{ animationFillMode: "forwards" }}
            >
              New residential Starlink installations professionally handled from start to finish.
            </p>

            {/* Badge */}
            <div
              className="flex justify-center my-3 sm:my-4 animate-fade-in-up opacity-0 animation-delay-400"
              style={{ animationFillMode: "forwards" }}
            >
              <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm sm:text-base text-white/90 font-medium">
                37 States Nationwide 🇺🇸
              </span>
            </div>

            {/* Intent Segmentation Block */}
            <div
              className="animate-fade-in-up opacity-0 animation-delay-400 max-w-2xl mx-auto mt-6"
              style={{ animationFillMode: "forwards" }}
            >
              <p className="text-white/70 text-sm sm:text-base font-medium text-center mb-5">
                What brings you here today?
              </p>
              <div className="grid grid-cols-[1fr_0.7fr] gap-3 sm:gap-5 max-w-xl mx-auto items-start">
                {/* Primary: Order Starlink */}
                <button
                  onClick={handleOrderClick}
                  className="group relative flex flex-col items-center rounded-[4px] border-2 border-white/30 bg-black hover:bg-white/5 hover:border-white/60 transition-all duration-300 text-center cursor-pointer overflow-hidden"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      alt="Starlink dish"
                      className="w-full h-full object-cover"
                      src="/lovable-uploads/77d7f8c1-2b7f-40a6-a3ad-104e9ec44c5f.png"
                    />
                  </div>
                  <div className="w-full p-3 sm:p-4">
                    <span className="block text-base sm:text-xl md:text-2xl font-bold text-white leading-tight uppercase tracking-wide">
                      I Need Starlink Installation
                    </span>
                  </div>
                </button>

                {/* Secondary column: Support card + disclaimer */}
                <div className="flex flex-col gap-3">
                  <a
                    href="https://www.starlink.com/support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center gap-2 sm:gap-3 aspect-square rounded-[4px] border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/60 transition-all duration-300 text-center p-3 sm:p-4"
                  >
                    <img
                      alt="Support headset"
                      className="w-12 h-12 sm:w-16 sm:h-16 object-fill border-0"
                      src="/lovable-uploads/a4c57ed0-af14-4c51-a6a4-871fa399b3f0.png"
                    />
                    <span className="text-white leading-tight font-sans font-medium sm:text-xl text-base">
                      I Need Starlink<br />help or support
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-white/50">
                      Billing, outages, support
                    </span>
                    <ExternalLink className="w-3 h-3 text-white/30 absolute top-2 right-2 sm:top-3 sm:right-3" />
                  </a>
                  <div className="text-center text-[10px] sm:text-xs text-white/50 leading-snug">
                    <span className="mr-1">⚠️</span>
                    InstallPros does not provide account or technical support.{" "}
                    <a
                      href="https://www.starlink.com/support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium"
                    >
                      Go to Starlink Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-float hidden sm:block">
            <div className="w-6 h-10 border-2 border-[#111827] rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-[#6B7280] rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default INeedStarlink;
