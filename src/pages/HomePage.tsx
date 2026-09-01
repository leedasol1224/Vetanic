import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { ShopByPet } from '../components/home/ShopByPet';
import { NeedCategories } from '../components/home/NeedCategories';
import { LaunchPromoSection } from '../components/home/LaunchPromoSection';
import { MixMatchSection } from '../components/home/MixMatchSection';
import { CatRoutineSection } from '../components/home/CatRoutineSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { WhyVetanic } from '../components/home/WhyVetanic';
import { HomeCta } from '../components/home/HomeCta';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Meet VETANIC */}
      <IntroSection />

      {/* 3. Shop by Pet */}
      <ShopByPet />

      {/* 4. Shop by Need */}
      <NeedCategories />

      {/* 5. Singapore Launch Special */}
      <LaunchPromoSection />

      {/* 6. Mix & Match Savings */}
      <MixMatchSection />

      {/* 7. Build Your Cat Wellness Routine */}
      <CatRoutineSection />

      {/* 8. Featured Products */}
      <FeaturedProducts />

      {/* 9. Why VETANIC Brand Values */}
      <WhyVetanic />

      {/* 10. Final Home CTA */}
      <HomeCta />
    </main>
  );
};
