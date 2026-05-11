import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteForm from "@/components/QuoteForm";

const ContactDetails = () => {
  return (
    <>
      <Helmet>
        <title>Contact Details | InstallPros</title>
        <meta name="description" content="Provide your contact details for installation." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Contact Details</h1>
              <p className="text-gray-600">
                Please provide your information so we can coordinate your installation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <QuoteForm />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactDetails;
