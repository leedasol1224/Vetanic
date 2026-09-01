import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ShopByPet: React.FC = () => {
  const petCategories = [
    {
      id: 'dog',
      title: 'For Dogs',
      description: 'Nutritional eye care, gentle dental sticks, and wholesome mobility support for canines.',
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
      badge: 'Canine Care',
      link: '/products?pet=dog'
    },
    {
      id: 'cat',
      title: 'For Cats',
      description: 'Hydration purees, kidney wellness, and smooth hairball passage formulas for felines.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      badge: 'Feline Care',
      link: '/products?pet=cat'
    },
    {
      id: 'both',
      title: 'For Dogs & Cats',
      description: 'Shared multi-strain probiotics, fresh Omega-3s, and low-calorie vegetable treats.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
      badge: 'Shared Wellness',
      link: '/products?pet=all'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#FAF7F2] border-b border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-2">
              Companion Tailored
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
              Shop by Pet
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mt-2 md:mt-0">
            Targeted daily essentials formulated specifically for your companion's physiology and routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {petCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group relative bg-white rounded-3xl overflow-hidden border border-[#DED7CE] hover:border-brand-300 shadow-card hover:shadow-soft-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAF7F2]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] font-bold text-sage-800 border border-sage-200 shadow-sm">
                  {cat.badge}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl font-bold text-charcoal group-hover:text-brand-600 transition-colors mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-[#DED7CE]/60 flex items-center justify-between text-xs font-bold text-brand-600 group-hover:text-brand-700">
                  <span>Explore {cat.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
