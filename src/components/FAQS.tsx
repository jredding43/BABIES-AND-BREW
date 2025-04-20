// src/components/FAQs.tsx
import React, { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const faqData: FAQ[] = [
  {
    question: "What is Babies and Brew?",
    answer: "Babies and Brew is a family-friendly event combining coffee, drinks, and a community atmosphere where parents can relax while kids play.",
  },
  {
    question: "Where are events held?",
    answer: "Events are hosted at rotating local breweries and community spaces. Check our upcoming events section for locations and times.",
  },
  {
    question: "Do I need a ticket to attend?",
    answer: "Most events are free and open to the public, but some may require registration. Follow us on social media for details.",
  },
  {
    question: "Are kids allowed at all events?",
    answer: "Yes! Our events are specifically designed to be safe and fun for kids of all ages.",
  },
  {
    question: "Is food or drink available?",
    answer: "Yes! Each venue will have options for coffee, snacks, and sometimes food trucks or local vendors.",
  },
];

const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 border-0 rounded-2xl bg-orange-50">
      <span
            style={{ fontFamily: '"Rock 3D", cursive' }}
            className="text-5xl md:text-4xl text-orange-400 tracking-tighter font-extrabold p-4">Frequently Asked Questions
      </span>

      <div className="space-y-4 mt-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border rounded shadow-sm">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left text-orange-600 p-4 font-semi bg-gray-100 hover:bg-orange-200 rounded"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="p-4 text-orange-400 font-semibold bg-orange-50 border-t">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
