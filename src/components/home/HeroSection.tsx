import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { BRAND_CONTENT } from '../../data/content';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE7]/50 to-[#FAF7F2] py-14 md:py-20 lg:py-24 border-b border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small Brand Relationship Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DED7CE] text-charcoal text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{BRAND_CONTENT.smallBrandRelationship}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-charcoal tracking-tight leading-[1.15]">
              {BRAND_CONTENT.heroHeadline}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-charcoal-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {BRAND_CONTENT.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {/* Primary CTA */}
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary CTA */}
              <Link
                to="/order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-brand-50 text-brand-600 font-semibold px-7 py-3.5 rounded-2xl border-2 border-brand-600 shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-brand-600" />
                <span>Order Now</span>
              </Link>
            </div>

            {/* Value tags & Free Delivery Highlight */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#DED7CE] max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal">
                <Truck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>Free local delivery on SGD 50+</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal">
                <ShieldCheck className="w-4 h-4 text-sage-600 flex-shrink-0" />
                <span>Made in Korea</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal">
                <ShieldCheck className="w-4 h-4 text-sage-600 flex-shrink-0" />
                <span>Gentle Everyday Care</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-[#E9E0D4] rounded-3xl transform rotate-2 blur-sm -z-10 opacity-60" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-soft-lg border-4 border-white aspect-[4/5] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                  alt="Companion dog and cat wellness"
                  className="w-full h-full object-cover object-center"
                />

                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#DED7CE] shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg flex-shrink-0">
                      🌿
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal uppercase tracking-wider">
                        VETANIC Singapore
                      </div>
                      <div className="text-xs text-charcoal-muted">
                        An international brand of Nongshim Banryodaum
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
