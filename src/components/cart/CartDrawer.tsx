import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { getProductPricing } from '../../lib/pricing';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    items,
    totalItemCount,
    updateQuantity,
    removeFromOrder,
    pricingSummary
  } = useOrder();

  const navigate = useNavigate();

  // Close on Escape key or prevent background scroll
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeCartDrawer();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const handleReviewOrder = () => {
    closeCartDrawer();
    navigate('/order');
  };

  const progressPercent = Math.min(100, Math.round((pricingSummary.productTotal / 50.00) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-soft-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#DED7CE]">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#DED7CE] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-charcoal">
                  Your Order
                </h2>
                <span className="text-xs text-charcoal-muted font-medium">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-[#E9E0D4] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-[#FAF7F2]/70 border-b border-[#DED7CE]/80 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-charcoal">
                  <Truck className="w-3.5 h-3.5 text-brand-600" />
                  {pricingSummary.isFreeDeliveryUnlocked ? (
                    <strong className="text-brand-600">Free delivery unlocked! (SGD 50+)</strong>
                  ) : (
                    <span>Add <strong>SGD {pricingSummary.freeDeliveryThresholdDelta.toFixed(2)}</strong> for free delivery</span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-charcoal">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#E9E0D4] overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    pricingSummary.isFreeDeliveryUnlocked ? 'bg-brand-600' : 'bg-sage-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#DED7CE] flex items-center justify-center text-brand-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-charcoal">Your order is empty</h3>
                  <p className="text-xs text-charcoal-muted mt-1 max-w-xs">
                    Explore our Korean pet wellness catalogue to find daily essentials for your companion.
                  </p>
                </div>
                <button
                  onClick={closeCartDrawer}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => {
                const pricing = getProductPricing(item.product);
                const lineTotal = (pricing.activePrice * item.quantity).toFixed(2);

                return (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-[#DED7CE] shadow-sm"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 object-contain rounded-xl border border-[#DED7CE] bg-[#FAF7F2] p-1 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-charcoal truncate">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromOrder(item.product.id)}
                          className="text-gray-400 hover:text-brand-600 p-1 -mr-1 rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-charcoal-muted mb-2">
                        {item.product.packageSize}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        {/* Inline [ - ] qty [ + ] */}
                        <div className="flex items-center border border-[#DED7CE] rounded-lg bg-[#FAF7F2] p-0.5 shadow-sm">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-charcoal hover:bg-white rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-charcoal min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-charcoal hover:bg-white rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-charcoal block font-serif">
                            SGD {lineTotal}
                          </span>
                          {pricing.isPromo && (
                            <span className="text-[10px] text-charcoal-muted line-through">
                              SGD {(pricing.regularPrice * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 bg-[#FAF7F2] border-t border-[#DED7CE] space-y-3.5">
              <div className="space-y-1.5 text-xs text-charcoal">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal:</span>
                  <span className="font-medium">SGD {pricingSummary.productSubtotal.toFixed(2)}</span>
                </div>

                {pricingSummary.bundleDiscount > 0 && (
                  <div className="flex justify-between text-brand-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>Mix & Match Savings:</span>
                    </span>
                    <span>- SGD {pricingSummary.bundleDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#DED7CE] text-charcoal">
                  <span>Estimated Total:</span>
                  <span className="font-serif text-base">SGD {pricingSummary.estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReviewOrder}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="w-full text-center text-xs font-semibold text-charcoal-muted hover:text-charcoal py-2 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
