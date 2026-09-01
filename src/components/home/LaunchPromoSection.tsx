import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';
import { isLaunchPromoActive } from '../../config/promotions';

export const LaunchPromoSection: React.FC = () => {
  if (!isLaunchPromoActive()) return null;

  return (
    <section className="py-16 md:py-20 bg-[#E9E0D4]/40 border-b border-[#DED7CE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DED7CE] shadow-soft-lg space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>HELLO, SINGAPORE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
            Singapore Launch Special
          </h2>

          <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl mx-auto font-normal">
            To celebrate our Singapore launch, enjoy special September prices and Mix & Match savings on selected VETANIC products.
          </p>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <span>Shop Launch Offers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-6 border-t border-[#DED7CE]/70 flex items-center justify-center gap-2 text-xs text-charcoal-muted">
            <Gift className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>Free standard local delivery on all orders of SGD 50+</span>
          </div>
        </div>
      </div>
    </section>
  );
};
