import { Helmet } from "react-helmet-async";
import proposalAsset from "@/assets/rv-resort-proposal.pdf.asset.json";

const RvResort70Unit = () => {
  return (
    <>
      <Helmet>
        <title>RV Resort Wi-Fi Proposal — 70 Unit | InstallPros</title>
        <meta name="description" content="InstallPros RV Resort Wi-Fi proposal for a 70-unit property." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen bg-dark-bg flex flex-col">
        <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-white text-base sm:text-lg font-semibold">
            RV Resort Wi-Fi Proposal — 70 Unit
          </h1>
          <a
            href={proposalAsset.url}
            download
            className="inline-flex items-center rounded-[4px] bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition min-h-[44px]"
          >
            Download PDF
          </a>
        </header>
        <div className="flex-1 w-full">
          <object
            data={proposalAsset.url}
            type="application/pdf"
            className="w-full h-[calc(100vh-64px)]"
          >
            <iframe
              src={proposalAsset.url}
              title="RV Resort Wi-Fi Proposal"
              className="w-full h-[calc(100vh-64px)] border-0"
            />
          </object>
        </div>
      </main>
    </>
  );
};

export default RvResort70Unit;
