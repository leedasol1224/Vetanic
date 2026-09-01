import React from 'react';
import { VisualHeroSection } from '../components/home/VisualHeroSection';
import { VisualShopProducts } from '../components/home/VisualShopProducts';
import { VisualBrandBanner } from '../components/home/VisualBrandBanner';
import { VisualShopByNeed } from '../components/home/VisualShopByNeed';
import { VisualSingaporeLaunch } from '../components/home/VisualSingaporeLaunch';
import { VisualBrandStory } from '../components/home/VisualBrandStory';
import { VisualSocialGallery } from '../components/home/VisualSocialGallery';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1 bg-[#FAF7F2]">
      {/* 1. HERO — Full-width lifestyle photography */}
      <VisualHeroSection />

      {/* 2. SHOP PRODUCTS — 4 large cards with DOG | CAT | ALL filters */}
      <VisualShopProducts />

      {/* 3. BRAND LIFESTYLE IMAGE — Full-width photo with short overlay */}
      <VisualBrandBanner />

      {/* 4. SHOP BY NEED — Photographic Category Tiles */}
      <VisualShopByNeed />

      {/* 5. SINGAPORE LAUNCH — Single Focused Promotional Visual */}
      <VisualSingaporeLaunch />

      {/* 6. BRAND STORY — VETANIC × Nongshim Banryodaum */}
      <VisualBrandStory />

      {/* 7. REAL LIFE / SOCIAL GALLERY — 6-photo Editorial Grid */}
      <VisualSocialGallery />
    </main>
  );
};
