import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Gift, CheckCircle2 } from 'lucide-react';
import { SEPTEMBER_2026_LAUNCH_PROMOTION, isLaunchPromoActive } from '../../config/promotions';
import { BRAND_CONTENT } from '../../data/content';

export const LaunchPromoSection: React.FC = () => {
  if (!isLaunchPromoActive()) return null;

  return (
    <section className="py-16 md:py-20 bg-[#E9E0D4]/60 border-b border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DED7CE] shadow-soft-lg relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{BRAND_CONTENT.launch.label}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-charcoal tracking-tight">
              {BRAND_CONTENT.launch.title}
            </h2>

            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-normal">
              {BRAND_CONTENT.launch.body}
            </p>
          </div>

          {/* Merchandising Collections Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10 relative z-10">
            {/* Everyday Care Collection */}
            <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#DED7CE] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-charcoal text-[11px] font-bold uppercase tracking-wider border border-[#DED7CE]">
                    Everyday Care
                  </span>
                  <span className="text-xs font-bold text-brand-600">
                    Mix & Match
                  </span>
                </div>

                <h3 className="text-base font-bold text-charcoal mb-1">
                  Fresh Omega-3 Mini · Joint Support · Clear Eyes
                </h3>

                <div className="flex items-baseline gap-2 mt-3 mb-4">
                  <span className="text-2xl font-bold text-charcoal font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-charcoal-muted line-through">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.regularPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                    Launch Price
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#DED7CE]/70 text-xs text-charcoal">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 flex-shrink-0" />
                    <span><strong>Any 2 Everyday Care:</strong> SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.bundle2Price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 flex-shrink-0" />
                    <span><strong>Any 3 Everyday Care:</strong> SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.bundle3Price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wellness Support Collection */}
            <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#DED7CE] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-charcoal text-[11px] font-bold uppercase tracking-wider border border-[#DED7CE]">
                    Wellness Support
                  </span>
                  <span className="text-xs font-bold text-brand-600">
                    Mix & Match
                  </span>
                </div>

                <h3 className="text-base font-bold text-charcoal mb-1">
                  Probiotics · Hairball · Urena · Premium Omega-3 · Dental
                </h3>

                <div className="flex items-baseline gap-2 mt-3 mb-4">
                  <span className="text-2xl font-bold text-charcoal font-serif">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-charcoal-muted line-through">
                    SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                    Launch Price
                  </span>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#DED7CE]/70 text-xs text-charcoal">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 flex-shrink-0" />
                    <span><strong>Any 2 Wellness Support:</strong> SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.bundle2Price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 flex-shrink-0" />
                    <span><strong>Any 3 Wellness Support:</strong> SGD {SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.bundle3Price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & CTA banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#DED7CE]/70 max-w-4xl mx-auto relative z-10">
            <div className="flex items-center gap-3 text-xs text-charcoal-muted">
              <Gift className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span>
                <strong>Free Standard Local Delivery</strong> on all orders of SGD 50.00 and above.
              </span>
            </div>

            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-all"
            >
              <span>{BRAND_CONTENT.launch.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
