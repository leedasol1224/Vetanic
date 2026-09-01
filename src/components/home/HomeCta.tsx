import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { BRAND_CONTENT } from '../../data/content';

export const HomeCta: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-900 via-brand-800 to-[#183027] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto flex items-center justify-center text-xl">
          🐾
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          {BRAND_CONTENT.finalCta.title}
        </h2>

        <p className="text-base sm:text-lg text-brand-100 max-w-xl mx-auto font-normal">
          {BRAND_CONTENT.finalCta.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-50 text-brand-950 font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98]"
          >
            <span>{BRAND_CONTENT.finalCta.exploreButton}</span>
            <ArrowRight className="w-4 h-4 text-brand-800" />
          </Link>
          <Link
            to="/order"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-700/80 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-2xl border border-brand-500/40 shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-brand-200" />
            <span>{BRAND_CONTENT.finalCta.orderButton}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
