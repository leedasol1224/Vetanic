import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon } from '../common/Icons';
import { brandAssets } from '../../data/brandAssets';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#222222] text-[#FAF7F2] pt-16 pb-12 mt-auto border-t border-[#333333]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        {/* VETANIC Official Logo Card */}
        <div className="flex justify-center">
          <Link to="/" className="inline-block p-3 bg-white rounded-2xl shadow-xs transition-transform hover:scale-[1.02]">
            <img
              src={brandAssets.logos.vetanic}
              alt="VETANIC"
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Minimal Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-medium">
          <Link to="/about" className="text-[#DED7CE] hover:text-white transition-colors">
            About Us
          </Link>
          <Link to="/products" className="text-[#DED7CE] hover:text-white transition-colors">
            Products
          </Link>
          <Link to="/order" className="text-[#DED7CE] hover:text-white transition-colors">
            Order
          </Link>
          <Link to="/contact" className="text-[#DED7CE] hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Instagram Customer Contact */}
        <div className="pt-2 flex flex-col items-center justify-center space-y-2">
          <span className="text-[11px] font-bold text-[#A8B89A] uppercase tracking-widest">
            Connect with us
          </span>
          <a
            href={brandAssets.social.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#FAF7F2] bg-[#2D2D2D] hover:bg-[#3D3D3D] px-4 py-2 rounded-full border border-[#3D3D3D] transition-colors group"
          >
            <InstagramIcon className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
            <span>{brandAssets.social.instagramHandle}</span>
          </a>
        </div>

        {/* Subtle Brand Lineage Note & Copyright */}
        <div className="pt-8 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C847C]">
          <span>© 2026 VETANIC. All rights reserved.</span>
          <span className="text-[11px] text-[#8C847C]">
            In partnership with Nongshim Banryodaum Korea
          </span>
        </div>
      </div>
    </footer>
  );
};
