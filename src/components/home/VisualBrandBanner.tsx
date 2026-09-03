import React from 'react';
import { brandAssets } from '../../data/brandAssets';

export const VisualBrandBanner: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2]">
      <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[580px] flex items-center justify-center">
        {/* Background Official Product + Pet Lifestyle Image (Bright & Prominent) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={brandAssets.homepage.lifestyleProductPetImage}
            alt="VETANIC Companion Care Moments with Dog"
            className="w-full h-full object-cover object-[center_25%] sm:object-[center_35%] lg:object-center"
          />
          {/* Subtle localized bottom/center gradient vignette to preserve natural brightness */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/25 to-transparent sm:bg-charcoal/30 backdrop-brightness-98" />
        </div>

        {/* Text Overlay with localized backdrop pill and subtle text shadow */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-16">
          <div className="inline-block bg-charcoal/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 shadow-lg space-y-2 max-w-2xl mx-auto">
            <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-[#E9E0D4] bg-white/20 px-3 py-0.5 rounded-full">
              Korean Companion Care
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
              Made for the everyday moments that matter.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};
