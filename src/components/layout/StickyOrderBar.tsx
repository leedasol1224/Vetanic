import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';

export const StickyOrderBar: React.FC = () => {
  const { totalItemCount, pricingSummary, openCartDrawer } = useOrder();
  const location = useLocation();

  // Hide on order page or admin pages or when 0 items
  if (location.pathname === '/order' || location.pathname.startsWith('/admin') || totalItemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-[#DED7CE] md:hidden shadow-lg animate-soft-in">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-charcoal">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in order
            </div>
            <div className="text-[11px] text-brand-600 font-bold">
              Est. SGD {pricingSummary.estimatedTotal.toFixed(2)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCartDrawer}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <span>View Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
