import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { HOMEPAGE_IMAGES } from '../../data/homepageImages';

export const VisualBrandStory: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-[#DED7CE] shadow-soft-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left: Brand Story Copy & CTA */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sage-50 text-sage-800 text-xs font-bold uppercase tracking-wider border border-sage-200">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
              <span>Korean Heritage</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-charcoal tracking-tight leading-tight">
                VETANIC × Nongshim Banryodaum
              </h2>

              <p className="text-lg sm:text-xl text-charcoal-muted font-heading font-medium">
                Born in Korea. Now in Singapore.
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

          {/* Right: Brand Story Visual */}
          <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[460px] bg-white overflow-hidden order-1 lg:order-2">
            <img
              src={HOMEPAGE_IMAGES.brandStoryImage.imageUrl}
              alt={HOMEPAGE_IMAGES.brandStoryImage.alt}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
