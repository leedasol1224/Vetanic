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
  tierA: {
    regularPrice: number;
    launchPrice: number;
    bundle2Price: number;
    bundle3Price: number;
    bundleDescription: string;
  };
  tierB: {
    regularPrice: number;
    launchPrice: number;
    bundle2Price: number;
    bundle3Price: number;
    bundleDescription: string;
  };
  treats: {
    'sweet-potato-pumpkin-treats': {
      regularPrice: number;
      launchPrice: number;
      bundle2Price: number;
      bundle3Price: number;
    };
    'freeze-dried-vegetables': {
      regularPrice: number;
      launchPrice: number;
      bundle2Price: number;
      bundle3Price: number;
    };
  };
}

export const SEPTEMBER_2026_LAUNCH_PROMOTION: PromotionConfig = {
  id: 'sept-2026-launch',
  name: 'September 2026 Singapore Launch',
  badgeText: 'Singapore Launch Price',
  announcementText: 'VETANIC Singapore Launch Special — Special prices & Mix & Match bundles throughout September',
  startDate: '2026-09-01T00:00:00+08:00',
  endDate: '2026-09-30T23:59:59+08:00',
  freeDeliveryThreshold: 50.00,
  standardDeliveryFee: 4.50,
  sameDayDeliveryFee: 15.00,
  tierA: {
    regularPrice: 24.90,
    launchPrice: 22.90,
    bundle2Price: 43.90,
    bundle3Price: 62.90,
    bundleDescription: 'Mix & Match: Any 2 SGD 43.90 · Any 3 SGD 62.90'
  },
  tierB: {
    regularPrice: 34.90,
    launchPrice: 32.90,
    bundle2Price: 62.90,
    bundle3Price: 89.90,
    bundleDescription: 'Mix & Match: Any 2 SGD 62.90 · Any 3 SGD 89.90'
  },
  treats: {
    'sweet-potato-pumpkin-treats': {
      regularPrice: 13.90,
      launchPrice: 11.90,
      bundle2Price: 22.00,
      bundle3Price: 31.50
    },
    'freeze-dried-vegetables': {
      regularPrice: 18.90,
      launchPrice: 16.90,
      bundle2Price: 32.00,
      bundle3Price: 45.00
    }
  }
};

/**
 * Checks if the promotion is currently active.
 */
export function isLaunchPromoActive(currentDate: Date = new Date()): boolean {
  const start = new Date(SEPTEMBER_2026_LAUNCH_PROMOTION.startDate).getTime();
  const end = new Date(SEPTEMBER_2026_LAUNCH_PROMOTION.endDate).getTime();
  const now = currentDate.getTime();

  return now >= start && now <= end;
}
