import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { brandAssets } from '../../data/brandAssets';

export const VisualSingaporeLaunch: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#E9E0D4]/30 border-y border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#DED7CE] shadow-soft-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left: Official Product Group & Pet Scene */}
          <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[480px] bg-white overflow-hidden">
            <img
              src={brandAssets.homepage.singaporeLaunchImage}
              alt="VETANIC Singapore Launch Lineup"
              className="w-full h-full object-cover object-[center_35%] lg:object-center"
              loading="lazy"
            />
          </div>

          {/* Right: Short Launch Copy & CTA */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>HELLO, SINGAPORE.</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal tracking-tight leading-tight">
              Launch prices available this September.
            </h2>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Shop the Launch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
