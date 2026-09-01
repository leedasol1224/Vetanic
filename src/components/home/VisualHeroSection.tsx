import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HOMEPAGE_IMAGES } from '../../data/homepageImages';

export const VisualHeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2]">
      {/* Full-width visual container with editorial aspect ratio */}
      <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center">
        {/* Background Lifestyle Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={HOMEPAGE_IMAGES.heroLifestyle.imageUrl}
            alt={HOMEPAGE_IMAGES.heroLifestyle.alt}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient vignette to guarantee crisp legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-charcoal/20 sm:bg-gradient-to-r sm:from-charcoal/85 sm:via-charcoal/45 sm:to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col justify-end sm:justify-center items-start text-white">
          <div className="max-w-xl space-y-4 sm:space-y-6">
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-[#E9E0D4] bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20">
              Korean Pet Wellness
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
              Everyday care, made with love.
            </h1>

            <p className="text-lg sm:text-xl text-[#FAF7F2] font-normal leading-snug">
              Korean pet wellness, now in Singapore.
            </p>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
              >
                <span>Shop VETANIC</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
