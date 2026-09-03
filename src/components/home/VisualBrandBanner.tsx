import React from 'react';
import { brandAssets } from '../../data/brandAssets';

export const VisualBrandBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-charcoal">
      <div className="relative min-h-[400px] sm:min-h-[480px] lg:min-h-[560px] flex items-center justify-center">
        {/* Background Official Product + Pet Lifestyle Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={brandAssets.homepage.lifestyleProductPetImage}
            alt="VETANIC Companion Care Moments"
            className="w-full h-full object-cover object-[center_35%] sm:object-[center_40%] lg:object-center"
          />
          {/* Subtle Warm Overlay for readability */}
          <div className="absolute inset-0 bg-charcoal/40 backdrop-brightness-95" />
        </div>

        {/* Text Overlay Only (No paragraph) */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">
          <span className="inline-block text-[11px] uppercase tracking-widest font-bold text-[#FAF7F2] bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/20 mb-4">
            Korean Companion Care
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
            Made for the everyday moments that matter.
          </h2>
        </div>
      </div>
    </section>
  );
};
