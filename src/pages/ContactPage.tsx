import React from 'react';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '../components/common/Icons';
import { brandAssets } from '../data/brandAssets';

export const ContactPage: React.FC = () => {
  return (
    <main className="flex-1 bg-[#FAF7F2] py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-200">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Customer Care</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal tracking-tight">
            Get in touch
          </h1>
          <p className="text-base sm:text-lg text-charcoal-muted max-w-lg mx-auto">
            Have a question about VETANIC or your order? Reach out to us on Instagram.
          </p>
        </div>

        {/* Minimal Instagram Contact Card */}
        <div className="bg-white rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 border border-[#DED7CE] shadow-soft-lg space-y-6 max-w-lg mx-auto animate-soft-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] text-white flex items-center justify-center mx-auto shadow-md">
            <InstagramIcon className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal">
              {brandAssets.social.instagramHandle}
            </h2>
            <p className="text-xs text-charcoal-muted">
              Official VETANIC Global & Singapore Support Channel
            </p>
          </div>

          <div className="pt-2">
            <a
              href={brandAssets.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-4 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message us on Instagram</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Small Note */}
        <p className="text-xs text-charcoal-muted max-w-sm mx-auto leading-relaxed">
          Our team typically responds to Instagram direct messages within the day.
        </p>
      </div>
    </main>
  );
};
