import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '../common/Icons';
import { brandAssets } from '../../data/brandAssets';

export const VisualSocialGallery: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#DED7CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1.5">
              Everyday Companions
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal tracking-tight">
              Life with VETANIC
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-charcoal hover:text-brand-600 transition-colors self-start sm:self-auto group"
          >
            <InstagramIcon className="w-4 h-4 text-brand-600" />
            <span>@vetanic.sg on Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* 6 Editorial Official Product + Pet Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {brandAssets.gallery.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#DED7CE] shadow-xs hover:shadow-soft transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover overlay with minimal official product & pet caption */}
              <div className="absolute inset-0 bg-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5 text-white">
                <span className="text-[9px] uppercase font-bold text-[#A8B89A] tracking-wider mb-0.5">
                  {item.category}
                </span>
                <span className="text-[11px] font-bold line-clamp-1 leading-tight">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
