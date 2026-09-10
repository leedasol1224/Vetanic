import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  AlertCircle
} from 'lucide-react';
import { InstagramIcon } from '../components/common/Icons';
import { lookupGuestOrder, isGuestSessionVerified, CustomerOrderView, sanitizeToCustomerOrder } from '../lib/guestOrderLookup';
import { CUSTOMER_STATUS_STAGES } from '../lib/orderStatus';
import { PRODUCTS } from '../data/products';
import { brandAssets } from '../data/brandAssets';
import { getOrderById } from '../lib/storage';
import { fetchOrderByIdFromDb } from '../lib/supabase';

export const MyOrdersPage: React.FC = () => {
  const { reference } = useParams<{ reference?: string }>();
  const navigate = useNavigate();

  const [orderRefInput, setOrderRefInput] = useState(reference || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<CustomerOrderView | null>(null);

  // Auto-verify if already authenticated in this session or coming directly from order success
  useEffect(() => {
    let isMounted = true;
    if (reference) {
      setOrderRefInput(reference);
      if (isGuestSessionVerified(reference)) {
        // Fast-track load from storage or Supabase
        const raw = getOrderById(reference);
        if (raw) {
          setOrderData(sanitizeToCustomerOrder(raw));
        } else {
          fetchOrderByIdFromDb(reference).then((dbOrder) => {
            if (isMounted && dbOrder) {
              setOrderData(sanitizeToCustomerOrder(dbOrder));
            }
          });
        }
      }
    }
    return () => {
      isMounted = false;
    };
  }, [reference]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!orderRefInput.trim() || !phoneInput.trim()) {
      setErrorMessage('Please enter both your Order Reference and Mobile Number.');
      return;
    }

    setIsSubmitting(true);
    const result = await lookupGuestOrder(orderRefInput, phoneInput);
    setIsSubmitting(false);

    if (result.success && result.order) {
      setOrderData(result.order);
      navigate(`/my-orders/${result.order.orderReference}`, { replace: true });
    } else {
      setErrorMessage(result.error || "We couldn't find an order matching those details. Please check your information and try again.");
    }
  };

  const handleReset = () => {
    setOrderData(null);
    setOrderRefInput('');
    setPhoneInput('');
    setErrorMessage(null);
    navigate('/my-orders', { replace: true });
  };

  const getProductImage = (productId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    return prod ? prod.imageUrl : '/images/products/fresh-omega-3-mini.png';
  };

  return (
    <main className="flex-1 bg-[#FAF7F2] py-12 sm:py-20 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* State A: Search / Lookup Form */}
        {!orderData ? (
          <div className="max-w-md mx-auto space-y-8 animate-soft-in">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-200">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Guest Order Tracking</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
                Track My Order
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                Enter your order reference and the mobile number used during checkout to check your order status.
              </p>
            </div>

            {/* Lookup Card */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#DED7CE] shadow-soft space-y-6">
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs animate-soft-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLookup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Order Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={orderRefInput}
                    onChange={(e) => setOrderRefInput(e.target.value)}
                    placeholder="e.g. VET-2026-0048"
                    className="w-full px-4 py-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs sm:text-sm font-mono font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600 uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 9123 4567 or +65 9123 4567"
                    className="w-full px-4 py-3 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs sm:text-sm font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-sm transition-all cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>View My Order</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-[#DED7CE]/80 text-[11px] text-charcoal-muted text-center space-y-1">
                <p>No account or password required.</p>
                <p>Your order reference was provided upon submitting your order request.</p>
              </div>
            </div>
          </div>
        ) : (
          /* State B: Active Order Progress & Details View */
          <div className="space-y-8 animate-soft-in">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DED7CE]">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-muted hover:text-brand-600 transition-colors p-2 rounded-xl hover:bg-[#E9E0D4]/40 self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Track Another Order</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-muted font-medium">
                  Verified as {orderData.customerName} ({orderData.customerMobileMasked})
                </span>
              </div>
            </div>

            {/* Order Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DED7CE] shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DED7CE]/70">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal tracking-tight">
                      Order #{orderData.orderReference}
                    </h1>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Submitted on {new Date(orderData.createdAt).toLocaleDateString('en-SG', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${orderData.statusInfo.badgeClass}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>{orderData.statusInfo.customerStatus}</span>
                  <span className="text-[10px] font-normal opacity-80">({orderData.statusInfo.koreanMeaning})</span>
                </span>
              </div>

              {/* 4-Stage Visual Progress Tracker */}
              {orderData.statusInfo.stepIndex > 0 && (
                <div className="py-4 space-y-6">
                  <div className="relative">
                    {/* Background track line */}
                    <div className="hidden sm:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-[#E9E0D4] z-0" />
                    
                    {/* Active progress bar line */}
                    <div 
                      className="hidden sm:block absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 z-0"
                      style={{
                        width: `${Math.max(0, ((orderData.statusInfo.stepIndex - 1) / (CUSTOMER_STATUS_STAGES.length - 1)) * 100)}%`
                      }}
                    />

                    {/* Step Nodes */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
                      {CUSTOMER_STATUS_STAGES.map((stage) => {
                        const isPast = stage.step < orderData.statusInfo.stepIndex;
                        const isCurrent = stage.step === orderData.statusInfo.stepIndex;

                        return (
                          <div 
                            key={stage.key} 
                            className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                          >
                            <div 
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                                isCurrent
                                  ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-sm'
                                  : isPast
                                  ? 'bg-brand-600 text-white'
                                  : 'bg-white text-charcoal-muted border-2 border-[#DED7CE]'
                              }`}
                            >
                              {isPast ? <CheckCircle2 className="w-5 h-5" /> : stage.step}
                            </div>

                            <div>
                              <div className={`text-xs font-bold ${isCurrent ? 'text-brand-600' : isPast ? 'text-charcoal' : 'text-charcoal-muted'}`}>
                                {stage.label}
                              </div>
                              <div className="text-[10px] text-charcoal-muted">
                                {stage.korean}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* "What's Next" Guidance Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-charcoal uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Current Status & Next Steps</span>
                </div>
                <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-medium">
                  {orderData.statusInfo.whatsNext}
                </p>
              </div>
            </div>

            {/* Ordered Products Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DED7CE] shadow-soft space-y-6">
              <h2 className="text-lg font-serif font-bold text-charcoal">
                Order Items ({orderData.items.reduce((s, i) => s + i.quantity, 0)} units)
              </h2>

              <div className="divide-y divide-[#DED7CE]/70">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={getProductImage(item.productId)}
                        alt={item.productName}
                        className="w-14 h-14 object-contain rounded-xl bg-[#FAF7F2] border border-[#DED7CE] p-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-charcoal truncate">
                          {item.productName}
                        </h4>
                        <div className="text-[11px] text-charcoal-muted mt-0.5">
                          {item.packageSize} • Unit Price: SGD {item.unitPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-charcoal-muted">
                        Qty: <strong className="text-charcoal">{item.quantity}</strong>
                      </div>
                      <div className="text-sm font-bold text-charcoal font-serif mt-0.5">
                        SGD {(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial & Delivery Summary */}
              {orderData.pricing && (
                <div className="pt-6 border-t border-[#DED7CE] space-y-2.5 text-xs text-charcoal">
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Subtotal (Regular):</span>
                    <span>SGD {orderData.pricing.subtotal.toFixed(2)}</span>
                  </div>

                  {orderData.pricing.bundleDiscount > 0 && (
                    <div className="flex justify-between text-brand-600 font-semibold">
                      <span>Mix & Match Savings:</span>
                      <span>- SGD {orderData.pricing.bundleDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Delivery Method:</span>
                    <span className="font-semibold">{orderData.deliveryMethod}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Delivery Fee:</span>
                    <span>
                      {orderData.pricing.deliveryFee === 0 ? 'FREE' : `SGD ${orderData.pricing.deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between font-serif font-bold text-base pt-3 border-t border-[#DED7CE] text-charcoal">
                    <span>Estimated Total:</span>
                    <span className="text-brand-600">SGD {orderData.pricing.estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Need Help CTA */}
            <div className="bg-white rounded-3xl p-6 border border-[#DED7CE] text-center space-y-3">
              <p className="text-xs text-charcoal-muted">
                Need to amend your order or have questions about delivery?
              </p>
              <a
                href={brandAssets.social.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2.5 rounded-xl border border-brand-200 transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-brand-600" />
                <span>Message us on Instagram {brandAssets.social.instagramHandle}</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};
