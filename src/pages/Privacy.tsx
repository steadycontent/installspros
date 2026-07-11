import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | InstallPros</title>
        <meta
          name="description"
          content="How InstallPros collects, uses, shares, and protects information across our residential and commercial installation services."
        />
        <link rel="canonical" href="https://installspros.com/privacy" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <article className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
            <p className="text-gray-500 text-sm mb-8">Last updated: June 18, 2026</p>

            <p className="mb-4">
              This Privacy Policy explains how InstallPros ("InstallPros," "we," "us," or "our") collects, uses, shares, and protects information when you visit or use <a href="https://installspros.com" className="text-primary hover:underline">https://installspros.com</a>, request a quote, submit a property assessment, schedule service, contact us, or use our related installation and connectivity services.
            </p>
            <p className="mb-4">
              InstallPros provides nationwide satellite internet installation, smart home and networking services, and commercial connectivity infrastructure, including commercial Starlink, property-wide WiFi, network design, installation, optimization, monitoring, and related services for RV parks, resorts, campgrounds, marinas, motorcoach properties, businesses, and other large properties.
            </p>
            <p className="mb-10">
              InstallPros is an independent installation and connectivity company. We are not affiliated with, endorsed by, or sponsored by Starlink or SpaceX.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Information We Collect</h2>
            <p className="mb-3">We may collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Name, email address, phone number, service address, billing information, and contact preferences.</li>
              <li>Residential installation details, such as satellite internet kit status, installation location, roof or pole mount needs, cable routing needs, router setup needs, WiFi coverage needs, and support requests.</li>
              <li>Commercial property details, such as business name, property type, number of sites, slips, lots, units, buildings, current internet provider, current WiFi issues, coverage needs, network goals, assessment details, and uploaded or submitted project information.</li>
              <li>Scheduling, quote, payment, support, and communication details.</li>
              <li>Messages you send through contact, quote, assessment, scheduling, or support forms.</li>
            </ul>
            <p className="mb-3">We may also collect information automatically when you use the website, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>IP address, browser type, device type, operating system, pages viewed, referring URL, date and time of visit, clicks, form interactions, and approximate location.</li>
              <li>Cookie, pixel, tag, analytics, advertising, and performance information.</li>
              <li>Session and interaction information used to understand how visitors use the website and how our advertising performs.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. How We Use Information</h2>
            <p className="mb-3">We use information to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Respond to quote requests, assessment requests, support requests, and other inquiries.</li>
              <li>Evaluate service availability, property needs, installation feasibility, equipment requirements, and project scope.</li>
              <li>Schedule and perform residential satellite internet installations, router setup, WiFi improvements, smart home services, networking services, and related support.</li>
              <li>Design, quote, install, optimize, monitor, and support commercial connectivity infrastructure.</li>
              <li>Communicate by phone, email, SMS, or other channels about quotes, appointments, installations, support, billing, and service updates.</li>
              <li>Process deposits, payments, invoices, and related transaction records.</li>
              <li>Improve the website, forms, services, customer experience, advertising, analytics, and internal operations.</li>
              <li>Prevent fraud, spam, security incidents, unauthorized access, and misuse of the website.</li>
              <li>Comply with legal obligations and enforce our terms.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. SMS, Phone, and Email Communications</h2>
            <p className="mb-4">
              When you provide your phone number, you authorize InstallPros to contact you about your inquiry, quote, assessment, appointment, installation, support request, or related service matter. This may include calls, text messages, or automated communications where permitted by law.
            </p>
            <p className="mb-4">
              Message frequency may vary. Message and data rates may apply. You may opt out of marketing text messages by replying <strong>STOP</strong>. You may reply <strong>HELP</strong> for help. Opting out of marketing texts does not prevent us from sending non-marketing service messages, such as appointment, billing, support, or installation-related communications.
            </p>
            <p className="mb-4">
              We do not share mobile opt-in data or text message consent information with third parties for their own marketing or promotional purposes. We may share such information with service providers or subcontractors only as needed to support messaging, scheduling, customer service, installation, billing, or similar operational purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Cookies, Analytics, and Advertising</h2>
            <p className="mb-4">
              The website uses cookies, pixels, tags, scripts, and similar technologies for site functionality, analytics, advertising measurement, retargeting, conversion tracking, performance monitoring, and fraud or ad-quality controls.
            </p>
            <p className="mb-4">
              Based on the live website, these tools may include Google Ads/gtag, Hotjar or Contentsquare, Bing UET, Meta Pixel, Flock/Lovable analytics, IP/ad-quality tools, and related technologies. These tools may collect or receive information such as IP address, device identifiers, browser information, page views, clicks, form events, session activity, referral information, and conversion events.
            </p>
            <p className="mb-4">
              You can control cookies through your browser settings. You may also use platform-specific ad settings or opt-out tools. If the website provides an opt-out preferences page, you may use it to manage certain privacy choices. Blocking cookies may affect site functionality or measurement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Payments</h2>
            <p className="mb-4">
              If you pay a deposit, invoice, or service charge, payment information may be processed by third-party payment processors. We may receive transaction details such as payment status, amount, date, billing information, and invoice information, but we do not need to store full payment card numbers to provide our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. How We Share Information</h2>
            <p className="mb-3">We may share information with:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>InstallPros personnel, technicians, installers, sales representatives, support staff, and contractors.</li>
              <li>Service providers that support website hosting, forms, CRM, scheduling, SMS, email, analytics, advertising, payment processing, customer support, security, and business operations.</li>
              <li>Installation subcontractors, equipment providers, network vendors, or project partners when needed to quote, perform, support, or troubleshoot a project.</li>
              <li>Professional advisors such as attorneys, accountants, insurers, and auditors.</li>
              <li>Government authorities, courts, law enforcement, or other parties when required by law or necessary to protect rights, safety, and security.</li>
              <li>A successor or prospective buyer in connection with a merger, financing, acquisition, sale, or transfer of business assets.</li>
            </ul>
            <p className="mb-4">
              We do not sell personal information in the traditional sense of exchanging it for money. Some analytics, advertising, and retargeting activities may be considered "sharing," "sale," or "targeted advertising" under certain U.S. state privacy laws. Where required, you may opt out as described in this policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Third-Party Services</h2>
            <p className="mb-4">
              Our services may involve third-party products, platforms, or providers, such as satellite internet equipment, networking equipment, monitoring tools, maps, payment processors, analytics providers, advertising platforms, or internet service providers. These third parties may process information according to their own terms and privacy policies.
            </p>
            <p className="mb-4">
              We are not responsible for the privacy practices of third-party websites, products, platforms, or service providers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Data Retention</h2>
            <p className="mb-4">
              We keep information for as long as reasonably necessary to respond to inquiries, provide services, maintain business records, support customers, comply with legal and tax obligations, resolve disputes, prevent fraud, and improve operations.
            </p>
            <p className="mb-4">
              When information is no longer needed, we may delete, de-identify, aggregate, or securely retain it in backup or archival systems until deletion is practicable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. Security</h2>
            <p className="mb-4">
              We use reasonable administrative, technical, and physical safeguards designed to protect information. No website, network, transmission, or storage system is completely secure, so we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Children</h2>
            <p className="mb-4">
              Our website and services are intended for adults, homeowners, property managers, and business users. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, please contact us so we can take appropriate action.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">11. Your Privacy Choices</h2>
            <p className="mb-3">Depending on where you live, you may have rights to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Request access to personal information we maintain about you.</li>
              <li>Request correction or deletion of personal information.</li>
              <li>Opt out of targeted advertising, sale, or sharing where applicable.</li>
              <li>Request information about how we collect, use, disclose, or share personal information.</li>
              <li>Appeal a privacy request decision where required by law.</li>
            </ul>
            <p className="mb-4">
              To make a privacy request, contact us through the website or using the phone number below. We may need to verify your identity before responding.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">12. U.S. State Privacy Notice</h2>
            <p className="mb-4">
              For residents of states with privacy laws, the categories of personal information we may collect include identifiers, contact information, commercial information, internet or electronic network activity, approximate location, business or property information, inferences related to service interests, and communications with us.
            </p>
            <p className="mb-4">
              We collect this information from you, your device, website interactions, service providers, advertising and analytics providers, and business partners. We use it for the purposes described in this policy, including service delivery, communications, analytics, advertising, security, legal compliance, and business operations.
            </p>
            <p className="mb-4">
              We do not knowingly sell or share personal information of children under 16. We do not use sensitive personal information to infer characteristics.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">13. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. The updated version will be posted on this page with a new "Last updated" date. Continued use of the website or services after an update means the updated policy applies going forward.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">14. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or want to make a privacy request, contact InstallPros through the website or by phone:
            </p>
            <p className="mb-4">
              InstallPros<br />
              Website: <a href="https://installspros.com" className="text-primary hover:underline">https://installspros.com</a><br />
              Phone: <a href="tel:+15128070716" className="text-primary hover:underline">(512) 807-0716</a>
            </p>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Privacy;
