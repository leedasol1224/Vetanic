import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Activity, Eye, Shield, Feather, Smile, Heart, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/products';

export const NeedCategories: React.FC = () => {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-brand-700" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-brand-700" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-brand-700" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-brand-700" />;
      case 'Feather':
        return <Feather className="w-6 h-6 text-brand-700" />;
      case 'Smile':
        return <Smile className="w-6 h-6 text-brand-700" />;
      case 'Heart':
        return <Heart className="w-6 h-6 text-brand-700" />;
      default:
        return <Sparkles className="w-6 h-6 text-brand-700" />;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block mb-2">
              Targeted Pet Wellness
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              Shop by Need
            </h2>
          </div>
          <p className="text-sm text-charcoal-muted max-w-md mt-2 md:mt-0">
            Easily discover specific routines tailored to your dog or cat’s daily wellbeing.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group bg-white rounded-2xl p-6 border border-brand-100/90 hover:border-brand-300 shadow-card hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center mb-4 transition-colors">
                  {getIcon(cat.iconName)}
                </div>

                <h3 className="text-lg font-bold text-charcoal group-hover:text-brand-900 transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-brand-800 group-hover:text-brand-950">
                <span>View Products</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
