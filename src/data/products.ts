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
    shortDescription: 'Pure, German KD Pharma rTG Omega-3 oil (119.5mg EPA+DHA) in an easy-to-swallow 1.0 cm mini capsule.',
    packageSize: '9.06g (151mg × 60 capsules)',
    imageUrl: '/images/products/fresh-omega-3-mini.png',
    galleryImages: [
      '/images/products/fresh-omega-3-mini/pack_blister.jpg',
      '/images/products/fresh-omega-3-mini/lifestyle_blue.jpg'
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
        '119.5mg EPA+DHA (>80% rTG)',
        'German KD Pharma Oil',
        '1.0 cm Mini Capsule',
        'Individual Blister Pack'
      ],
      recommendedFor: [
        'Small dogs and cats needing skin barrier and coat nourishment',
        'Pets experiencing seasonal shedding or dull, dry fur',
        'Companions that resist large or pungent oil capsules'
      ],
      mainIngredients: ['German KD Pharma rTG Fish Oil (EPA+DHA 119.5mg)', 'Vitamin A', 'Vitamin E (d-α-tocopherol)'],
      keyIngredients: ['German KD Pharma rTG Fish Oil (EPA+DHA 119.5mg)', 'Vitamin A', 'Vitamin E (d-α-tocopherol)'],
      fullIngredients: 'High-Purity German KD Pharma rTG Refined Fish Oil (EPA + DHA 119.5mg per 151mg capsule, >80% rTG purity), Retinyl Palmitate (Vitamin A), D-Alpha-Tocopherol (Vitamin E), Gelatin (capsule shell), Glycerin.',
      howToFeed: 'Feed whole capsule directly by hand, hide inside favourite treats, or snip the tip of the capsule and drizzle the pure oil directly over food.',
      feedingUsageGuide: 'Feed whole capsule directly or pierce tip and mix oil into daily meals.',
      recommendedDailyAmount: 'Under 5kg: 1 capsule daily · 5–10kg: 2 capsules daily · Over 10kg: 2–3 capsules daily (or switch to Fresh Omega-3 Premium).',
      suitablePetType: 'Dogs & Cats (Small Breeds & All Companions)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '9.06g (151 mg × 60 capsules in individual blister pack)',
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
          answer: 'Yes! The 1cm mini capsule is easy to snip or pierce with a clean pin, allowing you to drizzle the fresh, odourless oil directly onto kibble, wet food, or treats.'
        }
      ]
    }
  },
  {
    id: 'joint-support',
    sku: 'VET-JNT-SUPP',
    slug: 'joint-support',
    name: 'Joint Support ver 2.0',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'joint-care',
    categoryName: 'Joint Support',
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Meat-free sweet potato puree formula with Boswellia, OptiMSM, Lilium extract, and NAG for dual joint & cartilage care in dogs.',
    packageSize: '150g (10g × 15 sticks)',
    imageUrl: '/images/products/joint-support.png',
    galleryImages: [
      '/images/products/joint-support/pack_poodle.jpg',
      '/images/products/joint-support/box_red_stage.jpg',
      '/images/products/joint-support/box_side_pillars.jpg',
      '/images/products/joint-support/dog_licking.jpg',
      '/images/products/joint-support/stick_detail.jpg'
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
        'Boswellia & OptiMSM',
        'Lilium Extract 50mg',
        'NAG & CoQ10 20mg',
        'Vet Co-Developed Puree'
      ],
      recommendedFor: [
        'Dogs of all breeds needing daily joint mobility and cartilage maintenance',
        'Senior companions experiencing hip stiffness or hesitation on stairs',
        'Dogs that love lickable puree treat sticks (meat-free, sweet potato base)'
      ],
      mainIngredients: ['Lilium Bulb Extract (50mg)', 'Boswellia Flexir (20mg)', 'OptiMSM (20mg)', 'N-Acetyl Glucosamine NAG (10mg)', 'CoQ10 & Vitamin C (20mg)'],
      keyIngredients: ['Lilium Lancifolium Bulb Extract (50mg)', 'Boswellia Flexir Complex (20mg)', 'OptiMSM (20mg)', 'N-Acetyl Glucosamine (10mg)', 'C-Fence Vitamin C (10mg)', 'Coenzyme Q10 (10mg)'],
      fullIngredients: 'Korean Sweet Potato Puree, Purified Water, Lilium Lancifolium Bulb Extract (50mg per stick), Boswellia Flexir Complex (20mg per stick), OptiMSM (20mg per stick), N-Acetyl Glucosamine (NAG 10mg per stick), C-Fence Vitamin C (10mg per stick), Coenzyme Q10 (10mg per stick), Natural Yeast & Amino Acid Savory Flavor, Tapioca Starch. Meat-free formula. HACCP Certified.',
      howToFeed: 'Feed directly as a lickable puree treat stick from hand, or blend into meals or water.',
      feedingUsageGuide: 'Feed directly from the stick or mix into regular dog food.',
      recommendedDailyAmount: 'Dogs under 5kg: 1 stick daily · Dogs 5–15kg: 1–2 sticks daily · Dogs over 15kg: 2–3 sticks daily.',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'Adult dogs & senior companions (3+ months)',
      packageSize: '150g (10g × 15 liquid puree sticks)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from heat and direct sunlight. Feed individual stick immediately after opening.',
      storage: 'Store in a cool, dry place. Feed stick immediately after opening.',
      precautions: [
        'Currently sold out.',
        'Formulated specifically for dogs. Meat-free sweet potato recipe with natural yeast savory flavor.'
      ],
      productFaq: [
        {
          question: 'When will Joint Support ver 2.0 be restocked in Singapore?',
          answer: 'We are currently preparing our next fresh batch from Korea. Please stay tuned on our Instagram @vetanic.sg for restock announcements.'
        }
      ]
    }
  },
  {
    id: 'clear-eyes',
    sku: 'VET-EYE-CLR',
    slug: 'clear-eyes',
    name: 'Clear Eyes ver 2.0',
    petType: 'dog',
    petTypeLabel: 'DOG ONLY',
    category: 'eye-care',
    categoryName: 'Eye Care',
    collection: 'everyday-care',
    collectionName: 'Everyday Care',
    shortDescription: 'Meat-free sweet potato puree formula with Marigold Lutein, Honeyberry, Milk Thistle, and Bilberry for dual eye & liver care in dogs.',
    packageSize: '150g (10g × 15 sticks)',
    imageUrl: '/images/products/clear-eyes.png',
    galleryImages: [
      '/images/products/clear-eyes/pack_poodle.jpg',
      '/images/products/clear-eyes/lab_science.jpg',
      '/images/products/clear-eyes/box_side_pillars.jpg',
      '/images/products/clear-eyes/dog_papillon_licking.jpg',
      '/images/products/clear-eyes/dog_brown_licking.jpg'
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
        'Marigold Lutein 20mg',
        'Honeyberry Extract 50mg',
        'Milk Thistle & Bilberry',
        'AstaPure Astaxanthin'
      ],
      recommendedFor: [
        'Dogs with excessive tearing, tear stains, or cloudy lenses',
        'Breeds prone to ocular sensitivity and aging dogs needing liver antioxidant care',
        'Companions that enjoy delicious lickable puree treat sticks (sweet potato base)'
      ],
      mainIngredients: ['Honeyberries Extract (50mg)', 'Marigold Lutein (20mg)', 'Milk Thistle Silymarin (20mg)', 'Bilberry Extract (20mg)', 'AstaPure Astaxanthin & Vitamin C (20mg)'],
      keyIngredients: ['Honeyberries (Hascap) Extract (50mg)', 'Marigold Flower Extract [Lutein] (20mg)', 'Milk Thistle Extract [Silymarin] (20mg)', 'Bilberry Extract (20mg)', 'AstaPure Haematococcus Extract [Astaxanthin] (10mg)', 'C-Fence Vitamin C (10mg)'],
      fullIngredients: 'Korean Sweet Potato Puree, Purified Water, Honeyberries (Hascap) Extract (50mg per stick), Marigold Flower Extract [Lutein] (20mg per stick), Milk Thistle Extract (20mg per stick), Bilberry Extract (20mg per stick), AstaPure Haematococcus Extract [Astaxanthin] (10mg per stick), C-Fence Vitamin C (10mg per stick), Natural Yeast & Amino Acid Savory Flavor, Tapioca Starch. Meat-free formula. HACCP Certified.',
      howToFeed: 'Feed directly as a lickable puree treat stick from hand, or blend into daily dog meals.',
      feedingUsageGuide: 'Feed directly from the stick or mix into regular food.',
      recommendedDailyAmount: 'Dogs under 5kg: 1 stick daily · Dogs 5–15kg: 1–2 sticks daily · Dogs over 15kg: 2–3 sticks daily.',
      suitablePetType: 'Dogs (All breeds)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '150g (10g × 15 liquid puree sticks)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from heat and direct sunlight. Feed individual stick immediately after opening.',
      storage: 'Store in a cool, dry place away from direct sunlight.',
      precautions: [
        'Formulated specifically for canine companions.',
        'Meat-free sweet potato recipe with savory yeast aroma.'
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
    name: 'Probiotics for Dogs & Cats',
    petType: 'both',
    petTypeLabel: 'DOG + CAT',
    category: 'digestion',
    categoryName: 'Digestion',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: '11 patented probiotic strains (10 Billion CFU input) with prebiotics and digestive enzymes for companion gut & coat wellness.',
    packageSize: '60g (2g × 30 sticks)',
    imageUrl: '/images/products/probiotics.png',
    galleryImages: [
      '/images/products/probiotics/pack_duo.jpg',
      '/images/products/probiotics/box_spoon_powder.jpg',
      '/images/products/probiotics/box_side_strains.jpg',
      '/images/products/probiotics/dog_bichon_eating.jpg'
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
        '10 Billion CFU Input',
        '11 Patented Strains',
        'Rosell Micro-Encapsulated',
        'Dogs + Cats Dual Care'
      ],
      recommendedFor: [
        'Dogs and cats with sensitive stomachs, irregular or loose stools, and gas',
        'Pets needing daily gut microbiome balance, natural immunity, and coat luster',
        'Companions transitioning to new diets or recovering from digestive stress'
      ],
      mainIngredients: ['11 Patented Multi-Strain Probiotics (10 Billion CFU Input)', 'Prebiotics (FOS & Inulin)', 'Digestive Enzymes', 'Hypet Coat Strains'],
      keyIngredients: ['11 Patented Strains (L. paracasei Lafti L26, L. rhamnosus GG, L. plantarum Rosell-1012, B. animalis Lafti B94, L. lactis Rosell-1058, B. bifidum Rosell-71, L. acidophilus Rosell-418, L. acidophilus HY7032, L. reuteri HY7506, L. curvatus HY7601, L. plantarum KY1032)', 'Fructooligosaccharides (FOS)', 'Chicory Inulin', 'Digestive Enzymes'],
      fullIngredients: 'Patented Probiotic Blend (10+ Billion CFU input per stick: L. paracasei Lafti L26, L. rhamnosus GG, L. plantarum Rosell-1012, B. animalis ssp. lactis Lafti B94, L. lactis Rosell-1058, B. bifidum Rosell-71, L. acidophilus Rosell-418, L. acidophilus HY7032, L. reuteri HY7506, L. curvatus HY7601, L. plantarum KY1032), Fructooligosaccharides (FOS), Chicory Root Inulin, Digestive Enzymes, Natural Palatability Broth. HACCP Certified.',
      howToFeed: 'Sprinkle 1 stick daily over room-temperature wet food, kibble, or mix into lukewarm water. Avoid boiling liquids above 40°C to protect live cultures.',
      feedingUsageGuide: 'Sprinkle over food or mix with lukewarm water once daily.',
      recommendedDailyAmount: 'Pets under 10kg: 1 stick daily · Pets over 10kg: 2 sticks daily.',
      suitablePetType: 'Dogs & Cats',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '60g (2g × 30 individual powder sticks)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Can be refrigerated during hot humid months to preserve live culture counts.',
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
    name: 'Hairball Care for Cats',
    petType: 'cat',
    petTypeLabel: 'CATS ONLY',
    category: 'hairball',
    categoryName: 'Hairball Care',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Gentle natural dietary fiber salmon puree formula with Oat Fiber, FOS, Psyllium Husk, and LPL2 probiotics for feline hairball & gut care.',
    packageSize: '180g (12g × 15 sticks)',
    imageUrl: '/images/products/hairball-care.png',
    galleryImages: [
      '/images/products/hairball-care/pack_cat.jpg',
      '/images/products/hairball-care/podium_salmon.jpg',
      '/images/products/hairball-care/cat_licking.jpg',
      '/images/products/hairball-care/cat_duo_scene.jpg',
      '/images/products/hairball-care/stick_detail.jpg'
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
        'Fresh Salmon Puree',
        'Oat Dietary Fiber 60mg',
        'Psyllium Husk & FOS',
        'L. plantarum L2 Strain'
      ],
      recommendedFor: [
        'Indoor cats experiencing frequent hairball regurgitation or dry coughing',
        'Medium and long-haired cat breeds (Persian, Ragdoll, British Longhair, etc.)',
        'Cats during seasonal coat shedding periods needing smooth bowel regularity'
      ],
      mainIngredients: ['Fresh Salmon', 'Oat Dietary Fiber (60mg)', 'Fructooligosaccharides FOS (60mg)', 'Psyllium Husk Fiber (24mg)', 'Lactobacillus plantarum L2'],
      keyIngredients: ['Fresh Salmon', 'Oat Dietary Fiber (60mg)', 'Fructooligosaccharides FOS (60mg)', 'Psyllium Husk Dietary Fiber (24mg)', 'Lactobacillus plantarum L2 (Probiotic LPL2)', 'Taurine'],
      fullIngredients: 'Fresh Salmon, Purified Water, Oat Dietary Fiber (60mg per stick), Fructooligosaccharides (FOS 60mg per stick), Psyllium Husk Dietary Fiber (24mg per stick), Lactobacillus plantarum L2 Probiotic Culture, Taurine, Tapioca Starch, Natural Palatability Broth. HACCP Certified.',
      howToFeed: 'Feed directly as a lickable treat stick from hand or blend into daily wet/dry cat food.',
      feedingUsageGuide: 'Feed directly or mix with daily wet/dry cat food.',
      recommendedDailyAmount: 'Standard adult cats (under 5kg): 1 stick daily · Long-haired cats or shedding season: 1–2 sticks daily.',
      suitablePetType: 'Cats (Short & Long Hair)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '180g (12g × 15 puree sticks)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from direct sunlight. Once opened, feed individual stick immediately.',
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
    name: 'Urena Clear for Cats',
    petType: 'cat',
    petTypeLabel: 'CATS ONLY',
    category: 'kidney-urinary',
    categoryName: 'Kidney & Urinary',
    collection: 'wellness-support',
    collectionName: 'Wellness Support',
    shortDescription: 'Chicken breast puree supplement with PACran Cranberry, Pumpkin Seed, L-Theanine, and Zinc for feline urinary & bladder care.',
    packageSize: '180g (12g × 15 sticks)',
    imageUrl: '/images/products/urena-clear.png',
    galleryImages: [
      '/images/products/urena-clear/pack_cat.jpg',
      '/images/products/urena-clear/podium_chicken.jpg',
      '/images/products/urena-clear/cat_licking.jpg',
      '/images/products/urena-clear/cat_duo_scene.jpg',
      '/images/products/urena-clear/stick_detail.jpg'
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
        'Fresh Chicken Breast Puree',
        'PACran Cranberry 25mg',
        'L-Theanine 42mg Calming',
        'Pumpkin Seed & Zinc'
      ],
      recommendedFor: [
        'Cats needing daily urinary tract, bladder comfort, and renal wellness support',
        'Felines with low water intake or stress-triggered urinary sensitivity',
        'Cats that enjoy lickable, delicious chicken puree treat sticks'
      ],
      mainIngredients: ['Fresh Chicken Breast', 'Pumpkin Seed Extract Complex (30mg)', 'PACran Cranberry Powder (25mg)', 'L-Theanine (42mg)', 'Zinc Oxide (12mg)'],
      keyIngredients: ['Fresh Chicken Breast', 'Pumpkin Seed Extract Complex (30mg)', 'PACran Cranberry Powder (25mg)', 'L-Theanine (42mg)', 'Zinc Oxide (12mg)', 'Rye Pollen (Cernitin) Extract'],
      fullIngredients: 'Fresh Korean Chicken Breast, Purified Water, Pumpkin Seed Extract Complex (30mg per stick), PACran Cranberry Powder (25mg per stick), L-Theanine (42mg per stick), Zinc Oxide (12mg per stick), Rye Pollen Extract, Tapioca Starch, Natural Palatability Enhancer. HACCP Certified.',
      howToFeed: 'Feed directly as a lickable puree treat stick from hand, or blend into wet food with 10–20 ml of warm water as a nourishing hydration drink.',
      feedingUsageGuide: 'Feed directly or mix into meals with warm water for extra hydration.',
      recommendedDailyAmount: 'Cats under 5kg: 1 stick daily · Cats over 5kg or intensive hydration routine: 1–2 sticks daily.',
      suitablePetType: 'Cats',
      suitableLifeStage: 'Adult cats & senior felines (3+ months)',
      packageSize: '180g (12g × 15 liquid puree sticks)',
      countryOfOrigin: 'Republic of Korea',
      storageInstructions: 'Store in a cool, dry place away from heat and direct sunlight. Feed immediately after opening individual stick.',
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
    shortDescription: 'High-potency German KD Pharma rTG Omega-3 (322mg EPA+DHA) with Astaxanthin and CoQ10 for medium & large pets.',
    packageSize: '24.6g (410mg × 60 capsules)',
    imageUrl: '/images/products/fresh-omega-3-premium.png',
    galleryImages: [
      '/images/products/fresh-omega-3-premium/pack_blister.jpg',
      '/images/products/fresh-omega-3-premium/box_stage.jpg'
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
        '322mg EPA+DHA (>80% rTG)',
        'Astaxanthin + CoQ10',
        'German KD Pharma Oil',
        '1.47 cm Dark Blister Capsule'
      ],
      recommendedFor: [
        'Medium and large dogs requiring higher daily EPA/DHA intake',
        'Pets needing joint mobility, heart vitality, and cellular antioxidant protection',
        'Companions with dry, itchy skin or lacklustre coat'
      ],
      mainIngredients: ['German KD Pharma rTG Fish Oil (EPA+DHA 322mg)', 'Haematococcus Astaxanthin', 'Coenzyme Q10 (CoQ10)', 'Vitamin E'],
      keyIngredients: ['German KD Pharma rTG Fish Oil (EPA+DHA 322mg)', 'Haematococcus Pluvialis Extract (Astaxanthin)', 'Coenzyme Q10', 'Vitamin E'],
      fullIngredients: 'High-Purity German KD Pharma rTG Refined Fish Oil (EPA + DHA 322mg per 410mg capsule, >80% rTG purity), Haematococcus Pluvialis Extract (Natural Astaxanthin), Coenzyme Q10 (CoQ10), D-Alpha-Tocopherol (Vitamin E), Gelatin (capsule shell), Glycerin.',
      howToFeed: 'Administer whole capsule with meals, or pierce tip and mix oil directly into kibble or wet food.',
      feedingUsageGuide: 'Administer whole capsule with meals, or pierce and mix oil into pet food.',
      recommendedDailyAmount: 'Under 5kg: 1 capsule daily · 5–11kg: 2 capsules daily · 11–17kg: 3 capsules daily · Over 17kg: 4 capsules daily.',
      suitablePetType: 'Dogs & Cats (Medium to Large breeds & All Companions)',
      suitableLifeStage: 'All life stages (3+ months)',
      packageSize: '24.6g (410 mg × 60 capsules in individual blister pack)',
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
