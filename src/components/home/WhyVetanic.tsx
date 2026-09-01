import React from 'react';
import { HeartHandshake, Sparkles, ShieldCheck, Sun } from 'lucide-react';
import { BRAND_CONTENT } from '../../data/content';

export const WhyVetanic: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-brand-700" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-brand-700" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-brand-700" />;
      case 'Sun':
        return <Sun className="w-6 h-6 text-brand-700" />;
      default:
        return <Sparkles className="w-6 h-6 text-brand-700" />;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block mb-2">
            The VETANIC Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
            Why VETANIC
          </h2>
          <p className="text-sm text-charcoal-muted mt-3">
            Grounded in Korean pet care expertise, formulated for gentle daily wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_CONTENT.values.map((val) => (
            <div
              key={val.id}
              className="bg-white rounded-2xl p-6 border border-brand-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 text-brand-800">
                  {getIcon(val.icon)}
                </div>
                <h3 className="text-base font-bold text-charcoal mb-2">
                  {val.title}
                </h3>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {val.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
