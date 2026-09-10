import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { brandAssets } from '../data/brandAssets';

export const OrderSuccessPage: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const [copied, setCopied] = useState(false);

  const orderRef = reference || 'VET-2026-0001';

  const handleCopy = () => {
    navigator.clipboard.writeText(orderRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="flex-1 bg-[#FAF7F2] py-16 sm:py-24 font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-soft-in">
        
        {/* Success Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Header Text */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-charcoal tracking-tight">
            Thanks for your order! 🐾
          </h1>
          <p className="text-base sm:text-lg text-charcoal font-medium">
            We've received your VETANIC order request.
          </p>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto leading-relaxed">
            We'll check product availability and send you the confirmed order amount and payment instructions once your order has been reviewed.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DED7CE] shadow-soft space-y-5 max-w-md mx-auto">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">
              Order Reference
            </span>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-charcoal tracking-wide">
                {orderRef}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy order reference"
                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E9E0D4] text-charcoal transition-colors border border-[#DED7CE]"
                aria-label="Copy order reference"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-[10px] font-bold text-emerald-600">Copied to clipboard!</p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE]/80 text-[11px] text-charcoal-muted leading-relaxed">
            Please keep this reference number. You'll need it to check your order status in <strong>My Orders</strong>.
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              to={`/my-orders/${orderRef}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>View My Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#E9E0D4] text-charcoal font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl border border-[#DED7CE] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Help footer */}
        <div className="pt-4 text-xs text-charcoal-muted">
          <span>Questions? Reach out on Instagram </span>
          <a
            href={brandAssets.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-600 hover:underline"
          >
            {brandAssets.social.instagramHandle}
          </a>
        </div>

      </div>
    </main>
  );
};
