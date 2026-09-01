import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { ShopByPet } from '../components/home/ShopByPet';
import { NeedCategories } from '../components/home/NeedCategories';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { LaunchPromoSection } from '../components/home/LaunchPromoSection';
import { WhyVetanic } from '../components/home/WhyVetanic';
import { HomeCta } from '../components/home/HomeCta';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Meet VETANIC */}
      <IntroSection />

      {/* 3. Shop by Pet */}
      <ShopByPet />

      {/* 4. Shop by Need */}
      <NeedCategories />

      {/* 5. Featured Products */}
      <FeaturedProducts />

      {/* 6. One Singapore Launch Section */}
      <LaunchPromoSection />

      {/* 7. Brand / Why VETANIC Section */}
      <WhyVetanic />

      {/* 8. Final Shop CTA */}
      <HomeCta />
    </main>
  );
};
