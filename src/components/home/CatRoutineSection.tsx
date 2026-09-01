import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../products/ProductCard';
import { BRAND_CONTENT } from '../../data/content';

export const CatRoutineSection: React.FC = () => {
  // Feature Probiotics, Hairball Care, Urena Clear
  const catRoutineProducts = PRODUCTS.filter((p) =>
    ['probiotics', 'hairball-care', 'urena-clear'].includes(p.id)
  );

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-b border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-bold uppercase tracking-wider mb-2 border border-sage-200">
              <Sparkles className="w-3.5 h-3.5 text-sage-600" />
              <span>Feline Wellness Focus</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              {BRAND_CONTENT.catRoutine.title}
            </h2>
            <p className="text-sm text-charcoal-muted mt-2">
              {BRAND_CONTENT.catRoutine.subtitle}
            </p>
          </div>

          <Link
            to="/products?pet=cat"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all mt-4 md:mt-0"
          >
            <span>{BRAND_CONTENT.catRoutine.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Featured Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catRoutineProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
