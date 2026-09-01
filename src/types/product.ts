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

export type PricingTier = 'tier-a' | 'tier-b' | 'treats' | 'standard';

export interface Product {
  id: string;
  slug: string;
  name: string;
  petType: PetType;
  petTypeLabel: 'DOG + CAT' | 'DOG ONLY' | 'CATS ONLY';
  category: ProductCategory;
  categoryName: string;
  shortDescription: string;
  packageSize: string;
  imageUrl: string;
  isAvailable: boolean;
  displayOrder: number;
  featured?: boolean;
  tier: PricingTier;
  regularPrice: number;
  launchPrice: number;
  bundleOfferText?: string;
  details: {
    keyFeatures?: string[];
    ingredientsPlaceholder?: string;
    recommendedUsage?: string;
    packageSize: string;
    countryOfOrigin: string;
    storageInstructions?: string;
    precautions?: string;
  };
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  tagline: string;
  iconName: string;
  relevantProductIds: string[];
  description: string;
}
