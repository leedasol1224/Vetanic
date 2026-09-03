import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Check, Package, MapPin, ShieldAlert, Sparkles, Tag, ExternalLink } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { PetBadge } from '../common/Badge';
import { getProductPricing } from '../../lib/pricing';

export const ProductDetailModal: React.FC = () => {
  const { activeProductModal, closeProductModal, addToOrder, isItemInOrder, getItemQuantity } = useOrder();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'usage' | 'origin'>('details');

  useEffect(() => {
    if (activeProductModal) {
      setQuantity(1);
      setActiveTab('details');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeProductModal]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const inOrder = isItemInOrder(product.id);
  const currentInOrderQty = getItemQuantity(product.id);
  const pricing = getProductPricing(product);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    if (!product.isAvailable) return;
    addToOrder(product, quantity);
    closeProductModal();
  };

  const estimatedLineSubtotal = (pricing.activePrice * quantity).toFixed(2);
  const precautionsList = Array.isArray(product.details.precautions)
    ? product.details.precautions
    : [product.details.precautions];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-charcoal/60 backdrop-blur-sm animate-soft-in">
      <div 
        className="fixed inset-0" 
        onClick={closeProductModal} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-soft-lg overflow-hidden border border-[#DED7CE] z-10 my-8 flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DED7CE] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Product Quick View</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-charcoal-muted">{product.categoryName}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/products/${product.id}`}
              onClick={closeProductModal}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={closeProductModal}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#F4EFE7] flex items-center justify-center text-charcoal-muted hover:text-charcoal transition-colors border border-[#DED7CE]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Product Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#DED7CE] aspect-square p-5 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain object-center"
              />
              <div className="absolute top-3 left-3">
                <PetBadge type={product.petType} size="md" />
              </div>
            </div>

            {/* Product Info Summary */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-charcoal-muted bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#DED7CE]/80">
                  {product.categoryName}
                </span>
                <span className="text-xs text-charcoal-muted font-medium">
                  {product.packageSize}
                </span>
              </div>

              <h2 className="text-2xl font-heading font-bold text-charcoal tracking-tight">
                {product.name}
              </h2>

              <p className="text-charcoal-muted font-normal text-xs sm:text-sm mt-1 mb-3">
                {product.shortDescription}
              </p>

              {/* Pricing Callout */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] mb-3 space-y-1.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-heading font-bold text-charcoal">
                    SGD {pricing.activePrice.toFixed(2)}
                  </span>
                  {pricing.isPromo && (
                    <span className="text-xs text-charcoal-muted line-through">
                      SGD {pricing.regularPrice.toFixed(2)}
                    </span>
                  )}
                  {pricing.isPromo && (
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                      September Launch Price
                    </span>
                  )}
                </div>

                {product.bundleOfferText && (
                  <div className="text-xs font-medium text-charcoal flex items-center gap-1.5 pt-1.5 border-t border-[#DED7CE]/60">
                    <Tag className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span>{product.bundleOfferText}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#FAF7F2]/80 rounded-xl border border-[#DED7CE]/70 mb-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-charcoal">
                  <Package className="w-3.5 h-3.5 text-sage-600" />
                  <span><strong>Package:</strong> {product.packageSize}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-charcoal">
                  <MapPin className="w-3.5 h-3.5 text-sage-600" />
                  <span><strong>Origin:</strong> {product.details.countryOfOrigin}</span>
                </div>
                {inOrder && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold pt-1 border-t border-[#DED7CE]/60">
                    <Check className="w-3.5 h-3.5 text-brand-600" />
                    <span>Currently in order: {currentInOrderQty} units</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Add Button */}
              <div className="pt-1">
                {!product.isAvailable ? (
                  <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#DED7CE] text-center space-y-1">
                    <span className="text-xs font-bold text-charcoal block">Currently Sold Out</span>
                    <p className="text-[11px] text-charcoal-muted font-normal">
                      This item is temporarily unavailable for order requests.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">
                      <span>Quantity</span>
                      <span className="text-charcoal font-bold">Line Total: SGD {estimatedLineSubtotal}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#DED7CE] rounded-xl bg-white shadow-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={handleDecrement}
                          className="p-2.5 text-charcoal hover:bg-[#FAF7F2] transition-colors disabled:opacity-40"
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold text-sm text-charcoal min-w-[2.5rem] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncrement}
                          className="p-2.5 text-charcoal hover:bg-[#FAF7F2] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleAdd}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Order</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabbed Info Section */}
          <div className="border-t border-[#DED7CE] pt-6">
            <div className="flex gap-2 border-b border-[#DED7CE] pb-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'details'
                    ? 'bg-brand-600 text-white'
                    : 'text-charcoal-muted hover:bg-[#FAF7F2]'
                }`}
              >
                Key Highlights
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'usage'
                    ? 'bg-brand-600 text-white'
                    : 'text-charcoal-muted hover:bg-[#FAF7F2]'
                }`}
              >
                Usage & Ingredients
              </button>
              <button
                onClick={() => setActiveTab('origin')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'origin'
                    ? 'bg-brand-600 text-white'
                    : 'text-charcoal-muted hover:bg-[#FAF7F2]'
                }`}
              >
                Storage & Precautions
              </button>
            </div>

            <div className="mt-4 text-sm text-charcoal space-y-3">
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    Key Benefits
                  </h4>
                  {product.details.keyBenefits && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {product.details.keyBenefits.map((benefit, idx) => (
                        <div key={idx} className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#DED7CE] text-xs font-bold text-charcoal">
                          {benefit}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">How to Feed</h4>
                    <p className="text-charcoal-muted bg-[#FAF7F2] p-2.5 rounded-lg border border-[#DED7CE]">
                      {product.details.howToFeed || product.details.feedingUsageGuide}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Recommended Daily Dosage</h4>
                    <p className="text-charcoal-muted bg-[#FAF7F2] p-2.5 rounded-lg border border-[#DED7CE]">
                      {product.details.recommendedDailyAmount}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Full Ingredients</h4>
                    <p className="text-charcoal-muted bg-[#FAF7F2] p-2.5 rounded-lg border border-[#DED7CE]">
                      {product.details.fullIngredients}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'origin' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-charcoal mb-1">Storage Instructions</h4>
                    <p className="text-charcoal-muted bg-[#FAF7F2] p-2.5 rounded-lg border border-[#DED7CE]">
                      {product.details.storageInstructions}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-4 h-4 text-brand-600" />
                      Precautions
                    </h4>
                    <div className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#DED7CE] space-y-1">
                      {precautionsList.map((p, idx) => (
                        <p key={idx} className="text-charcoal-muted">
                          • {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#DED7CE] flex items-center justify-between">
          <Link
            to={`/products/${product.id}`}
            onClick={closeProductModal}
            className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>View Full Product Page</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {!product.isAvailable ? (
            <button
              disabled
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-400 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed border border-gray-300"
            >
              <span>Sold Out</span>
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Add {quantity} to Order (SGD {estimatedLineSubtotal})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
