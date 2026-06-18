import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | InstallPros</title>
        <meta
          name="description"
          content="Terms and Conditions for InstallPros residential and commercial installation services."
        />
        <link rel="canonical" href="https://installspros.com/terms-and-conditions" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <article className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms and Conditions</h1>
            <p className="text-gray-500 text-sm mb-8">Last updated: June 18, 2026</p>

            <p className="mb-4">
              These Terms and Conditions ("Terms") govern your use of <a href="https://installspros.com" className="text-primary hover:underline">https://installspros.com</a>, any pages or forms that link to these Terms, and the quote, assessment, scheduling, installation, networking, support, and related services provided by InstallPros ("InstallPros," "we," "us," or "our").
            </p>
            <p className="mb-4">
              By using the website, submitting information, requesting a quote, requesting a property assessment, scheduling service, paying a deposit, accepting a proposal, or using our services, you agree to these Terms. If you do not agree, do not use the website or services.
            </p>
            <p className="mb-10">
              InstallPros is an independent installation and connectivity company. We are not affiliated with, endorsed by, or sponsored by Starlink or SpaceX.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Services</h2>
            <p className="mb-3">InstallPros provides residential and commercial installation, networking, and connectivity services, which may include:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Satellite internet installation, including dish mounting, cable routing, router setup, and related setup or support.</li>
              <li>WiFi improvement, mesh networking, router configuration, and home connectivity support.</li>
              <li>Smart home and related installation services where offered on the website.</li>
              <li>Commercial Starlink, property-wide WiFi, network infrastructure, outdoor access points, point-to-point links, network monitoring, guest network isolation, optimization, and related connectivity services.</li>
              <li>Commercial property assessments, coverage design, installation planning, proposals, troubleshooting, and support for RV parks, resorts, campgrounds, marinas, motorcoach properties, businesses, and large properties.</li>
            </ul>
            <p className="mb-4">
              The exact services, deliverables, price, equipment, timeline, exclusions, and support terms for a project will be described in the applicable quote, proposal, invoice, work order, checkout page, or written confirmation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. No Starlink or SpaceX Affiliation</h2>
            <p className="mb-4">
              InstallPros is not Starlink, SpaceX, or an internet service provider. Starlink and SpaceX names, marks, products, and services belong to their respective owners.
            </p>
            <p className="mb-4">
              Unless expressly stated in writing, any satellite internet subscription, internet account, data plan, provider billing, service availability, and service performance are between you and the applicable internet service provider. We are not responsible for provider outages, speeds, network congestion, account status, plan limitations, service decisions, or provider billing.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Website Use</h2>
            <p className="mb-3">You agree to use the website only for lawful purposes and legitimate service inquiries. You may not:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Submit false, misleading, fraudulent, or unauthorized information.</li>
              <li>Attempt to access admin, analytics, submission, customer, or operational systems without authorization.</li>
              <li>Interfere with, copy, scrape, reverse engineer, attack, disrupt, or misuse the website or related systems.</li>
              <li>Use the website to transmit spam, malware, unlawful content, or abusive communications.</li>
            </ul>
            <p className="mb-4">
              We may reject submissions, deny service, suspend access, or take other appropriate action if we believe these Terms are being violated.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Quotes, Assessments, and Calculators</h2>
            <p className="mb-4">
              Website information, pricing examples, assessment results, calculators, advertisements, and preliminary quotes are for informational purposes only. They are not binding offers unless confirmed by InstallPros in writing.
            </p>
            <p className="mb-4">
              Final pricing and scope may depend on site conditions, installation type, roof or mounting requirements, cable routing, trenching, building materials, distance, property access, safety requirements, network design, existing wiring, equipment availability, travel, weather, and other project-specific factors.
            </p>
            <p className="mb-4">
              Commercial revenue, payback, review-score, complaint-reduction, coverage, or performance estimates are illustrative only. They are not guarantees of revenue, occupancy, reviews, uptime, internet speed, or business results.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Customer Responsibilities</h2>
            <p className="mb-3">You are responsible for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Providing accurate contact, billing, service address, property, access, and project information.</li>
              <li>Confirming that you have authority to request work at the property.</li>
              <li>Obtaining any required owner, landlord, HOA, property manager, marina, resort, campground, municipal, utility, or other approvals.</li>
              <li>Maintaining any required internet service subscription, provider account, data plan, equipment account, or billing relationship.</li>
              <li>Ensuring safe and reasonable access to the work area, roof, exterior, network room, conduit, pole, equipment location, electrical outlet, or other relevant space.</li>
              <li>Notifying us of known hazards, access restrictions, fragile surfaces, buried utilities, electrical issues, roof issues, animals, restricted areas, or site rules before work begins.</li>
              <li>Protecting property, backing up data, and preserving devices, networks, systems, or equipment that may be affected by installation or troubleshooting.</li>
            </ul>
            <p className="mb-4">
              If work cannot be completed because of inaccurate information, unsafe conditions, missing approvals, denied access, missing equipment, weather, or other conditions outside our control, additional fees or rescheduling may apply.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Equipment and Third-Party Products</h2>
            <p className="mb-4">
              Some projects require third-party equipment, software, subscriptions, or services, such as satellite internet kits, routers, mounts, cables, access points, switches, cloud controllers, monitoring tools, payment processors, or internet service providers.
            </p>
            <p className="mb-4">
              Unless we expressly agree otherwise in writing, third-party equipment, software, subscriptions, warranties, returns, recalls, and service terms are controlled by the applicable manufacturer, vendor, or provider. InstallPros is not responsible for third-party product defects, warranty decisions, firmware changes, recalls, account issues, service outages, subscription changes, or provider policy changes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Scheduling and Access</h2>
            <p className="mb-4">
              Scheduled dates, appointment times, and arrival windows are estimates. Delays may occur because of weather, traffic, technician availability, customer availability, property access, equipment availability, permitting, utility coordination, safety issues, or other circumstances.
            </p>
            <p className="mb-4">
              You must provide safe access at the scheduled time. If access is unavailable, required equipment is missing, the site is not ready, or the appointment cannot proceed through no fault of InstallPros, a trip, cancellation, or rescheduling fee may apply.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Payments, Deposits, and Invoices</h2>
            <p className="mb-3">Payment terms will be stated in the applicable quote, proposal, invoice, checkout page, or written confirmation. Unless otherwise agreed in writing:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Deposits may be required to reserve appointments, order equipment, begin design work, or schedule crews.</li>
              <li>Remaining balances are due upon completion, milestone completion, or invoice due date.</li>
              <li>Commercial projects may require staged payments, progress billing, equipment deposits, or recurring support or monitoring fees.</li>
              <li>Late payments may result in suspension of services, collections activity, late fees, or recovery of collection costs where permitted by law.</li>
            </ul>
            <p className="mb-4">
              You agree to provide accurate billing information and authorize approved charges through our payment processor.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. Cancellations, Rescheduling, and Refunds</h2>
            <p className="mb-3">Cancellation, rescheduling, and refund terms may vary by service type and project scope. Unless a quote, proposal, invoice, or written confirmation says otherwise:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>You should notify us as soon as possible if you need to cancel or reschedule.</li>
              <li>Deposits may be refundable only if cancellation occurs before technician time is reserved, equipment is ordered, design work begins, travel is incurred, or other costs are incurred.</li>
              <li>Cancellations close to the scheduled appointment may be subject to a cancellation, trip, or rescheduling fee.</li>
              <li>Custom materials, special-order equipment, assessment work, design work, permits, travel, and completed labor may be non-refundable.</li>
            </ul>
            <p className="mb-4">
              Approved refunds may be returned through the original payment method and may take time to process through banks or payment processors.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Workmanship and Support</h2>
            <p className="mb-3">InstallPros may provide limited workmanship support for installation labor we directly perform, as stated in your quote, proposal, invoice, or written confirmation. Any workmanship support applies only to labor we directly performed and does not cover:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Internet speeds, outages, satellite obstructions, provider network issues, weather-related service issues, or provider account problems.</li>
              <li>Third-party equipment defects, manufacturer warranty claims, firmware changes, recalls, or subscription issues.</li>
              <li>Customer modifications, moved equipment, tampering, misuse, neglect, power issues, acts of nature, roof or building defects, animal damage, water intrusion unrelated to our work, or work performed by others.</li>
              <li>Existing wiring, structures, electrical systems, poles, conduits, roofs, networks, or customer-provided equipment unless expressly included.</li>
            </ul>
            <p className="mb-4">
              Your remedy for covered workmanship issues is repair, rework, or refund of the affected labor charge, at our discretion.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">11. Internet and Network Performance</h2>
            <p className="mb-4">
              Connectivity performance depends on many factors outside our control, including satellite visibility, provider network conditions, bandwidth plans, weather, interference, building materials, device limitations, network congestion, electrical reliability, customer usage, third-party equipment, and upstream provider policies.
            </p>
            <p className="mb-4">
              We do not guarantee uninterrupted service, minimum speeds, specific uptime, revenue increases, review improvements, occupancy increases, or elimination of complaints unless expressly stated in a signed written agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">12. Permits, Codes, and Safety</h2>
            <p className="mb-4">
              You are responsible for obtaining required permissions and notifying us of applicable property rules. If permits, utility locates, licensed trades, structural engineering, electrical work, trenching, lift equipment, roof access, or code compliance steps are required, those items may add cost and time.
            </p>
            <p className="mb-4">
              We may refuse or stop work if conditions are unsafe, unlawful, outside scope, or likely to damage property or endanger people.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">13. Project Documentation</h2>
            <p className="mb-4">
              We may document site conditions, installation locations, equipment, network conditions, completed work, and support issues for quality assurance, support, training, billing, warranty, and operational purposes.
            </p>
            <p className="mb-4">
              We may use non-confidential project descriptions or photos for portfolio, marketing, or internal purposes when they do not reveal sensitive customer information. If you do not want project photos used publicly, please tell us in writing.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">14. Intellectual Property</h2>
            <p className="mb-4">
              The website, content, text, images, designs, graphics, calculators, forms, logos, code, and other materials are owned by InstallPros or its licensors and are protected by intellectual property laws. You may not copy, modify, distribute, scrape, display, sell, or exploit website content without our written permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">15. Privacy</h2>
            <p className="mb-4">
              Our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> explains how we collect, use, share, and protect information. By using the website or services, you agree that information may be handled as described in the Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">16. Disclaimers</h2>
            <p className="mb-4">
              The website and services are provided "as is" and "as available" except as expressly stated in a written agreement. To the fullest extent permitted by law, we disclaim implied warranties, including implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.
            </p>
            <p className="mb-4">
              We do not warrant that the website will be uninterrupted, error-free, secure, or free from harmful components, or that website information will always be current, complete, or accurate.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">17. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, InstallPros and its owners, employees, contractors, technicians, vendors, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, punitive, or lost-profit damages arising from or related to the website, services, installations, equipment, internet service, delays, or these Terms.
            </p>
            <p className="mb-4">
              To the fullest extent permitted by law, our total liability for any claim related to a service will not exceed the amount you paid to InstallPros for the specific service giving rise to the claim.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">18. Indemnification</h2>
            <p className="mb-4">
              You agree to defend, indemnify, and hold harmless InstallPros and its owners, employees, contractors, technicians, vendors, and service providers from claims, damages, losses, liabilities, costs, and expenses, including reasonable attorneys' fees, arising from your misuse of the website, inaccurate information, lack of authority or approvals, unsafe site conditions, violation of these Terms, violation of law, or infringement of third-party rights.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">19. Force Majeure</h2>
            <p className="mb-4">
              We are not responsible for delays, failures, or damages caused by events beyond our reasonable control, including weather, natural disasters, power outages, internet outages, provider outages, supply shortages, labor shortages, illness, accidents, acts of government, permitting delays, utility issues, war, terrorism, civil unrest, or similar events.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">20. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by the laws of the state where InstallPros primarily operates, unless applicable law requires otherwise. Any dispute will be handled in a court with proper jurisdiction unless the parties agree otherwise in writing.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">21. Changes to These Terms</h2>
            <p className="mb-4">
              We may update these Terms from time to time. The updated version will be posted on this page with a new "Last updated" date. Continued use of the website or services after changes are posted means you accept the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">22. Contact</h2>
            <p className="mb-4">
              Questions about these Terms may be directed to InstallPros through the website or by phone:
            </p>
            <p className="mb-4">
              InstallPros<br />
              Website: <a href="https://installspros.com" className="text-primary hover:underline">https://installspros.com</a><br />
              Phone: <a href="tel:+15126756605" className="text-primary hover:underline">(512) 675-6605</a>
            </p>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
