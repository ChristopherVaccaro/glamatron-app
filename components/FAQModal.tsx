import React, { useState, useEffect, useRef } from 'react';
import { X, HelpCircle, ChevronDown } from 'lucide-react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key and focus management
  useEffect(() => {
    if (!isOpen) return;
    
    previousActiveElement.current = document.activeElement as HTMLElement;
    modalRef.current?.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose]);

  const faqItems: FAQItem[] = [
    {
      question: "How much does each transformation cost?",
      answer: "Each transformation costs 1 GlamCoin, regardless of how many styles you choose. Whether you select one style or combine multiple looks, it's always 1 GlamCoin per transformation.",
    },
    {
      question: "What image quality works best?",
      answer: "For the best results, use high-resolution photos with good lighting. Clear, well-lit selfies or portraits work great. Avoid blurry, dark, or heavily filtered images as they may affect the quality of your transformation.",
    },
    {
      question: "Can I combine multiple styles in one transformation?",
      answer: "Absolutely! Feel free to mix and match styles across different categories — hair, makeup, accessories, and more. Experimenting with combinations often creates the most unique and stunning results.",
    },
    {
      question: "How many styles should I select?",
      answer: "We recommend selecting 3-6 styles per transformation for optimal results. Too few styles may result in subtle changes, while too many might create unexpected combinations. Start with a moderate number and adjust based on your preferences.",
    },
    {
      question: "Why did my transformation fail?",
      answer: "Transformations may fail if the image doesn't meet our content guidelines or if there are technical issues. Common reasons include: low image quality, no clear face detected, or content that violates our terms.",
    },
    {
      question: "What content is not allowed?",
      answer: "Our AI model is designed for tasteful beauty transformations. Overly explicit or inappropriate images will likely fail processing. Standard selfies and portrait photos work best.",
    },
    {
      question: "How do I get more GlamCoins?",
      answer: "You can purchase GlamCoin packs from the coin balance area in the header. We offer various pack sizes to suit your needs. Your first purchase also unlocks the full style library!",
    },
  ];

  const tips = [
    "Use natural lighting for clearer facial features",
    "Face the camera directly for best style application",
    "Remove glasses if you want to try eyewear styles",
    "Tie back hair if you want to see dramatic hair transformations",
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-modal-title"
        tabIndex={-1}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div>
              <h2 id="faq-modal-title" className="text-xl font-bold text-slate-900">Help & FAQ</h2>
              <p className="text-sm text-slate-500">Tips for the best transformations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Quick Tips Section */}
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Tips for Best Results</h3>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-slate-400 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-lg mb-4">Frequently Asked Questions</h3>
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-slate-50 transition-colors"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-slate-900 pr-4">{item.question}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {/* Fixed height answer container to prevent modal shifting */}
                <div 
                  className="grid transition-all duration-200"
                  style={{ gridTemplateRows: openIndex === index ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div 
                      id={`faq-answer-${index}`}
                      className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100"
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-8 p-4 bg-slate-800 rounded-xl text-center">
            <p className="text-sm text-slate-300">
              Still have questions? Reach out to us at{' '}
              <a href="mailto:support@glamatron.app" className="text-white font-medium hover:underline">
                support@glamatron.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQModal;
