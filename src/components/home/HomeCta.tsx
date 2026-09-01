import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const HomeCta: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#E9E0D4]/30 border-t border-[#DED7CE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-charcoal max-w-2xl mx-auto leading-tight">
          Everyday wellness starts here.
        </h2>

        <p className="text-base sm:text-lg text-charcoal-muted max-w-lg mx-auto font-normal">
          Korean pet wellness formulated with care, now available across Singapore.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/order"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FAF7F2] text-charcoal font-bold text-sm px-8 py-4 rounded-full border border-[#DED7CE] shadow-xs transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-brand-600" />
            <span>Order Direct</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
