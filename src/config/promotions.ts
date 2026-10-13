/**
 * Centralized Promotion & Pricing Configuration for VETANIC
 */

export interface PromotionConfig {
  id: string;
  name: string;
  badgeText: string;
  announcementText: string;
  startDate: string; // ISO format: '2026-09-01'
  endDate: string;   // ISO format: '2026-09-30'
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  sameDayDeliveryFee: number;
  everydayCare: {
    internalId: 'pricing_group_1';
    displayName: 'Everyday Care';
    regularPrice: number;
    launchPrice: number;
    bundle2Price: number;
    bundle3Price: number;
    bundleDescription: string;
  };
  wellnessSupport: {
    internalId: 'pricing_group_2';
    displayName: 'Wellness Support';
    regularPrice: number;
    launchPrice: number;
    bundle2Price: number;
    bundle3Price: number;
    bundleDescription: string;
  };
  treats: {
    'sweet-potato-pumpkin-treats': {
      internalId: 'treat_sweet_potato';
      displayName: 'Sweet Potato & Pumpkin Treats';
      regularPrice: number;
      launchPrice: number;
      bundle2Price: number;
      bundle3Price: number;
    };
    'freeze-dried-vegetables': {
      internalId: 'treat_freeze_dried';
      displayName: 'Freeze-Dried Vegetables';
      regularPrice: number;
      launchPrice: number;
      bundle2Price: number;
      bundle3Price: number;
    };
  };
}

export const OCTOBER_2026_LAUNCH_PROMOTION: PromotionConfig = {
  id: 'oct-2026-launch',
  name: 'October 2026 Singapore Launch',
  badgeText: 'October Launch Price',
  announcementText: 'VETANIC Singapore Launch Special — Special prices & Mix & Match bundles throughout October (1–31 October 2026)',
  startDate: '2026-10-01T00:00:00+08:00',
  endDate: '2026-10-31T23:59:59+08:00',
  freeDeliveryThreshold: 50.00,
  standardDeliveryFee: 4.50,
  sameDayDeliveryFee: 15.00,
  everydayCare: {
    internalId: 'pricing_group_1',
    displayName: 'Everyday Care',
    regularPrice: 24.90,
    launchPrice: 22.90,
    bundle2Price: 43.90,
    bundle3Price: 62.90,
    bundleDescription: 'Mix & Match: Any 2 SGD 43.90 · Any 3 SGD 62.90'
  },
  wellnessSupport: {
    internalId: 'pricing_group_2',
    displayName: 'Wellness Support',
    regularPrice: 34.90,
    launchPrice: 32.90,
    bundle2Price: 62.90,
    bundle3Price: 89.90,
    bundleDescription: 'Mix & Match: Any 2 SGD 62.90 · Any 3 SGD 89.90'
  },
  treats: {
    'sweet-potato-pumpkin-treats': {
      internalId: 'treat_sweet_potato',
      displayName: 'Sweet Potato & Pumpkin Treats',
      regularPrice: 13.90,
      launchPrice: 11.90,
      bundle2Price: 22.00,
      bundle3Price: 31.50
    },
    'freeze-dried-vegetables': {
      internalId: 'treat_freeze_dried',
      displayName: 'Freeze-Dried Vegetables',
      regularPrice: 18.90,
      launchPrice: 16.90,
      bundle2Price: 32.00,
      bundle3Price: 45.00
    }
  }
};

/**
 * Active Promotion in effect
 */
export const ACTIVE_LAUNCH_PROMOTION: PromotionConfig = OCTOBER_2026_LAUNCH_PROMOTION;

// Aliases for convenience and backward compatibility
export const LAUNCH_PROMOTION = ACTIVE_LAUNCH_PROMOTION;
export const SEPTEMBER_2026_LAUNCH_PROMOTION = ACTIVE_LAUNCH_PROMOTION;

/**
 * Checks if the launch promotion is currently active.
 * Active throughout 1–31 October 2026 Singapore time.
 * Automatically falls back to regular prices from 1 November 2026.
 */
export function isLaunchPromoActive(currentDate: Date = new Date()): boolean {
  const start = new Date(ACTIVE_LAUNCH_PROMOTION.startDate).getTime();
  const end = new Date(ACTIVE_LAUNCH_PROMOTION.endDate).getTime();
  const now = currentDate.getTime();

  return now >= start && now <= end;
}
