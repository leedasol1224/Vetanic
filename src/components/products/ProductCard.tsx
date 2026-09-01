import React, { useState } from 'react';
import { Plus, Eye, Check, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { PetBadge } from '../common/Badge';
import { useOrder } from '../../context/OrderContext';
import { getProductPricing } from '../../lib/pricing';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToOrder, openProductModal, isItemInOrder, getItemQuantity } = useOrder();
  const [justAdded, setJustAdded] = useState(false);

  const inOrder = isItemInOrder(product.id);
  const qtyInOrder = getItemQuantity(product.id);
  const pricing = getProductPricing(product);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToOrder(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => openProductModal(product)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-100 hover:border-brand-300 shadow-card hover:shadow-soft-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-white p-4 flex items-center justify-center border-b border-brand-100/60">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Pet Badge */}
        <div className="absolute top-3 left-3">
          <PetBadge type={product.petType} size="sm" />
        </div>

        {/* In-Cart Tag if already added */}
        {inOrder && (
          <div className="absolute top-3 right-3 bg-brand-800 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>{qtyInOrder} in Order</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider">
            {product.categoryName}
          </span>
          <span className="text-[11px] text-charcoal-muted font-medium">
            {product.packageSize}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-charcoal group-hover:text-brand-800 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs text-charcoal-muted line-clamp-2 mt-1 mb-3">
          {product.shortDescription}
        </p>

        {/* Pricing Display */}
        <div className="mb-3 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-brand-900 font-serif">
              SGD {pricing.activePrice.toFixed(2)}
            </span>

            {pricing.isPromo && (
              <span className="text-xs text-charcoal-muted line-through">
                SGD {pricing.regularPrice.toFixed(2)}
              </span>
            )}
          </div>

          {pricing.isPromo && (
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>Singapore Launch Price</span>
              </span>
            </div>
          )}

          {/* Bundle Offer Summary */}
          {product.bundleOfferText && (
            <div className="mt-2 text-[11px] text-brand-800 font-semibold bg-brand-50/70 px-2.5 py-1 rounded-lg border border-brand-100">
              {product.bundleOfferText}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 mt-auto border-t border-gray-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProductModal(product);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-charcoal bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200/80"
          >
            <Eye className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-bold rounded-xl transition-all shadow-sm ${
              justAdded
                ? 'bg-brand-600 text-white'
                : 'bg-brand-800 hover:bg-brand-900 text-white'
            }`}
            title="Add 1 to Order"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
