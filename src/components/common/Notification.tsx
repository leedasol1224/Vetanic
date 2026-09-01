import React, { useEffect } from 'react';
import { Check, ArrowRight, X } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

export const AddedNotification: React.FC = () => {
  const { showAddedToast, dismissToast, lastAddedProduct, totalItemCount } = useOrder();

  useEffect(() => {
    if (showAddedToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAddedToast, dismissToast]);

  if (!showAddedToast || !lastAddedProduct) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-soft-lg border border-brand-200 p-4 animate-soft-in">
      <div className="flex items-start justify-between gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 flex-shrink-0">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-xs font-bold text-brand-800 uppercase tracking-wider">
            <span>Added to your order</span>
          </div>
          <p className="text-sm font-semibold text-charcoal truncate mt-0.5">
            {lastAddedProduct.product.name}
          </p>
          <p className="text-xs text-charcoal-muted">
            Qty: {lastAddedProduct.quantity} • Total items in order: {totalItemCount}
          </p>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={dismissToast}
              className="text-xs font-medium text-charcoal-muted hover:text-charcoal px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Continue Shopping
            </button>
            <Link
              to="/order"
              onClick={dismissToast}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white px-3 py-1.5 rounded-lg transition-colors ml-auto shadow-sm"
            >
              View Order
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        <button
          onClick={dismissToast}
          className="text-gray-400 hover:text-gray-600 p-1 -mr-1 -mt-1 rounded-lg"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
