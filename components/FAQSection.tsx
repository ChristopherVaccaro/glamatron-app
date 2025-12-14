import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Glamatron?",
    answer: "Glamatron is a style transformation tool that lets you visualize new looks instantly. Whether you're male or female, you can upload a photo and experiment with different hairstyles, hair colors, makeup, accessories, and more—all without any commitment."
  },
  {
    question: "How do I use it?",
    answer: "Simply create a free account, upload a photo of yourself, then choose from our style options on the left panel. Select a hairstyle, hair color, makeup look, or accessories, then tap \"Generate\" to see your transformation. You can download or share your results!"
  },
  {
    question: "Can I save my transformations?",
    answer: "Yes! All your generated looks are automatically saved to your personal gallery. You can view your history anytime, mark favorites, download images, or share them directly from the gallery."
  },
  {
    question: "How much does it cost?",
    answer: "You get 5 free GlamCoins when you sign up—each generation uses 1 coin. Need more? Purchase additional GlamCoins anytime, and they never expire! Once you make your first purchase, you also unlock our full style library."
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-900 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">
            Everything you need to get started with Glamatron
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {/* Grid animation to prevent jumping */}
              <div
                className="grid transition-all duration-200"
                style={{ gridTemplateRows: openIndex === index ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-4 text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
