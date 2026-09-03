/**
 * Centralized VETANIC Brand Assets Configuration
 * All official logos, official product + pet photography, and key brand visuals
 * are mapped here to allow single-point updates and asset management.
 */

export interface BrandAssetConfig {
  logos: {
    vetanic: string;
    vetanicClean: string;
    vetanic4x: string;
    banryodaum: string;
    banryodaumWordmark: string;
    banryodaumLogoEn: string;
    banryodaumEmblemKr: string;
    banryodaumIcon: string;
  };
  homepage: {
    heroProductPetImage: string;
    lifestyleProductPetImage: string;
    singaporeLaunchImage: string;
    brandStoryImage: string;
  };
  gallery: Array<{
    id: string;
    imageUrl: string;
    title: string;
    category: string;
    petType: 'dog' | 'cat' | 'both';
  }>;
  productImages: Record<string, string>;
}

export const brandAssets: BrandAssetConfig = {
  logos: {
    // Official VETANIC logo
    vetanic: '/images/brand/vetanic_logo.png',
    vetanicClean: '/images/brand/vetanic_logo_clean.png',
    vetanic4x: '/images/brand/vetanic_logo_4x.png',
    // Official Nongshim Banryodaum logos
    banryodaum: '/images/brand/banryodaum_logo.png',
    banryodaumWordmark: '/images/brand/banryodaum_wordmark.png',
    banryodaumLogoEn: '/images/brand/banryodaum_logo_en.png',
    banryodaumEmblemKr: '/images/brand/banryodaum_emblem_kr.png',
    banryodaumIcon: '/images/brand/banryodaum_icon.png',
  },
  homepage: {
    // 1. HERO — Official VETANIC product lineup + Dog & Cat lifestyle
    heroProductPetImage: '/images/lifestyle/hero_product_pet.jpg',
    // 2. LARGE LIFESTYLE BANNER — Official Cat with Complete Vital / Hairball Care stick
    lifestyleProductPetImage: '/images/lifestyle/lifestyle_product_pet.jpg',
    // 3. SINGAPORE LAUNCH — Official product range with Dog
    singaporeLaunchImage: '/images/lifestyle/singapore_launch_official.jpg',
    // 4. BRAND STORY — Official Korean formulation craft & packaging
    brandStoryImage: '/images/brand/brand_story_official.jpg',
  },
  gallery: [
    {
      id: 'gallery-joint',
      imageUrl: '/images/gallery/official_joint_dog.jpg',
      title: 'Joint Support Sticks',
      category: 'Joint Care 2.0',
      petType: 'dog'
    },
    {
      id: 'gallery-hairball',
      imageUrl: '/images/gallery/official_hairball_cat.jpg',
      title: 'Hairball Care Salmon Puree',
      category: 'Feline Digestion',
      petType: 'cat'
    },
    {
      id: 'gallery-omega-mini',
      imageUrl: '/images/gallery/official_omega_mini_dog.jpg',
      title: 'Fresh Omega-3 Mini',
      category: 'Skin & Heart',
      petType: 'dog'
    },
    {
      id: 'gallery-veggies',
      imageUrl: '/images/gallery/official_veggies_cat.jpg',
      title: 'Freeze-Dried Vegetables',
      category: 'Digestive Fiber',
      petType: 'cat'
    },
    {
      id: 'gallery-clear-eyes',
      imageUrl: '/images/gallery/official_clear_eyes_dog.jpg',
      title: 'Clear Eyes Berry Puree',
      category: 'Tear Stain & Vision',
      petType: 'dog'
    },
    {
      id: 'gallery-dental',
      imageUrl: '/images/gallery/official_dental_chew_dog.jpg',
      title: 'Soft Dental Chew',
      category: 'Oral Health',
      petType: 'dog'
    }
  ],
  productImages: {
    'joint-support-2': '/images/products/joint-support.png',
    'clear-eyes-2': '/images/products/clear-eyes.png',
    'probiotics': '/images/products/probiotics.png',
    'cat-hairball': '/images/products/hairball-care.png',
    'cat-urena-clear': '/images/products/urena-clear.png',
    'fresh-omega-3-mini': '/images/products/fresh-omega-3-mini.png',
    'fresh-omega-3-premium': '/images/products/fresh-omega-3-premium.png',
    'soft-dental-chew': '/images/products/soft-dental-chew.png',
    'freeze-dried-vegetables': '/images/products/freeze-dried-vegetables.png',
    'paju-organic-treats': '/images/products/paju-treats.png'
  }
};
