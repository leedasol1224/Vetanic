import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SEPTEMBER_2026_LAUNCH_PROMOTION, isLaunchPromoActive } from '../../config/promotions';

export const AnnouncementBar: React.FC = () => {
  if (!isLaunchPromoActive()) return null;

  return (
    <div className="bg-[#E9E0D4] text-charcoal text-xs font-medium py-2.5 px-4 text-center border-b border-[#DED7CE] relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 font-bold text-brand-600">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Launch Special</span>
        </span>
        <span className="text-[#6F6A65] hidden sm:inline">•</span>
        <span className="text-charcoal font-normal">
          {SEPTEMBER_2026_LAUNCH_PROMOTION.announcementText}
        </span>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2 ml-1 transition-colors"
        >
          <span>Shop Offers</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
