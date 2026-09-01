import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { BRAND_CONTENT } from '../../data/content';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5EFE6]/60 to-[#FAF8F5] py-12 md:py-20 lg:py-24 border-b border-brand-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Origin & Trust pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Korean Pet Wellness • Now Available in Singapore</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-charcoal tracking-tight leading-[1.15]">
              Wellness Made for Their Everyday.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-charcoal-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {BRAND_CONTENT.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-50 text-brand-900 font-semibold px-7 py-3.5 rounded-2xl border border-brand-200 shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-brand-700" />
                <span>Order Now</span>
              </Link>
            </div>

            {/* Value mini tags */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-brand-200/60 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>Made in Korea</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>Dogs & Cats</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>Direct Local Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background blob */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-200 to-amber-100/60 rounded-3xl transform rotate-2 blur-sm -z-10 opacity-70" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-soft-lg border-4 border-white aspect-[4/5] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                  alt="Happy companion pet"
                  className="w-full h-full object-cover object-center"
                />

                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-brand-100 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800 font-bold text-lg flex-shrink-0">
                      🌿
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-950 uppercase tracking-wider">
                        VETANIC Singapore
                      </div>
                      <div className="text-xs text-charcoal-muted">
                        International brand of Nongshim Banryodaum
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
