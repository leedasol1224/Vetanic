import { Product, CategoryInfo } from '../types/product';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'skin-coat',
    name: 'Skin & Coat',
    tagline: 'Lustrous coats & radiant skin support',
    iconName: 'Sparkles',
    relevantProductIds: ['fresh-omega-3-mini', 'fresh-omega-3-premium'],
    description: 'Nourishing essential fatty acids for healthy skin barriers and shiny coats.'
  },
  {
    id: 'digestion',
    name: 'Digestion',
    tagline: 'Gut vitality & optimal nutrient absorption',
    iconName: 'Activity',
    relevantProductIds: ['probiotics'],
    description: 'Support gentle digestion, balanced gut flora, and daily comfort.'
  },
  {
    id: 'eye-care',
    name: 'Eye Care',
    tagline: 'Clear vision & cellular vitality',
    iconName: 'Eye',
    relevantProductIds: ['clear-eyes'],
    description: 'Nutritional support for canine ocular wellness and liver function.'
  },
  {
    id: 'kidney-urinary',
    name: 'Kidney & Urinary',
    tagline: 'Renal & urinary tract wellness for cats',
    iconName: 'Shield',
    relevantProductIds: ['urena-clear'],
    description: 'Specialized feline support for daily urinary and renal balance.'
  },
  {
    id: 'hairball',
    name: 'Hairball Care',
    tagline: 'Smooth gastrointestinal transit for felines',
    iconName: 'Feather',
    relevantProductIds: ['hairball-care'],
    description: 'Gentle fiber balance to support natural hairball passage.'
  },
  {
    id: 'dental',
    name: 'Dental Care',
    tagline: 'Oral hygiene & breath freshness',
    iconName: 'Smile',
    relevantProductIds: ['soft-dental-chew'],
    description: 'Daily gentle chews designed to help maintain clean teeth and gums.'
  },
  {
    id: 'treats',
    name: 'Healthy Treats',
    tagline: 'Wholesome rewards for happy routines',
    iconName: 'Heart',
    relevantProductIds: ['sweet-potato-pumpkin-treats', 'freeze-dried-vegetables'],
    description: 'Nutritious, guilt-free treats formulated with wholesome ingredients.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'fresh-omega-3-mini',
    slug: 'fresh-omega-3-mini',
    name: 'Fresh Omega-3 Mini',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'skin-coat',
    categoryName: 'Skin & Coat',
    shortDescription: 'Skin, coat & circulation',
    packageSize: '151 mg × 60 capsules',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 1,
    featured: true,
    details: {
      keyFeatures: [
        'Pure, fresh Omega-3 tailored for small dogs and cats',
        'Supports radiant skin, coat gloss, and circulation',
        'Convenient mini capsule size for easy administration'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '151 mg × 60 capsules',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'fresh-omega-3-premium',
    slug: 'fresh-omega-3-premium',
    name: 'Fresh Omega-3 Premium',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'skin-coat',
    categoryName: 'Skin & Coat',
    shortDescription: 'Suitable for larger or older pets',
    packageSize: '410 mg × 60 capsules',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 2,
    featured: false,
    details: {
      keyFeatures: [
        'Higher concentration formula for medium-to-large breeds and senior pets',
        'Promotes joint mobility, cardiovascular health, and skin barrier resilience',
        'Rich in pure EPA and DHA fatty acids'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '410 mg × 60 capsules',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'probiotics',
    slug: 'probiotics',
    name: 'Probiotics',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'digestion',
    categoryName: 'Digestion',
    shortDescription: 'Digestion, weight & coat',
    packageSize: '2 g × 30 sticks',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 3,
    featured: true,
    details: {
      keyFeatures: [
        'Multi-strain live probiotics specially formulated for companion animals',
        'Supports stool consistency, gut microbiome balance, and nutrient absorption',
        'Single-serve stick packaging preserves freshness and potency'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '2 g × 30 sticks',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place away from moisture.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'clear-eyes',
    slug: 'clear-eyes',
    name: 'Clear Eyes',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'eye-care',
    categoryName: 'Eye Care',
    shortDescription: 'Eye & liver health',
    packageSize: '10 g × 15 sticks',
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 4,
    featured: false,
    details: {
      keyFeatures: [
        'Formulated specifically for canine eye tear stain management and ocular support',
        'Includes supportive nutrients for canine liver health',
        'Delicious palatable puree stick for effortless feeding'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '10 g × 15 sticks',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'urena-clear',
    slug: 'urena-clear',
    name: 'Urena Clear',
    petType: 'cat',
    petTypeLabel: 'CATS ONLY',
    category: 'kidney-urinary',
    categoryName: 'Kidney & Urinary',
    shortDescription: 'Kidney & urinary health',
    packageSize: '12 g × 15 sticks',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 5,
    featured: true,
    details: {
      keyFeatures: [
        'Tailored renal and urinary tract support designed for cats of all ages',
        'Helps encourage adequate hydration and urinary comfort',
        'Highly palatable squeeze treat format beloved by picky cats'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '12 g × 15 sticks',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place. Refrigerate after opening if unfinished.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'hairball-care',
    slug: 'hairball-care',
    name: 'Hairball Care',
    petType: 'cat',
    petTypeLabel: 'CATS ONLY',
    category: 'hairball',
    categoryName: 'Hairball Care',
    shortDescription: 'Hairball care',
    packageSize: '12 g × 15 sticks',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 6,
    featured: false,
    details: {
      keyFeatures: [
        'Natural dietary fibers to gently facilitate ingested hair through the digestive tract',
        'Helps reduce frequent hairball regurgitation',
        'Soft creamy stick texture for easy daily reward'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '12 g × 15 sticks',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'soft-dental-chew',
    slug: 'soft-dental-chew',
    name: 'Soft Dental Chew',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'dental',
    categoryName: 'Dental Care',
    shortDescription: 'Daily dental care',
    packageSize: '10 g × 30 sticks',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 7,
    featured: true,
    details: {
      keyFeatures: [
        'Specially shaped texture to gently brush teeth during chewing',
        'Soft and pliable structure suitable even for sensitive gums or older dogs',
        'Supports daily breath freshness and oral hygiene'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '10 g × 30 sticks',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place. Reseal bag tightly.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'sweet-potato-pumpkin-treats',
    slug: 'sweet-potato-pumpkin-treats',
    name: 'Sweet Potato & Pumpkin Treats',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'treats',
    categoryName: 'Healthy Treats',
    shortDescription: 'Meat-free soft treats',
    packageSize: '3 g × 30 pieces',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 8,
    featured: false,
    details: {
      keyFeatures: [
        'Wholesome meat-free recipe ideal for dogs with common protein allergies',
        'Soft, bite-sized morsels perfect for daily training or gentle snacking',
        'Naturally rich in vitamins and dietary fiber'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '3 g × 30 pieces',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a cool, dry place away from humidity.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  },
  {
    id: 'freeze-dried-vegetables',
    slug: 'freeze-dried-vegetables',
    name: 'Freeze-Dried Vegetables',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'treats',
    categoryName: 'Healthy Treats',
    shortDescription: 'Low-calorie freeze-dried vegetable treats',
    packageSize: '60 g',
    imageUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    displayOrder: 9,
    featured: false,
    details: {
      keyFeatures: [
        '100% natural vegetables gently freeze-dried to lock in nutrients and aroma',
        'Lightweight, crunchy, and low in calories for guilt-free feeding',
        'Great as a meal topper or light crunch for both dogs and cats'
      ],
      ingredientsPlaceholder: 'Product information to be provided by VETANIC.',
      recommendedUsage: 'Product information to be provided by VETANIC.',
      packageSize: '60 g',
      countryOfOrigin: 'Made in Korea',
      storageInstructions: 'Store in a dry location. Keep container sealed to retain crispness.',
      precautions: 'Product information to be provided by VETANIC.'
    }
  }
];
