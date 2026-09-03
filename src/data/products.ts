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
  // EVERYDAY CARE COLLECTION (Tier A)
  // =========================================================================
  {
    id: 'fresh-omega-3-mini',
    sku: 'VET-OMG-MINI',
    slug: 'fresh-omega-3-mini',
    name: 'Fresh Omega-3 Mini',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'skin-coat',
    categoryName: 'Skin & Coat',
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Pure, concentrated Omega-3 marine oil in an easy-to-swallow 1 cm mini capsule.',
    packageSize: '151 mg × 60 capsules',
    imageUrl: '/images/products/fresh-omega-3-mini.png',
    galleryImages: [
      '/images/products/fresh-omega-3-mini.png'
    ],
    isAvailable: true,
    displayOrder: 1,
    featured: true,
    initialStock: 40,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice,
    bundleOfferText: 'Mix & Match available in Everyday Care',
    details: {
      keyBenefits: [
        'Skin & Coat Support',
        'Dogs + Cats',
        '1 cm Mini Capsule',
        'Individual Blister Pack'
      ],
      recommendedFor: [
        'Small dogs and cats needing skin barrier and coat nourishment',
        'Pets experiencing seasonal shedding or dull, dry fur',
        'Companions that resist large or pungent oil capsules'
      ],
      mainIngredients: ['Refined Fish Oil (EPA 55 mg + DHA 35 mg)', 'Vitamin E (d-α-tocopherol)'],
      keyIngredients: ['Refined Fish Oil (EPA 55 mg + DHA 35 mg)', 'Vitamin E (d-α-tocopherol)'],
      fullIngredients: 'High-Purity Refined Fish Oil (Anchovy, Sardine), D-Alpha-Tocopherol (Vitamin E), Gelatin (capsule shell), Glycerin.',
      howToFeed: 'Feed whole capsule directly by hand, hide inside favourite treats, or snip the tip of the capsule and drizzle the pure oil directly over food.',
      feedingUsageGuide: 'Feed whole capsule directly or pierce tip and mix oil into daily meals.',
      recommendedDailyAmount: 'Under 5kg: 1 capsule daily · 5–10kg: 2 capsules daily · Over 10kg: 2–3 capsules daily (or switch to Fresh Omega-3 Premium).',
      suitablePetType: 'Dogs & Cats (Small Breeds & All Companions)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '151 mg × 60 capsules (Blister Pack)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store at room temperature in a cool, dry place away from heat and direct sunlight. Keep capsules sealed in blister pack until use.',
      storage: 'Store in a cool, dry place away from direct sunlight.',
      precautions: [
        'For animal companion consumption only.',
        'If your pet is pregnant, nursing, or undergoing anticoagulant therapy, consult your veterinarian prior to use.'
      ],
      productFaq: [
        {
          question: 'Can I pierce the capsule if my pet refuses whole pills?',
          answer: 'Yes! The mini capsule is easy to snip or pierce with a clean pin, allowing you to drizzle the fresh, odourless oil directly onto kibble, wet food, or treats.'
        }
      ]
    }
  },
  {
    id: 'joint-support',
    sku: 'VET-JNT-SUPP',
    slug: 'joint-support',
    name: 'Joint Support',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'joint-care',
    categoryName: 'Joint Support',
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Targeted daily mobility and cartilage comfort support for canine companions.',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/joint-support.png',
    galleryImages: [
      '/images/products/joint-support.png'
    ],
    isAvailable: false, // Marked as Sold Out
    displayOrder: 2,
    featured: true,
    initialStock: 0,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice,
    bundleOfferText: 'Mix & Match available in Everyday Care',
    details: {
      keyBenefits: [
        'Cartilage Support',
        'Daily Mobility',
        'Glucosamine & Green Mussel',
        'Dogs Only'
      ],
      recommendedFor: [
        'Senior dogs or breeds prone to hip and joint stiffness',
        'Active, agile dogs needing daily cartilage maintenance',
        'Dogs showing hesitation when climbing stairs or standing up'
      ],
      mainIngredients: ['Glucosamine HCl', 'MSM (Methylsulfonylmethane)', 'Green Lipped Mussel Powder', 'Chondroitin Sulfate'],
      keyIngredients: ['Glucosamine HCl', 'MSM (Methylsulfonylmethane)', 'Green Lipped Mussel Powder', 'Chondroitin Sulfate', 'Boswellia Extract'],
      fullIngredients: 'Glucosamine Hydrochloride, Methylsulfonylmethane (MSM), New Zealand Green Lipped Mussel Powder, Chondroitin Sulfate (Bovine), Boswellia Serrata Extract, Natural Palatability Enhancer.',
      howToFeed: 'Tear open 1 stick daily and mix into regular dry food, wet food, or lukewarm water.',
      feedingUsageGuide: 'Mix 1 stick daily into regular dog food or lukewarm water.',
      recommendedDailyAmount: 'Under 10kg: 1 stick daily · 10–20kg: 2 sticks daily · Over 20kg: 3 sticks daily.',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'Adult dogs & senior companions (3+ months)',
      packageSize: '2g × 30 sticks (60g)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from moisture. Consume immediately after opening individual stick.',
      storage: 'Store in a cool, dry place. Keep sticks sealed.',
      precautions: [
        'Currently sold out.',
        'Formulated specifically for dogs. Contains shellfish derivatives (green-lipped mussel). Consult your veterinarian if your pet has known seafood allergies.'
      ],
      productFaq: [
        {
          question: 'When will Joint Support be restocked in Singapore?',
          answer: 'We are currently preparing our next fresh batch from Korea. Please stay tuned on our Instagram @vetanic.sg for restock announcements.'
        }
      ]
    }
  },
  {
    id: 'clear-eyes',
    sku: 'VET-EYE-CLR',
    slug: 'clear-eyes',
    name: 'Clear Eyes',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'eye-care',
    categoryName: 'Eye Care',
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Targeted nutritional support for canine ocular wellness, tear stain care, and liver vitality.',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/clear-eyes.png',
    galleryImages: [
      '/images/products/clear-eyes.png'
    ],
    isAvailable: true,
    displayOrder: 3,
    featured: true,
    initialStock: 28,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.everydayCare.launchPrice,
    bundleOfferText: 'Mix & Match available in Everyday Care',
    details: {
      keyBenefits: [
        'Ocular Wellness',
        'Tear Stain Support',
        'FloraGLO Lutein & Bilberry',
        'Palatable Powder Stick'
      ],
      recommendedFor: [
        'Dogs with excessive tearing or noticeable tear stains',
        'Breeds prone to eye dryness and lens cloudiness',
        'Aging dogs needing daily antioxidant and liver vitality support'
      ],
      mainIngredients: ['FloraGLO Lutein', 'Bilberry Extract', 'Milk Thistle Extract (Silymarin)', 'Vitamin A', 'Astaxanthin'],
      keyIngredients: ['FloraGLO Lutein', 'Bilberry Extract (Anthocyanins)', 'Milk Thistle Extract (Silymarin)', 'Astaxanthin', 'Vitamin A', 'Taurine'],
      fullIngredients: 'FloraGLO Lutein Powder, Bilberry Extract, Milk Thistle Extract (Silymarin), Astaxanthin Powder, Vitamin A Acetate, Taurine, Natural Palatability Enhancer.',
      howToFeed: 'Sprinkle and mix 1 individual stick into daily meals, wet food, or pure drinking water.',
      feedingUsageGuide: 'Sprinkle and mix into daily meals, wet food, or pure water.',
      recommendedDailyAmount: 'Dogs under 10kg: 1 stick daily · Dogs over 10kg: 2 sticks daily.',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '2g × 30 sticks (60g)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from heat and direct sunlight. Keep stick sealed until use.',
      storage: 'Store in a cool, dry place away from direct sunlight.',
      precautions: [
        'Formulated specifically for canine companions.',
        'Keep out of reach of children and other animals.'
      ]
    }
  },

  // =========================================================================
  // WELLNESS SUPPORT COLLECTION (Tier B)
  // =========================================================================
  {
    id: 'probiotics',
    sku: 'VET-PRO-GUT',
    slug: 'probiotics',
    name: 'Probiotics',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'digestion',
    categoryName: 'Digestion',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Multi-strain beneficial cultures and prebiotics to support a balanced gut microbiome and firm stools.',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/probiotics.png',
    galleryImages: [
      '/images/products/probiotics.png'
    ],
    isAvailable: true,
    displayOrder: 4,
    featured: true,
    initialStock: 45,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available in Wellness Support',
    details: {
      keyBenefits: [
        'Gut Microbiome Balance',
        'Firm Stools Support',
        'Patented Live Strains',
        'Dogs + Cats'
      ],
      recommendedFor: [
        'Dogs and cats with sensitive stomachs or irregular, loose stools',
        'Pets transitioning to new food or recovering from digestive stress',
        'Companions needing daily digestive comfort and natural immunity support'
      ],
      mainIngredients: ['Patented Multi-strain Probiotics Blend', 'Prebiotics (FOS)', 'Digestive Enzymes'],
      keyIngredients: ['Multi-strain Probiotics (L. acidophilus, B. animalis, E. faecium)', 'Fructooligosaccharides (FOS)', 'Digestive Enzymes (Amylase, Protease)'],
      fullIngredients: 'Probiotic Culture Blend (10+ billion CFU input), Fructooligosaccharides (FOS), Chicory Root Inulin, Digestive Enzymes, Natural Flavoring.',
      howToFeed: 'Sprinkle over room-temperature wet or dry food once daily. Do not mix with boiling water to protect live probiotic cultures.',
      feedingUsageGuide: 'Sprinkle over wet or dry food once daily. Avoid hot liquids above 40°C.',
      recommendedDailyAmount: 'Pets under 10kg: 1 stick daily · Pets over 10kg: 2 sticks daily.',
      suitablePetType: 'Dogs & Cats',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '2g × 30 sticks (60g)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place. Refrigeration during hot humid weather helps maintain maximum live bacterial count.',
      storage: 'Store in a cool, dry place. Refrigeration optional.',
      precautions: [
        'Do not mix with foods or liquids hotter than 40°C to preserve live probiotic strains.'
      ]
    }
  },
  {
    id: 'hairball-care',
    sku: 'VET-CAT-HAIR',
    slug: 'hairball-care',
    name: 'Hairball Care',
    petType: 'cat',
    petTypeLabel: 'CATS ONLY',
    category: 'hairball',
    categoryName: 'Hairball Care',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Gentle natural dietary fiber formula to support smooth hairball passage and digestive comfort in cats.',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/hairball-care.png',
    galleryImages: [
      '/images/products/hairball-care.png'
    ],
    isAvailable: true,
    displayOrder: 5,
    featured: false,
    initialStock: 25,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available in Wellness Support',
    details: {
      keyBenefits: [
        'Smooth Hairball Passage',
        'Gentle Dietary Fiber',
        'Digestive Comfort',
        'Cats Only'
      ],
      recommendedFor: [
        'Indoor cats experiencing frequent hairball regurgitation',
        'Medium and long-haired cat breeds (Persian, Ragdoll, British Longhair, etc.)',
        'Cats during seasonal coat shedding periods'
      ],
      mainIngredients: ['Psyllium Husk Dietary Fiber', 'Beet Pulp Fiber', 'Cat Grass Extract', 'Prebiotics'],
      keyIngredients: ['Psyllium Husk Powder', 'Beet Pulp Fiber', 'Cat Grass (Wheatgrass) Extract', 'FOS Prebiotics', 'Taurine'],
      fullIngredients: 'Psyllium Husk Dietary Fiber, Sugar Beet Fiber, Wheatgrass/Cat Grass Extract, Fructooligosaccharides (FOS), Taurine, Natural Palatability Broth.',
      howToFeed: 'Feed directly as a lickable treat stick or blend into daily wet/dry cat food.',
      feedingUsageGuide: 'Feed directly or mix with daily wet/dry cat food.',
      recommendedDailyAmount: 'Standard adult cats (under 5kg): 1 stick daily · Long-haired cats or shedding season: 1–2 sticks daily.',
      suitablePetType: 'Cats (Short & Long Hair)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '2g × 30 sticks (60g)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Reseal pouch after opening.',
      storage: 'Store in a cool, dry place.',
      precautions: [
        'Exclusively formulated for feline companions.',
        'Always ensure fresh drinking water is readily available.'
      ]
    }
  },
  {
    id: 'urena-clear',
    sku: 'VET-CAT-UREN',
    slug: 'urena-clear',
    name: 'Urena Clear',
    petType: 'cat',
    petTypeLabel: 'CATS ONLY',
    category: 'kidney-urinary',
    categoryName: 'Kidney & Urinary',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Targeted nutritional support for feline urinary tract integrity, bladder comfort, and healthy hydration.',
    packageSize: '2g × 30 sticks',
    imageUrl: '/images/products/urena-clear.png',
    galleryImages: [
      '/images/products/urena-clear.png'
    ],
    isAvailable: true,
    displayOrder: 6,
    featured: false,
    initialStock: 20,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available in Wellness Support',
    details: {
      keyBenefits: [
        'Urinary Tract Wellness',
        'Bladder Lining Support',
        'Cranberry & D-Mannose',
        'Hydration Friendly'
      ],
      recommendedFor: [
        'Cats needing daily urinary tract and bladder wellness support',
        'Felines with low water intake or stress-related urinary sensitivity',
        'Adult and senior cats'
      ],
      mainIngredients: ['Cranberry Extract', 'D-Mannose', 'N-Acetyl Glucosamine (NAG)', 'Chitosan'],
      keyIngredients: ['Cranberry Extract (PACs)', 'D-Mannose', 'N-Acetyl Glucosamine (NAG)', 'Potassium Citrate', 'Chitosan', 'L-Theanine'],
      fullIngredients: 'Cranberry Extract Powder, D-Mannose, N-Acetyl Glucosamine, Potassium Citrate, Chitosan, L-Theanine, Natural Broth Extract.',
      howToFeed: 'Feed directly from the stick or blend into wet meals with 10–20 ml of warm water as a nourishing hydration drink.',
      feedingUsageGuide: 'Feed directly or mix into meals with warm water for extra hydration.',
      recommendedDailyAmount: 'Daily wellness support: 1 stick daily · Intensive hydration routine: Up to 2 sticks daily.',
      suitablePetType: 'Cats',
      suitableLifeStage: 'Adult cats & senior felines (3+ months)',
      packageSize: '2g × 30 sticks (60g)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from heat and direct sunlight.',
      storage: 'Store in a cool, dry place away from direct sunlight.',
      precautions: [
        'Intended as a nutritional wellness supplement, not a cure or replacement for emergency veterinary renal therapies.',
        'If your cat shows acute signs of urinary blockage (straining, crying in litter box), seek immediate veterinary care.'
      ]
    }
  },
  {
    id: 'fresh-omega-3-premium',
    sku: 'VET-OMG-PREM',
    slug: 'fresh-omega-3-premium',
    name: 'Fresh Omega-3 Premium',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'skin-coat',
    categoryName: 'Skin & Coat',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'High-potency Omega-3 essential fatty acids tailored for medium and large companions.',
    packageSize: '500 mg × 60 capsules',
    imageUrl: '/images/products/fresh-omega-3-premium.png',
    galleryImages: [
      '/images/products/fresh-omega-3-premium.png'
    ],
    isAvailable: true,
    displayOrder: 7,
    featured: false,
    initialStock: 30,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available in Wellness Support',
    details: {
      keyBenefits: [
        'High-Potency EPA & DHA',
        'Medium & Large Pets',
        'Skin Barrier Support',
        'Pure Marine Oil'
      ],
      recommendedFor: [
        'Medium and large dogs requiring higher daily EPA/DHA intake',
        'Pets needing joint mobility and systemic cellular vitality support',
        'Companions with dry, itchy skin or lacklustre coat'
      ],
      mainIngredients: ['Refined Marine Fish Oil (EPA 180 mg + DHA 120 mg)', 'Vitamin E (d-α-tocopherol)'],
      keyIngredients: ['High-Concentration Anchovy & Sardine Oil (EPA 180 mg + DHA 120 mg)', 'Vitamin E (d-α-tocopherol)'],
      fullIngredients: 'High-Purity Refined Fish Oil (Anchovy, Sardine), D-Alpha-Tocopherol (Vitamin E), Gelatin (capsule shell), Glycerin.',
      howToFeed: 'Administer whole capsule with meals, or pierce tip and mix oil directly into kibble or wet food.',
      feedingUsageGuide: 'Administer whole capsule with meals, or pierce and mix oil into pet food.',
      recommendedDailyAmount: '10–20kg: 1 capsule daily · 20–30kg: 2 capsules daily · Over 30kg: 2–3 capsules daily.',
      suitablePetType: 'Dogs & Cats (Medium to Large breeds)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '500 mg × 60 capsules (Blister Pack)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry, dark location away from heat and moisture. Keep capsules in blister pack until consumed.',
      storage: 'Store in a cool, dry, dark place.',
      precautions: [
        'For animal companion consumption only.',
        'Consult your veterinarian if your companion is scheduled for surgery or taking blood-thinning medications.'
      ]
    }
  },
  {
    id: 'soft-dental-chew',
    sku: 'VET-DNT-CHEW',
    slug: 'soft-dental-chew',
    name: 'Soft Dental Chew (Yogurt Flavor)',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'dental',
    categoryName: 'Dental Care',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Pliable, gentle yogurt-flavored dental chew jointly developed with veterinarians for daily canine plaque care.',
    packageSize: '300g (10g × 30 sticks)',
    imageUrl: '/images/products/soft-dental-chew.png',
    galleryImages: [
      '/images/products/soft-dental-chew/pack.jpg'
    ],
    isAvailable: true,
    displayOrder: 8,
    featured: false,
    initialStock: 35,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.wellnessSupport.launchPrice,
    bundleOfferText: 'Mix & Match available in Wellness Support',
    details: {
      keyBenefits: [
        'Plaque & Tartar Care',
        'Yogurt Flavor Palatability',
        'Vet Co-Developed',
        'Soft Pliable Texture'
      ],
      recommendedFor: [
        'Dogs of all sizes needing daily oral hygiene and breath freshness',
        'Small dogs and senior companions needing gentle, gum-friendly soft chews',
        'Dogs that reject hard, unpalatable dental bones'
      ],
      mainIngredients: ['Yogurt Flavor Ferment', 'Antioxidant Oral Complex', 'Zinc Gluconate', 'Rice Flour', 'SHMP'],
      keyIngredients: ['Yogurt Ferment / Flavor', 'Antioxidant & Oral Health Complex', 'Zinc Gluconate', 'Sodium Hexametaphosphate (SHMP)', 'Rice Flour'],
      fullIngredients: 'Rice Flour, Tapioca Starch, Vegetable Glycerin, Natural Yogurt Flavor, Antioxidant Oral Health Complex, Zinc Gluconate, Sodium Hexametaphosphate (SHMP), Spirulina, Natural Rosemary Extract. HACCP Certified.',
      howToFeed: 'Offer 1 chew stick daily after main meals as a delicious, supervised oral care routine.',
      feedingUsageGuide: 'Offer 1 stick daily as a supervised dental chew after main meals.',
      recommendedDailyAmount: 'Small dogs (under 10kg): 1 stick daily · Dogs 10–20kg: 1–2 sticks daily · Dogs over 20kg: 2 sticks daily.',
      suitablePetType: 'Dogs',
      suitableLifeStage: 'Adult dogs & puppies with permanent teeth (4+ months)',
      packageSize: '300g (10g × 30 individual sticks)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Reseal packaging securely after each use.',
      storage: 'Reseal box and pouch securely. Store in a dry, cool location.',
      precautions: [
        'Not recommended for young puppies under 4 months.',
        'Always supervise chewing to ensure your dog does not gulp large unchewed pieces.'
      ]
    }
  },

  // =========================================================================
  // HEALTHY TREATS COLLECTION
  // =========================================================================
  {
    id: 'sweet-potato-pumpkin-treats',
    sku: 'VET-TRT-PUMP',
    slug: 'sweet-potato-pumpkin-treats',
    name: "Paju's Sweet Potato & Pumpkin Treats",
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'treats',
    categoryName: 'Healthy Treats',
    collection: 'treats',
    collectionName: 'Treats',
    shortDescription: 'Naturally delicious, meat-free oven-baked reward snacks made with 100% Korean agricultural produce from Paju.',
    packageSize: '90g',
    imageUrl: '/images/products/sweet-potato-pumpkin-treats.png',
    galleryImages: [
      '/images/products/sweet-potato-pumpkin/pack.jpg',
      '/images/products/sweet-potato-pumpkin/maltese.jpg',
      '/images/products/sweet-potato-pumpkin/ingredients_scene.jpg',
      '/images/products/sweet-potato-pumpkin/feeding_paw.jpg',
      '/images/products/sweet-potato-pumpkin/labrador.jpg'
    ],
    isAvailable: true,
    displayOrder: 9,
    featured: false,
    initialStock: 50,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['sweet-potato-pumpkin-treats'].regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['sweet-potato-pumpkin-treats'].launchPrice,
    bundleOfferText: 'Bundle discount: 2 for SGD 22.00 · 3 for SGD 31.50',
    details: {
      keyBenefits: [
        'Meat-Free Recipe',
        '100% Paju Korean Produce',
        'Prebiotics (FOS) Digestion',
        'HACCP Certified Quality'
      ],
      recommendedFor: [
        'Dogs needing gentle meat-free treats or low-fat wholesome rewards',
        'Companions benefiting from dietary fiber and gut health support (FOS)',
        'Daily positive training rewards and soft, chewable snacks'
      ],
      mainIngredients: ['Paju Korean Sweet Potato', 'Paju Korean Pumpkin', 'Fructooligosaccharides (FOS)'],
      keyIngredients: ['Paju Korean Sweet Potato', 'Paju Korean Pumpkin', 'Fructooligosaccharides (FOS)'],
      fullIngredients: 'Korean Sweet Potato (Paju grown), Korean Pumpkin (Paju grown), Fructooligosaccharides (FOS), Vegetable Glycerin, Natural Palatability Enhancer. Meat-free formula. No artificial coloring, synthetic flavors, added sugar, salt, or chemical preservatives.',
      howToFeed: 'Break into smaller bite-sized pieces for training, or feed whole as a wholesome, soft chewy reward.',
      feedingUsageGuide: 'Break into smaller pieces for training or serve whole as a healthy daily reward.',
      recommendedDailyAmount: 'Small dogs (under 5kg): 1–2 pieces daily · Medium dogs (5–15kg): 2–4 pieces daily · Large dogs (>15kg): 4–6 pieces daily. (Treats should not exceed 10% of daily caloric intake).',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '90g (Resealable zipper pouch)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place. Reseal the airtight zipper pouch tightly after opening to preserve freshness and softness.',
      storage: 'Store in a cool, dry place. Reseal zipper pouch tightly.',
      precautions: [
        'Provide fresh drinking water at all times.',
        'Feed in moderation as part of a balanced daily diet.'
      ]
    }
  },
  {
    id: 'freeze-dried-vegetables',
    sku: 'VET-TRT-VEG',
    slug: 'freeze-dried-vegetables',
    name: '100% Korean Freeze-Dried Vegetables',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'treats',
    categoryName: 'Healthy Treats',
    collection: 'treats',
    collectionName: 'Treats',
    shortDescription: 'Nutrient-rich, low-calorie 4-veggie topper crafted with 100% Korean-grown agricultural produce.',
    packageSize: '60g',
    imageUrl: '/images/products/freeze-dried-vegetables.png',
    galleryImages: [
      '/images/products/freeze-dried-vegetables/pack.png',
      '/images/products/freeze-dried-vegetables/cutting_board_scene.jpg',
      '/images/products/freeze-dried-vegetables/plate_scene.jpg',
      '/images/products/freeze-dried-vegetables/picking_cube.jpg'
    ],
    isAvailable: true,
    displayOrder: 10,
    featured: false,
    initialStock: 40,
    lowStockThreshold: 5,
    trackInventory: true,
    regularPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['freeze-dried-vegetables'].regularPrice,
    launchPrice: SEPTEMBER_2026_LAUNCH_PROMOTION.treats['freeze-dried-vegetables'].launchPrice,
    bundleOfferText: 'Bundle discount: 2 for SGD 32.00 · 3 for SGD 45.00',
    details: {
      keyBenefits: [
        '100% Korean Farm Produce',
        'Freeze-Dried 4-Veggie Mix',
        'Pure Dietary Fiber Topper',
        'HACCP Certified Quality'
      ],
      recommendedFor: [
        'Dogs and cats benefiting from extra natural dietary fiber and micronutrients',
        'Pets on weight-management diets seeking ultra-low-calorie crunchy treats',
        'Selective eaters that enjoy colorful garden aroma and texture over kibble'
      ],
      mainIngredients: ['Korean Sweet Potato', 'Korean Pumpkin', 'Korean Cabbage', 'Korean Purple Sweet Potato'],
      keyIngredients: ['100% Korean Sweet Potato', '100% Korean Pumpkin', '100% Korean Cabbage', '100% Korean Purple Sweet Potato'],
      fullIngredients: '100% Freeze-Dried Korean Produce: Korean Sweet Potato, Korean Pumpkin, Korean Cabbage, Korean Purple Sweet Potato. 100% plant-based, zero meat, zero grains, zero artificial additives, zero preservatives.',
      howToFeed: 'Sprinkle crispy cubes directly over kibble or wet food as a topper, or rehydrate in warm water for 1–2 minutes into a soft vegetable puree mixer.',
      feedingUsageGuide: 'Serve as a crunchy meal topper or rehydrate with warm water as a wholesome mixer.',
      recommendedDailyAmount: 'Small pets (under 5kg): 1–2 teaspoons (3–5 cubes) daily · Medium pets (5–15kg): 1–2 tablespoons (6–10 cubes) daily · Large pets (>15kg): 2–3 tablespoons (11–15 cubes) daily.',
      suitablePetType: 'Dogs & Cats',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '60g (Clear airtight jar)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Keep tightly sealed in moisture-proof container away from humid areas. Reseal immediately after each use to maintain crisp texture.',
      storage: 'Store in a dry location. Reseal jar lid immediately.',
      precautions: [
        'Store in a dry location. Reseal immediately after each use to maintain crisp texture.'
      ]
    }
  }
];
