import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { OrderItem } from '../../types/order';
import { PetBadge } from '../common/Badge';
import { getProductPricing } from '../../lib/pricing';

interface OrderItemRowProps {
  item: OrderItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;
  const pricing = getProductPricing(product);
  const lineTotal = (pricing.activePrice * quantity).toFixed(2);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-brand-100 shadow-sm">
      {/* Product Image & Meta */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 rounded-xl object-cover border border-brand-100 bg-[#F5EFE6]/50 flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <PetBadge type={product.petType} size="sm" />
            <span className="text-[11px] text-charcoal-muted font-medium">
              {product.packageSize}
            </span>
          </div>
          <h4 className="text-sm font-bold text-charcoal truncate">
            {product.name}
          </h4>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xs font-bold text-brand-900">
              SGD {pricing.activePrice.toFixed(2)}
            </span>
            {pricing.isPromo && (
              <span className="text-[10px] text-charcoal-muted line-through">
                SGD {pricing.regularPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity, Line Total & Remove controls */}
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/70 p-0.5">
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="p-1.5 text-charcoal hover:bg-white rounded-lg transition-colors disabled:opacity-40"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-charcoal min-w-[2rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="p-1.5 text-charcoal hover:bg-white rounded-lg transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[4.5rem]">
          <div className="text-xs font-bold text-charcoal">
            SGD {lineTotal}
          </div>
          <div className="text-[10px] text-charcoal-muted">
            ({quantity} × ${pricing.activePrice.toFixed(2)})
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="text-gray-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors"
          title="Remove from order"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
