import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../../types/product';
import { PetBadge } from '../common/Badge';
import { useOrder } from '../../context/OrderContext';
import { getProductPricing } from '../../lib/pricing';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToOrder, updateQuantity, getItemQuantity } = useOrder();

  const currentQuantity = getItemQuantity(product.id);
  const pricing = getProductPricing(product);

  const handleAddInitial = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToOrder(product, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, currentQuantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, currentQuantity - 1);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#DED7CE] hover:border-brand-300 shadow-card hover:shadow-soft-lg transition-all duration-300">
      {/* Clickable Card Link to Individual Product Page */}
      <Link
        to={`/products/${product.id}`}
        className="flex flex-col flex-1"
      >
        {/* Product Image Stage */}
        <div className="relative aspect-square w-full overflow-hidden bg-white p-6 flex items-center justify-center border-b border-[#DED7CE]/60">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Pet Badge */}
          <div className="absolute top-3.5 left-3.5">
            <PetBadge type={product.petType} size="sm" />
          </div>

          {/* Sold Out Badge or In-Order Pill */}
          {!product.isAvailable ? (
            <div className="absolute top-3.5 right-3.5 bg-charcoal/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Sold Out
            </div>
          ) : currentQuantity > 0 ? (
            <div className="absolute top-3.5 right-3.5 bg-brand-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span>{currentQuantity} in Order</span>
            </div>
          ) : null}
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-5 pb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
              {product.categoryName}
            </span>
            <span className="text-[11px] text-charcoal-muted font-medium">
              {product.packageSize}
            </span>
          </div>

          <h3 className="text-base font-bold text-charcoal group-hover:text-brand-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-charcoal-muted line-clamp-1 mt-1 mb-3">
            {product.shortDescription}
          </p>

          {/* Pricing & Subtle Mix & Match tag */}
          <div className="mt-auto pt-2 border-t border-[#DED7CE]/40">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-bold text-charcoal font-serif">
                SGD {pricing.activePrice.toFixed(2)}
              </span>

              {pricing.isPromo && (
                <span className="text-xs text-charcoal-muted line-through">
                  SGD {pricing.regularPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-[11px] text-brand-600 font-medium">
                {product.bundleOfferText || 'Mix & Match available'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Dynamic Action Button Bar */}
      <div className="p-5 pt-0 mt-auto">
        {!product.isAvailable ? (
          <button
            type="button"
            disabled
            className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-center"
            title="Currently out of stock"
          >
            Sold Out
          </button>
        ) : currentQuantity === 0 ? (
          <button
            type="button"
            onClick={handleAddInitial}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-sm hover:shadow active:scale-[0.99]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Order</span>
          </button>
        ) : (
          <div className="flex items-center justify-between w-full bg-brand-50 border border-brand-200 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center bg-white hover:bg-brand-100 text-brand-700 rounded-lg transition-colors border border-brand-200/80 shadow-xs"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="text-xs font-bold text-charcoal min-w-[2rem] text-center">
              {currentQuantity} in Order
            </span>

            <button
              type="button"
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-xs"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
