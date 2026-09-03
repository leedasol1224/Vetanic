export type PetType = 'dog' | 'cat' | 'both';

export type ProductCategory = 
  | 'skin-coat'
  | 'digestion'
  | 'eye-care'
  | 'kidney-urinary'
  | 'hairball'
  | 'dental'
  | 'treats'
  | 'joint-care';

export type MerchandisingCollection = 'everyday-care' | 'wellness-support' | 'treats' | 'standard';

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductDetails {
  keyBenefits: string[]; // 3-4 short visual cards / pills (e.g. "Skin & Coat", "1 cm Mini Capsule")
  recommendedFor?: string[]; // Short visual bullet points / compact cards
  keyIngredients?: string[]; // Active functional ingredients
  mainIngredients: string[]; // Key ingredients (for backwards compatibility)
  fullIngredients: string;
  howToFeed: string;
  feedingUsageGuide: string; // Feeding instructions
  recommendedDailyAmount: string; // Dosage guideline
  suitablePetType: string;
  suitableLifeStage: string;
  packageSize: string;
  countryOfOrigin: string;
  storageInstructions: string;
  storage?: string;
  precautions: string | string[];
  productFaq?: ProductFaqItem[];
  additionalNotes?: string;
  // Legacy / convenience fields
  keyFeatures?: string[];
  ingredientsPlaceholder?: string;
  recommendedUsage?: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  petType: PetType;
  petTypeLabel: 'DOG + CAT' | 'DOG ONLY' | 'CATS ONLY';
  category: ProductCategory;
  categoryName: string;
  collection: MerchandisingCollection;
  collectionName: 'Everyday Care' | 'Wellness Support' | 'Treats';
  shortDescription: string;
  packageSize: string;
  imageUrl: string;
  galleryImages?: string[];
  isAvailable: boolean;
  displayOrder: number;
  featured?: boolean;
  regularPrice: number;
  launchPrice: number;
  bundleOfferText?: string;
  initialStock?: number;
  lowStockThreshold?: number;
  trackInventory?: boolean;
  details: ProductDetails;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  tagline: string;
  iconName: string;
  relevantProductIds: string[];
  description: string;
}
