import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { HOMEPAGE_IMAGES } from '../../data/homepageImages';

export const VisualShopByNeed: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1.5">
            Targeted Routines
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
            Shop by Need
          </h2>
        </div>

        {/* 6 Photographic Tiles Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {HOMEPAGE_IMAGES.categoryImages.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.filterQuery}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[5/4] border border-[#DED7CE] shadow-card hover:shadow-soft-lg transition-all duration-300 bg-white"
            >
              {/* Category Image */}
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Gradient Vignette for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent group-hover:from-charcoal/90 transition-colors" />

              {/* Label & Indicator */}
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FAF7F2]/80 block mb-0.5">
                      {category.petType === 'both' ? 'Dogs & Cats' : category.petType === 'dog' ? 'Dogs Only' : 'Cats Only'}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-white group-hover:text-[#FAF7F2] transition-colors">
                      {category.name}
                    </h3>
                  </div>

                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-brand-600 group-hover:border-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
