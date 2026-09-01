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

export interface ProductDetails {
  keyBenefits: string[];
  mainIngredients: string[];
  fullIngredients: string;
  feedingUsageGuide: string;
  recommendedDailyAmount: string;
  suitablePetType: string;
  suitableLifeStage: string;
  packageSize: string;
  countryOfOrigin: string;
  storageInstructions: string;
  precautions: string;
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
