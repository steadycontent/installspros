import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What if I haven't received my Starlink kit yet?",
    answer: "No problem—we can help you order one or schedule installation once it arrives.",
  },
  {
    question: "Do you install on roofs, barns, or poles?",
    answer: "Yes! We've handled all kinds of setups—flat roofs, metal barns, custom poles—you name it.",
  },
  {
    question: "Can I get help with Wi-Fi inside my home too?",
    answer: "Absolutely. We offer Ubiquiti mesh routers, signal calibration, and smart home add-ons.",
  },
  {
    question: "How much does Starlink installation cost?",
    answer: "Our full install is $899, including dish mounting, cable routing, and router setup. You just pay $300 upfront to book. (If your home needs extra troubleshooting, we'll let you know first.)",
  },
  {
    question: "How long does the installation take?",
    answer: "Usually 1–3 hours, depending on your home. After setup, it can take up to 12 hours for Starlink to fully optimize and connect with the satellites—it's normal, and we'll explain everything before we go.",
  },
  {
    question: "Does Starlink come with a router?",
    answer: "Yes! The Starlink kit includes a Wi-Fi router, cables, and everything needed to get you online. You don't need to buy anything extra (unless you want upgrades like a mesh system—we offer that too).",
  },
  {
    question: "What happens after installation?",
    answer: "We stay in touch via SMS. Need help? Want to return unused gear? It's all handled through our support chat.",
  },
];

const FAQSection = () => {
  return (
    <section className="section section-light">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Got questions? We've got answers.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-2xl px-6 shadow-card border-none"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
