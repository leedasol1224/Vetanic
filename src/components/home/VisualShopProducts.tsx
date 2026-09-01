import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { PetBadge } from '../common/Badge';
import { useOrder } from '../../context/OrderContext';
import { getProductPricing } from '../../lib/pricing';

export const VisualShopProducts: React.FC = () => {
  const [selectedPetFilter, setSelectedPetFilter] = useState<'all' | 'dog' | 'cat'>('all');
  const { addToOrder, updateQuantity, getItemQuantity } = useOrder();

  // Filter 4 featured products based on pet type
  const displayProducts = useMemo(() => {
    let filtered = PRODUCTS;
    if (selectedPetFilter === 'dog') {
      filtered = PRODUCTS.filter((p) => p.petType === 'dog' || p.petType === 'both');
    } else if (selectedPetFilter === 'cat') {
      filtered = PRODUCTS.filter((p) => p.petType === 'cat' || p.petType === 'both');
    }
    return filtered.slice(0, 4);
  }, [selectedPetFilter]);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Minimal Filters */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1.5">
              Daily Essentials
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              Find their everyday care.
            </h2>
          </div>

          {/* DOG | CAT | ALL Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#DED7CE] shadow-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedPetFilter('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedPetFilter === 'all'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F2]'
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => setSelectedPetFilter('dog')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedPetFilter === 'dog'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F2]'
              }`}
            >
              DOG
            </button>
            <button
              type="button"
              onClick={() => setSelectedPetFilter('cat')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedPetFilter === 'cat'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-[#FAF7F2]'
              }`}
            >
              CAT
            </button>
          </div>
        </div>

        {/* 4 Visually Large Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => {
            const pricing = getProductPricing(product);
            const currentQuantity = getItemQuantity(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#DED7CE] hover:border-brand-300 shadow-card hover:shadow-soft-lg transition-all duration-300"
              >
                {/* Large Product Photography Stage */}
                <Link
                  to={`/products/${product.id}`}
                  className="flex flex-col flex-1"
                >
                  <div className="relative aspect-square w-full bg-white p-6 flex items-center justify-center border-b border-[#DED7CE]/50">
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

                    {!product.isAvailable && (
                      <div className="absolute top-3.5 right-3.5 bg-charcoal/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Clean Visual Card Body */}
                  <div className="flex flex-col flex-1 p-5 pb-3">
                    <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider mb-1">
                      {product.categoryName}
                    </span>

                    <h3 className="text-base font-bold text-charcoal group-hover:text-brand-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-base font-bold text-charcoal font-serif">
                        SGD {pricing.activePrice.toFixed(2)}
                      </span>
                      {pricing.isPromo && (
                        <span className="text-xs text-charcoal-muted line-through">
                          SGD {pricing.regularPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Inline Quantity Control Bar */}
                <div className="p-5 pt-0 mt-auto">
                  {!product.isAvailable ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-center"
                    >
                      Sold Out
                    </button>
                  ) : currentQuantity === 0 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        addToOrder(product, 1);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-sm hover:shadow active:scale-[0.99]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Order</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full bg-brand-50 border border-brand-200 rounded-xl p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          updateQuantity(product.id, currentQuantity - 1);
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          updateQuantity(product.id, currentQuantity + 1);
                        }}
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
          })}
        </div>

        {/* View All Products Link */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4"
          >
            <span>Explore All 10 Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
