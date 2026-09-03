import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const GENERAL_FAQS: FaqItem[] = [
  {
    q: 'What is the recommended starting age for VETANIC supplements?',
    a: 'VETANIC supplements are formulated for dogs and cats aged 3 months and above (post-weaning). For young puppies and kittens under 3 months, consult your veterinarian.'
  },
  {
    q: 'Can I feed multiple VETANIC supplements together?',
    a: 'Yes. VETANIC formulas are designed to complement each other as part of a daily pet wellness routine (for example, pairing Fresh Omega-3 with Probiotics). Always follow the recommended daily dosage based on your companion’s body weight.'
  },
  {
    q: 'How long should my companion take VETANIC supplements?',
    a: 'VETANIC products provide gentle, daily nutritional support. For best results, consistent daily supplementation over 4 to 8 weeks is recommended as part of their everyday routine.'
  },
  {
    q: 'Should supplements be given before or after meals?',
    a: 'Most VETANIC supplements are best served mixed directly into regular dry or wet meals, or given directly after feeding for optimal absorption and palatability.'
  },
  {
    q: 'How should I store VETANIC products in Singapore’s climate?',
    a: 'Store in a cool, dry place away from direct sunlight, humidity, and heat sources. Reseal pouches and container lids tightly after each use. Probiotics may optionally be refrigerated to preserve live culture counts in warm weather.'
  },
  {
    q: 'Can my pet take VETANIC if they have an existing medical condition or take medication?',
    a: 'VETANIC products are nutritional wellness supplements, not veterinary medicines. If your pet has a diagnosed medical condition, is pregnant, nursing, scheduled for surgery, or taking prescription medications, please consult your veterinarian before use.'
  },
  {
    q: 'Are VETANIC products suitable for pets with food allergies?',
    a: 'Each VETANIC product features a clear ingredient declaration on its product page. Please check individual ingredient lists for known sensitivities (such as marine fish in Omega-3 or green-lipped mussel in Joint Support) before introducing.'
  }
];

export const GeneralFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white rounded-3xl border border-[#DED7CE] p-6 sm:p-10 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 flex-shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-charcoal tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-charcoal-muted">
            General guidance on VETANIC wellness supplementation and daily routines
          </p>
        </div>
      </div>

      <div className="divide-y divide-[#DED7CE]/70">
        {GENERAL_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-left gap-4 group"
              >
                <span className="text-sm font-bold text-charcoal group-hover:text-brand-600 transition-colors">
                  {faq.q}
                </span>
                <span className="p-1 rounded-lg bg-[#FAF7F2] text-charcoal-muted group-hover:text-brand-600 flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-charcoal-muted leading-relaxed pr-6 animate-soft-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
