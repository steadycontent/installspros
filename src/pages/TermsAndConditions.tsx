import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | InstallPros</title>
        <meta name="description" content="InstallPros terms and conditions for our installation services." />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-3xl mx-auto prose prose-gray">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
            
            <p className="text-gray-600 mb-6">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Agreement</h2>
              <p className="text-gray-600">
                By scheduling an installation with InstallPros, you agree to these terms and conditions. Our services include professional installation of satellite internet systems and smart home devices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Payment Terms</h2>
              <p className="text-gray-600">
                Payment is due upon completion of installation unless otherwise arranged. We accept major credit cards and electronic payments.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Warranty</h2>
              <p className="text-gray-600">
                All installations come with a 30-day workmanship warranty. Equipment warranties are provided by the respective manufacturers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cancellation Policy</h2>
              <p className="text-gray-600">
                Cancellations made 48 hours or more before the scheduled installation are fully refundable. Cancellations within 48 hours may be subject to a cancellation fee.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact</h2>
              <p className="text-gray-600">
                For questions about these terms, contact us at legal@installpros.io.
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
