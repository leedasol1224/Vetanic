import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Shield } from 'lucide-react';
import { SEPTEMBER_2026_LAUNCH_PROMOTION } from '../../config/promotions';

export const MixMatchSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-3 border border-brand-200">
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
          <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#DED7CE] shadow-card flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#DED7CE] flex items-center justify-center text-brand-600">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal">
                    Everyday Care
                  </h3>
                </div>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  Mix & Match
                </span>
              </div>

              <p className="text-xs text-charcoal-muted mb-6">
                Fresh Omega-3 Mini · Joint Support · Clear Eyes
              </p>

              {/* Bundle Savings Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED7CE]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#FAF7F2] text-charcoal text-xs font-bold flex items-center justify-center border border-[#DED7CE]">
                      1
                    </span>
                    <span className="text-xs font-bold text-charcoal">1 item</span>
                  </div>
                  <span className="text-sm font-bold text-charcoal font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED7CE] shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 text-xs font-bold flex items-center justify-center border border-brand-200">
                      2
                    </span>
                    <div>
                      <span className="text-xs font-bold text-charcoal">Any 2 items</span>
                      <span className="text-[10px] text-charcoal-muted block font-normal">Save on your pair</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-charcoal font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.bundle2Price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-brand-600 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <span className="text-xs font-bold text-charcoal">Any 3 items</span>
                      <span className="text-[10px] text-brand-600 block font-semibold">Best Value Routine</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-brand-600 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.bundle3Price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#DED7CE]">
              <Link
                to="/products"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-50 text-brand-600 font-bold text-xs py-3 px-4 rounded-xl border border-brand-600 transition-colors"
              >
                <span>Shop Everyday Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Wellness Support Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#DED7CE] shadow-card flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#DED7CE] flex items-center justify-center text-sage-600">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal">
                    Wellness Support
                  </h3>
                </div>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  Mix & Match
                </span>
              </div>

              <p className="text-xs text-charcoal-muted mb-6">
                Probiotics · Hairball Care · Urena Clear · Premium Omega-3 · Dental Chew
              </p>

              {/* Bundle Savings Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED7CE]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#FAF7F2] text-charcoal text-xs font-bold flex items-center justify-center border border-[#DED7CE]">
                      1
                    </span>
                    <span className="text-xs font-bold text-charcoal">1 item</span>
                  </div>
                  <span className="text-sm font-bold text-charcoal font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#DED7CE] shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 text-xs font-bold flex items-center justify-center border border-brand-200">
                      2
                    </span>
                    <div>
                      <span className="text-xs font-bold text-charcoal">Any 2 items</span>
                      <span className="text-[10px] text-charcoal-muted block font-normal">Save on your pair</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-charcoal font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.bundle2Price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-brand-600 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <span className="text-xs font-bold text-charcoal">Any 3 items</span>
                      <span className="text-[10px] text-brand-600 block font-semibold">Best Value Routine</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-brand-600 font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.bundle3Price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#DED7CE]">
              <Link
                to="/products"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-50 text-brand-600 font-bold text-xs py-3 px-4 rounded-xl border border-brand-600 transition-colors"
              >
                <span>Shop Wellness Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Big CTA */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <span>Build Your Bundle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
