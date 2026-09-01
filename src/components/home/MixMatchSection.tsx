import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Shield } from 'lucide-react';
import { SEPTEMBER_2026_LAUNCH_PROMOTION } from '../../config/promotions';

export const MixMatchSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-bold uppercase tracking-wider mb-3 border border-brand-100">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Launch Bundle Offers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-charcoal tracking-tight mb-3">
            Mix, match & save
          </h2>

          <p className="text-sm text-charcoal-muted max-w-lg mx-auto">
            Choose any combination within each collection. Bundle discounts apply automatically at checkout with no promo codes needed.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Everyday Care Card */}
          <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-brand-200/90 shadow-card flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal">
                    Everyday Care
                  </h3>
                </div>
                <span className="text-xs font-bold text-brand-800 bg-brand-100 px-3 py-1 rounded-full">
                  Mix & Match
                </span>
              </div>

              <p className="text-xs text-charcoal-muted mb-6">
                Fresh Omega-3 Mini · Joint Support · Clear Eyes
              </p>

              {/* Bundle Savings Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-brand-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-800 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-bold text-charcoal">1 item</span>
                  </div>
                  <span className="text-sm font-bold text-brand-900 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-brand-200 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <span className="text-xs font-bold text-charcoal">Any 2 items</span>
                      <span className="text-[10px] text-brand-700 block font-medium">Save on your pair</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-brand-900 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.bundle2Price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-800 text-white shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white">Any 3 items</span>
                      <span className="text-[10px] text-amber-300 block font-medium">Best Value Routine</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-300 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.bundle3Price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-200/60">
              <Link
                to="/products"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-50 text-brand-950 font-bold text-xs py-3 px-4 rounded-xl border border-brand-300 transition-colors"
              >
                <span>Shop Everyday Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Wellness Support Card */}
          <div className="bg-[#FAF8F5] rounded-3xl p-8 border border-brand-200/90 shadow-card flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal">
                    Wellness Support
                  </h3>
                </div>
                <span className="text-xs font-bold text-brand-800 bg-brand-100 px-3 py-1 rounded-full">
                  Mix & Match
                </span>
              </div>

              <p className="text-xs text-charcoal-muted mb-6">
                Probiotics · Hairball Care · Urena Clear · Premium Omega-3 · Dental Chew
              </p>

              {/* Bundle Savings Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-brand-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-800 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-bold text-charcoal">1 item</span>
                  </div>
                  <span className="text-sm font-bold text-brand-900 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-brand-200 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <span className="text-xs font-bold text-charcoal">Any 2 items</span>
                      <span className="text-[10px] text-brand-700 block font-medium">Save on your pair</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-brand-900 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.bundle2Price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-800 text-white shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white">Any 3 items</span>
                      <span className="text-[10px] text-amber-300 block font-medium">Best Value Routine</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-300 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.bundle3Price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-200/60">
              <Link
                to="/products"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-50 text-brand-950 font-bold text-xs py-3 px-4 rounded-xl border border-brand-300 transition-colors"
              >
                <span>Shop Wellness Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Big CTA */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Build Your Bundle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
