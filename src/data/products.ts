import { Product, CategoryInfo } from '../types/product';
import { SEPTEMBER_2026_LAUNCH_PROMOTION } from '../config/promotions';

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
    id: 'joint-care',
    name: 'Joint Support',
    tagline: 'Daily mobility & cartilage comfort',
    iconName: 'Activity',
    relevantProductIds: ['joint-support'],
    description: 'Targeted companion care for smooth mobility and active daily lifestyle.'
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
  // =========================================================================
  // EVERYDAY CARE COLLECTION
  // =========================================================================
  {
    id: 'fresh-omega-3-mini',
    slug: 'fresh-omega-3-mini',
    name: 'Fresh Omega-3 Mini',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'skin-coat',
    categoryName: 'Skin & Coat',
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Skin, coat & circulation',
    packageSize: '151 mg × 60 capsules',
    imageUrl: '/images/products/fresh-omega-3-mini.png',
    galleryImages: [
      '/images/products/fresh-omega-3-mini.png'
    ],
    isAvailable: true,
    displayOrder: 1,
    featured: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'Pure, fresh Omega-3 essential fatty acids tailored for small dogs and cats',
        'Supports radiant skin barrier, lustrous coat gloss, and healthy blood circulation',
        'Convenient mini capsule design for easy, stress-free daily feeding'
      ],
      mainIngredients: ['Refined Fish Oil (EPA & DHA)', 'Vitamin E (d-α-tocopherol)'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Feed whole capsule directly or pierce capsule and drizzle oil over regular food or treats.',
      recommendedDailyAmount: 'Under 5kg: 1 capsule daily. 5–10kg: 2 capsules daily. (Adjust as advised by your veterinarian).',
      suitablePetType: 'Dogs & Cats (Small Breeds & All Companions)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '151 mg × 60 capsules',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Reseal container tightly after each use.',
      precautions: 'For animal consumption only. Consult your veterinarian prior to use if your companion is pregnant, nursing, or undergoing anticoagulant therapy.',
      additionalNotes: 'Crafted with premium refined marine oil adhering to Korean companion animal safety standards.'
    }
  },
  {
    id: 'joint-support',
    slug: 'joint-support',
    name: 'Joint Support',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'joint-care',
    categoryName: 'Joint Support',
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Cartilage comfort & mobility',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/joint-support.png',
    galleryImages: [
      '/images/products/joint-support.png'
    ],
    isAvailable: false, // Marked as Sold Out until changed
    displayOrder: 2,
    featured: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'Targeted joint cartilage and mobility support for canine companions',
        'Helps soothe daily joint stiffness and maintains active, agile movement',
        'Gentle, highly palatable daily powder stick format'
      ],
      mainIngredients: ['Glucosamine HCl', 'MSM (Methylsulfonylmethane)', 'Green Lipped Mussel Powder', 'Chondroitin Sulfate'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Mix 1 stick daily into regular dog food or lukewarm water.',
      recommendedDailyAmount: 'Dogs under 10kg: 1 stick daily. Dogs 10–20kg: 2 sticks daily. Dogs over 20kg: 3 sticks daily.',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'Adult dogs & senior companions',
      packageSize: '2g × 30 sticks',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place. Consume immediately after opening individual stick.',
      precautions: 'Currently sold out. For canine consumption only. If your pet has known shellfish/seafood allergies, consult your veterinarian.',
      additionalNotes: 'Formulated in Korea by Nongshim Banryodaum.'
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
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Ocular wellness & liver care',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/clear-eyes.png',
    galleryImages: [
      '/images/products/clear-eyes.png'
    ],
    isAvailable: true,
    displayOrder: 3,
    featured: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'Canine ocular wellness, tear stain reduction, and antioxidant support',
        'Features lutein, bilberry, and milk thistle for clear vision and liver function',
        'Easy-to-mix powder stick designed for hassle-free daily supplementation'
      ],
      mainIngredients: ['Lutein', 'Bilberry Extract', 'Milk Thistle Extract', 'Vitamin A', 'Astaxanthin'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Sprinkle and mix into daily meals, wet food, or pure water.',
      recommendedDailyAmount: 'Dogs under 10kg: 1 stick daily. Dogs over 10kg: 2 sticks daily.',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '2g × 30 sticks',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from heat and direct sunlight.',
      precautions: 'Formulated specifically for dogs. Keep out of reach of children and animals.',
      additionalNotes: 'Part of the VETANIC Everyday Care range.'
    }
  },

  // =========================================================================
  // WELLNESS SUPPORT COLLECTION
  // =========================================================================
  {
    id: 'probiotics',
    slug: 'probiotics',
    name: 'Probiotics',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'digestion',
    categoryName: 'Digestion',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Gut health & immunity',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/probiotics.png',
    galleryImages: [
      '/images/products/probiotics.png'
    ],
    isAvailable: true,
    displayOrder: 4,
    featured: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'Multi-strain beneficial bacteria to foster a healthy, resilient gut microbiome',
        'Promotes smooth digestion, optimal nutrient absorption, and firmer stools',
        'Supports natural immune defense and digestive comfort for dogs and cats'
      ],
      mainIngredients: ['Patented Multi-strain Probiotics Blend', 'Prebiotics (Fructooligosaccharides)', 'Digestive Enzymes'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Sprinkle over wet or dry food once daily. Do not mix with boiling water.',
      recommendedDailyAmount: 'Pets under 10kg: 1 stick daily. Pets over 10kg: 2 sticks daily.',
      suitablePetType: 'Dogs & Cats',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '2g × 30 sticks',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry environment. Refrigeration helps maintain maximum live bacterial count.',
      precautions: 'Do not expose to high temperatures (above 40°C) before feeding to protect live probiotic cultures.',
      additionalNotes: 'Authentic green Nongshim Banryodaum formulation.'
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
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Smooth hairball passage',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/hairball-care.png',
    galleryImages: [
      '/images/products/hairball-care.png'
    ],
    isAvailable: true,
    displayOrder: 5,
    featured: false,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'Gentle natural dietary fiber formula to facilitate smooth hairball transit through the digestive tract',
        'Helps reduce uncomfortable hairball vomiting and stomach discomfort in felines',
        'High-palatability recipe formulated to appeal to selective feline palates'
      ],
      mainIngredients: ['Dietary Fiber (Psyllium Husk, Beet Pulp)', 'Cat grass extract', 'Prebiotics'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Feed directly as a lickable treat or mix with daily wet/dry cat food.',
      recommendedDailyAmount: '1 stick daily for standard adult cats (under 5kg). 1–2 sticks daily for long-haired cats or during shedding seasons.',
      suitablePetType: 'Cats (Short & Long Hair)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '2g × 30 sticks',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Reseal pouch after use.',
      precautions: 'Exclusively for feline consumption. Always ensure plenty of fresh drinking water is accessible.',
      additionalNotes: 'Part of the VETANIC Feline Wellness Routine.'
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
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Kidney & urinary wellness for cats',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/urena-clear.png',
    galleryImages: [
      '/images/products/urena-clear.png'
    ],
    isAvailable: true,
    displayOrder: 6,
    featured: false,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'Specialized feline renal & urinary tract health support',
        'Helps maintain balanced urinary pH, bladder lining integrity, and hydration',
        'Delicious hydration-friendly puree stick cats readily enjoy'
      ],
      mainIngredients: ['Cranberry Extract', 'D-Mannose', 'N-Acetyl Glucosamine', 'Chitosan'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Feed directly from the stick or blend into meals with a little warm water for extra hydration.',
      recommendedDailyAmount: '1 stick daily for daily maintenance. Up to 2 sticks daily during targeted urinary wellness routines.',
      suitablePetType: 'Cats',
      suitableLifeStage: 'Adult cats & senior felines',
      packageSize: '2g × 30 sticks',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight.',
      precautions: 'Intended as a nutritional wellness supplement, not a medical cure or replacement for prescription renal therapies.',
      additionalNotes: 'Essential hydration support for feline wellness.'
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
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'High-potency skin & coat support',
    packageSize: '500 mg × 60 capsules',
    imageUrl: '/images/products/fresh-omega-3-premium.png',
    galleryImages: [
      '/images/products/fresh-omega-3-premium.png'
    ],
    isAvailable: true,
    displayOrder: 7,
    featured: false,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'High-potency EPA & DHA fatty acids tailored for medium to large companions',
        'Deeply nourishes dry skin, reduces seasonal shedding, and restores coat sheen',
        'Supports cardiovascular, joint comfort, and systemic cellular vitality'
      ],
      mainIngredients: ['High-Concentration Anchovy/Sardine Oil (EPA/DHA)', 'Vitamin E (d-α-tocopherol)'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Administer whole capsule or pierce and mix oil into pet food.',
      recommendedDailyAmount: '10–20kg: 1 capsule daily. Over 20kg: 2 capsules daily.',
      suitablePetType: 'Dogs & Cats (Medium to Large breeds)',
      suitableLifeStage: 'All life stages',
      packageSize: '500 mg × 60 capsules',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry, dark place. Keep container tightly sealed.',
      precautions: 'Consult a veterinarian if your companion is scheduled for surgery or currently taking blood thinners.',
      additionalNotes: 'Premium high-grade purification process.'
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
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Gentle daily oral hygiene chew',
    packageSize: '150g',
    imageUrl: '/images/products/soft-dental-chew.png',
    galleryImages: [
      '/images/products/soft-dental-chew.png'
    ],
    isAvailable: true,
    displayOrder: 8,
    featured: false,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available',
    details: {
      keyBenefits: [
        'Specially engineered ridged texture helps mechanically reduce dental plaque and tartar',
        'Pliable soft chew formulation gentle on teeth and gums for small and aging dogs',
        'Freshens canine breath naturally with botanical parsley and spirulina extracts'
      ],
      mainIngredients: ['Rice Flour', 'Tapioca Starch', 'Parsley Extract', 'Zinc Gluconate', 'Spirulina'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Offer 1 piece daily as a dental reward chew after main meals.',
      recommendedDailyAmount: '1 chew daily. Always supervise your dog while chewing.',
      suitablePetType: 'Dogs',
      suitableLifeStage: 'Adult dogs & puppies with permanent teeth (4+ months)',
      packageSize: '150g',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Seal bag securely after opening. Store in a dry, cool location away from direct sunlight.',
      precautions: 'Not recommended for young puppies under 4 months. Always supervise chewing to prevent swallowing large pieces.',
      additionalNotes: 'Formulated for gentle oral hygiene.'
    }
  },

  // =========================================================================
  // HEALTHY TREATS COLLECTION
  // =========================================================================
  {
    id: 'sweet-potato-pumpkin-treats',
    slug: 'sweet-potato-pumpkin-treats',
    name: 'Sweet Potato & Pumpkin Treats',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'treats',
    categoryName: 'Healthy Treats',
    collection: 'treats',
    collectionName: 'Treats',
    shortDescription: 'Wholesome low-fat reward snacks',
    packageSize: '70g',
    imageUrl: '/images/products/sweet-potato-pumpkin-treats.png',
    galleryImages: [
      '/images/products/sweet-potato-pumpkin-treats.png'
    ],
    isAvailable: true,
    displayOrder: 9,
    featured: false,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['sweet-potato-pumpkin-treats'].regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['sweet-potato-pumpkin-treats'].launchPrice,
    bundleOfferText: 'Bundle discount: 2 for SGD 22.00 · 3 for SGD 31.50',
    details: {
      keyBenefits: [
        'Naturally delicious, low-fat oven-baked reward treat for dogs',
        'Rich in dietary fiber, potassium, and beta-carotene for digestion and vitality',
        'Free from artificial colors, synthetic flavors, and chemical preservatives'
      ],
      mainIngredients: ['Korean Sweet Potato', 'Korean Pumpkin'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Break into smaller pieces for training or serve as a healthy daily snack.',
      recommendedDailyAmount: 'Treats should not exceed 10% of total daily caloric intake.',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '70g',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place. Keep sealed and consume promptly after opening.',
      precautions: 'Provide fresh water at all times. Feed in moderation as part of a balanced diet.',
      additionalNotes: 'Made with 100% wholesome Korean agricultural ingredients.'
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
    collection: 'treats',
    collectionName: 'Treats',
    shortDescription: 'Nutrient-rich freeze-dried toppers',
    packageSize: '50g',
    imageUrl: '/images/products/freeze-dried-vegetables.png',
    galleryImages: [
      '/images/products/freeze-dried-vegetables.png'
    ],
    isAvailable: true,
    displayOrder: 10,
    featured: false,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['freeze-dried-vegetables'].regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['freeze-dried-vegetables'].launchPrice,
    bundleOfferText: 'Bundle discount: 2 for SGD 32.00 · 3 for SGD 45.00',
    details: {
      keyBenefits: [
        'Gentle low-temperature freeze-drying preserves natural vegetable vitamins and micronutrients',
        'Pure, fiber-rich nutritional topper or crispy reward with ultra-low calories',
        'Zero grains, zero fillers, zero artificial additives'
      ],
      mainIngredients: ['Assorted Freeze-Dried Vegetables (Carrot, Broccoli, Pumpkin, Cabbage)'],
      fullIngredients: 'Product information to be provided by VETANIC.',
      feedingUsageGuide: 'Serve as a crunchy snack or rehydrate with warm water as a wholesome meal mixer.',
      recommendedDailyAmount: '1–2 tablespoons daily as a dietary supplement or treat.',
      suitablePetType: 'Dogs & Cats',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '50g',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Keep tightly sealed in moisture-proof packaging away from humid areas.',
      precautions: 'Store in a dry location. Reseal immediately after each use to maintain crisp texture.',
      additionalNotes: 'Ideal fiber booster for companions on specialized diets.'
    }
  }
];
