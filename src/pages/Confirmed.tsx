import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fireMetaLeadEvent } from "@/lib/metaPixel";

const Confirmed = () => {
  useEffect(() => {
    try { fireMetaLeadEvent(); } catch { /* noop */ }
  }, []);

  return (
    <>
      <Helmet>
        <title>Booking Confirmed | InstallPros</title>
        <meta name="description" content="Your installation booking has been confirmed." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your installation has been scheduled. Check your email for confirmation details.
            </p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Confirmed;
