import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brandAssets } from '../../data/brandAssets';

export const VisualBrandStory: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#DED7CE] shadow-soft-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left: Brand Story Copy & Co-Branding Logos */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 space-y-6 order-2 lg:order-1">
            {/* Clean Co-Branding Layout with Official Logos */}
            <div className="flex items-center gap-3 pb-2 border-b border-[#DED7CE]/70">
              <img
                src={brandAssets.logos.vetanic}
                alt="VETANIC"
                className="h-6 w-auto object-contain"
              />
              <span className="text-charcoal-muted font-serif text-lg">×</span>
              <img
                src={brandAssets.logos.banryodaumLogoEn}
                alt="Nongshim Banryodaum"
                className="h-6 w-auto object-contain"
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-charcoal tracking-tight leading-tight">
                From Korea, now in Singapore.
              </h2>

              <p className="text-sm sm:text-base text-charcoal-muted font-normal leading-relaxed">
                VETANIC brings Nongshim Banryodaum's pet wellness range closer to pet owners in Singapore.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 bg-charcoal hover:bg-black text-white font-bold text-sm px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Official Brand Story Visual */}
          <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[460px] bg-white overflow-hidden order-1 lg:order-2">
            <img
              src={brandAssets.homepage.brandStoryImage}
              alt="VETANIC and Nongshim Banryodaum Korean Pet Wellness Craft"
              className="w-full h-full object-cover object-[center_35%] lg:object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
