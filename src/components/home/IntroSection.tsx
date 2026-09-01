import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Layers, Sparkles } from 'lucide-react';
import { BRAND_CONTENT } from '../../data/content';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-brand-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-100">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Brand Introduction</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight mb-6">
          {BRAND_CONTENT.intro.title}
        </h2>

        <p className="text-base sm:text-lg text-charcoal leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
          {BRAND_CONTENT.intro.body}
        </p>

        {/* Visual lineage flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10 text-left">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-100 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800 flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-900">Nongshim Banryodaum</div>
              <div className="text-xs text-charcoal-muted mt-0.5">Korean pet wellness brand</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-100 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-900">VETANIC</div>
              <div className="text-xs text-charcoal-muted mt-0.5">International brand</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-brand-100 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800 flex-shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-900">Singapore</div>
              <div className="text-xs text-charcoal-muted mt-0.5">Direct ordering & support</div>
            </div>
          </div>
        </div>

        <div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-brand-800 hover:text-brand-950 font-bold text-sm bg-brand-50 hover:bg-brand-100 border border-brand-200 px-6 py-3 rounded-full transition-all group"
          >
            <span>{BRAND_CONTENT.intro.buttonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
