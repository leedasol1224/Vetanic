import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../products/ProductCard';

export const FeaturedProducts: React.FC = () => {
  // Select the 4 featured products
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white border-y border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Singapore Favorites</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              Featured Products
            </h2>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 mt-4 sm:mt-0 transition-colors group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
