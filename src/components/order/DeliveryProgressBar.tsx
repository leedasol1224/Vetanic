import React from 'react';
import { Truck, Sparkles } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { Link } from 'react-router-dom';

export const DeliveryProgressBar: React.FC = () => {
  const { pricingSummary, deliveryMethod } = useOrder();

  if (deliveryMethod === 'self_collection') {
    return null;
  }

  const { productTotal, isFreeDeliveryUnlocked, freeDeliveryThresholdDelta, upsellMessages } = pricingSummary;
  const progressPercent = Math.min(100, Math.round((productTotal / 50.00) * 100));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-100 shadow-sm space-y-3.5 animate-soft-in">
      {/* Progress Bar & Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal">
            <Truck className="w-4 h-4 text-brand-700" />
            <span>
              {isFreeDeliveryUnlocked ? (
                <span className="text-brand-800">You've unlocked free local delivery!</span>
              ) : (
                <span>
                  Add <strong className="text-brand-900 font-bold">SGD {freeDeliveryThresholdDelta.toFixed(2)}</strong> more to enjoy free local delivery.
                </span>
              )}
            </span>
          </div>

          <span className="text-[11px] font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
            {progressPercent}%
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFreeDeliveryUnlocked ? 'bg-brand-600' : 'bg-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mix & Match Upsell Alerts */}
      {upsellMessages.length > 0 && (
        <div className="pt-2 border-t border-gray-100 space-y-2">
          {upsellMessages.map((msg, idx) => (
            <div
              key={idx}
              className="p-3 bg-brand-50/80 rounded-xl border border-brand-200/70 text-xs text-brand-950 flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{msg}</span>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-800 hover:text-brand-950 underline underline-offset-2 flex-shrink-0"
              >
                <span>Browse</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
