import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SEPTEMBER_2026_LAUNCH_PROMOTION, isLaunchPromoActive } from '../../config/promotions';

export const AnnouncementBar: React.FC = () => {
  if (!isLaunchPromoActive()) return null;

  return (
    <div className="bg-[#1b352c] text-[#f2f7f4] text-xs font-medium py-2.5 px-4 text-center border-b border-brand-800 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 font-bold text-brand-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Launch Special</span>
        </span>
        <span className="text-brand-100 hidden sm:inline">•</span>
        <span className="text-brand-100">
          {SEPTEMBER_2026_LAUNCH_PROMOTION.announcementText}
        </span>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 ml-1 transition-colors"
        >
          <span>Shop Offers</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
