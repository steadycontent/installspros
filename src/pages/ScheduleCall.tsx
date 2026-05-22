import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScheduleCalendar from "@/components/ScheduleCalendar";

const ScheduleCall = () => {
  const handleSchedule = (date: Date, time: string) => {
    console.log("Call scheduled:", { date, time });
    // Will send to webhook when backend is connected
  };

  return (
    <>
      <Helmet>
        <title>Schedule a Call | InstallPros</title>
        <meta name="description" content="Schedule a call with our satellite internet and smart home installation experts." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Schedule a{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Call
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Pick a time that works for you and we'll call to discuss your installation needs.
              </p>
            </div>

            <ScheduleCalendar onSchedule={handleSchedule} />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ScheduleCall;
