import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Heart, ArrowUpRight } from 'lucide-react';
import { BRAND_CONTENT } from '../../data/content';
import { InstagramIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#222222] text-[#FAF7F2] pt-16 pb-12 mt-auto border-t border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#333333]">
          {/* Col 1: Brand & Origin */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                {BRAND_CONTENT.name}
              </span>
              <span className="text-xs text-[#A8B89A] font-medium tracking-wide">
                Pet wellness from Korea, for companions everywhere.
              </span>
            </div>

            <div className="p-4 bg-[#2D2D2D] rounded-2xl border border-[#3D3D3D] max-w-lg">
              <p className="text-xs text-[#DED7CE] leading-relaxed">
                <strong>Brand Lineage:</strong> {BRAND_CONTENT.footerRelationText} Crafted with rigorous companion wellness standards from Korea.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2D2D2D] hover:bg-brand-600 flex items-center justify-center text-[#FAF7F2] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@vetanic.com"
                className="w-10 h-10 rounded-full bg-[#2D2D2D] hover:bg-brand-600 flex items-center justify-center text-[#FAF7F2] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <Link
                to="/contact"
                className="w-10 h-10 rounded-full bg-[#2D2D2D] hover:bg-brand-600 flex items-center justify-center text-[#FAF7F2] transition-colors"
                aria-label="Contact Channels"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DED7CE] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[#A59E96] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#A59E96] hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-[#A59E96] hover:text-white transition-colors">
                  Our Products
                </Link>
              </li>
              <li>
                <Link to="/order" className="text-[#A59E96] hover:text-white transition-colors">
                  Order Request
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#A59E96] hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DED7CE] mb-4">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A59E96]">
              <li className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <span>Shipping & Delivery (SG)</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </li>
              <li className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <span>Payment & Order Flow</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </li>
              <li className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <span>Terms & Conditions</span>
              </li>
              <li className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <span>Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C847C] gap-4">
          <p>© {new Date().getFullYear()} VETANIC Singapore. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Wellness formulated with care in Korea</span>
            <Heart className="w-3.5 h-3.5 text-brand-600 fill-brand-600" />
          </p>
        </div>
      </div>
    </footer>
  );
};
