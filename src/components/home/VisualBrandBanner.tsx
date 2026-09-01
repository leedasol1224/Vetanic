import React from 'react';
import { HOMEPAGE_IMAGES } from '../../data/homepageImages';

export const VisualBrandBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-charcoal">
      <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[580px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={HOMEPAGE_IMAGES.lifestyleImage01.imageUrl}
            alt={HOMEPAGE_IMAGES.lifestyleImage01.alt}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Warm Overlay */}
          <div className="absolute inset-0 bg-charcoal/45 backdrop-brightness-95" />
        </div>

        {/* Text Overlay Only (No paragraph) */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">
          <span className="inline-block text-[11px] uppercase tracking-widest font-bold text-[#FAF7F2] bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 mb-4">
            Korean Companion Care
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
            From Korea, for the companions we love.
          </h2>
        </div>
      </div>
    </section>
  );
};
