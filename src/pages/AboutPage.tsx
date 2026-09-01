import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, Shield, Sun, CheckCircle2 } from 'lucide-react';
import { BRAND_CONTENT } from '../data/content';

export const AboutPage: React.FC = () => {
  const getPhilosophyIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'care':
        return <Heart className="w-6 h-6 text-brand-700" />;
      case 'wellness':
        return <Shield className="w-6 h-6 text-brand-700" />;
      case 'companionship':
        return <Sun className="w-6 h-6 text-brand-700" />;
      default:
        return <Sparkles className="w-6 h-6 text-brand-700" />;
    }
  };

  return (
    <main className="flex-1 bg-[#FAF8F5]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F5] py-16 md:py-24 border-b border-brand-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 text-brand-900 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Our Roots & Story</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal tracking-tight mb-4">
            {BRAND_CONTENT.about.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto">
            {BRAND_CONTENT.about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Section 1 — Brand Story */}
      <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-100 shadow-soft-lg space-y-6">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block">
            Chapter 01
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
            {BRAND_CONTENT.about.storyTitle}
          </h2>

          <div className="space-y-4 text-charcoal leading-relaxed font-normal text-base sm:text-lg">
            {BRAND_CONTENT.about.storyParagraphs.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-50/60">
              <CheckCircle2 className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-brand-900">Korean Heritage</h4>
                <p className="text-xs text-charcoal-muted mt-0.5">Developed in Korea with dedicated pet wellness expertise.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-50/60">
              <CheckCircle2 className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-brand-900">Singapore Debut</h4>
                <p className="text-xs text-charcoal-muted mt-0.5">Direct access for Singapore pet owners seeking authentic Korean formulas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — VETANIC × Nongshim Banryodaum Lineage Diagram */}
      <section className="py-16 bg-[#F5EFE6]/50 border-y border-brand-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block mb-2">
              Brand Lineage & Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
              {BRAND_CONTENT.about.relationship.title}
            </h2>
            <p className="text-sm text-charcoal-muted mt-2">
              {BRAND_CONTENT.about.relationship.subtitle}
            </p>
          </div>

          {/* Flow Hierarchy Diagram */}
          <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-4 max-w-3xl mx-auto">
            {BRAND_CONTENT.about.relationship.steps.map((step, index) => (
              <div
                key={index}
                className="flex-1 bg-white rounded-2xl p-6 border border-brand-200/80 shadow-card flex flex-col justify-between text-center relative"
              >
                <div className="mb-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold mb-3">
                    Stage 0{index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-charcoal">
                    {step.label}
                  </h3>
                  <div className="text-xs font-semibold text-brand-700 mt-1">
                    {step.role}
                  </div>
                </div>

                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-charcoal-muted italic max-w-xl mx-auto">
              VETANIC brings the same exacting standards and formulation heritage of Nongshim Banryodaum directly to international companion animal households.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — Brand Philosophy */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block mb-2">
            What Drives Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
            {BRAND_CONTENT.about.philosophyTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRAND_CONTENT.about.philosophy.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-7 border border-brand-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-5 text-brand-800">
                  {getPhilosophyIcon(item.title)}
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold text-brand-800 mb-3">
                  "{item.statement}"
                </p>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Products */}
        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-bold px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <span>Explore Our Singapore Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};
