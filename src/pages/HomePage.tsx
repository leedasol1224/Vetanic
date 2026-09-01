import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { NeedCategories } from '../components/home/NeedCategories';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { WhyVetanic } from '../components/home/WhyVetanic';
import { HomeCta } from '../components/home/HomeCta';

export const HomePage: React.FC = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <IntroSection />
      <NeedCategories />
      <FeaturedProducts />
      <WhyVetanic />
      <HomeCta />
    </main>
  );
};
