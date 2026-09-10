import React from 'react';
import { VisualHeroSection } from '../components/home/VisualHeroSection';
import { VisualShopProducts } from '../components/home/VisualShopProducts';
import { VisualBrandBanner } from '../components/home/VisualBrandBanner';
import { VisualSingaporeLaunch } from '../components/home/VisualSingaporeLaunch';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1 bg-[#FAF7F2]">
      {/* 1. HERO — Full-width lifestyle photography */}
      <VisualHeroSection />

      {/* 2. FEATURED / SHOP PRODUCTS — 4 large cards with DOG | CAT | ALL filters */}
      <VisualShopProducts />

      {/* 3. LARGE LIFESTYLE PHOTOGRAPHY — Full-width photo break ("From Korea, for the companions we love.") */}
      <VisualBrandBanner />

      {/* 4. SINGAPORE LAUNCH — One Singapore Launch section */}
      <VisualSingaporeLaunch />
    </main>
  );
};
