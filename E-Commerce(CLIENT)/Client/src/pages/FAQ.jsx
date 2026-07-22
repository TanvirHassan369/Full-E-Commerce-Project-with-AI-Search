import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    { question: "How do I place an order?",          answer: "Simply browse our products, add items to your cart, and proceed to checkout. Follow the prompts to complete your order." },
    { question: "What payment methods do you accept?", answer: "We accept online payments via SSLCommerz (credit/debit cards, mobile banking) and Cash on Delivery (COD)." },
    { question: "How long does shipping take?",       answer: "Standard shipping takes 3-5 business days. Express shipping options are available at checkout." },
    { question: "What is your return policy?",        answer: "We offer a 7-day return policy for delivered orders. Items must be in original condition. You can submit a return request from your Orders page within 7 days of delivery." },
    { question: "Is my payment information secure?",  answer: "Yes. We use industry-standard SSL encryption and never store your full card details on our servers." },
    { question: "Can I track my order?",              answer: "Absolutely. Once your order ships you'll receive a tracking link via email so you can follow it in real time." },
  ];

  const toggleItem = (index) => setOpenItems((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3">Support</p>
          <h1 className="text-4xl font-bold text-foreground mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions about Daily Bazar.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                openItems[index]
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-secondary/40 hover:border-border"
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
              >
                <h3 className="font-semibold text-foreground text-sm">{faq.question}</h3>
                <ChevronDown
                  className={`w-4 h-4 text-primary shrink-0 transition-transform duration-200 ${
                    openItems[index] ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openItems[index] && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
