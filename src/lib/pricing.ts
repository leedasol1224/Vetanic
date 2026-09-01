import { OrderItem, DeliveryMethod, PricingSummary } from '../types/order';
import { Product } from '../types/product';
import { SEPTEMBER_2026_LAUNCH_PROMOTION, isLaunchPromoActive } from '../config/promotions';

export interface ProductPriceInfo {
  regularPrice: number;
  launchPrice: number;
  activePrice: number;
  isPromo: boolean;
  bundleOfferText?: string;
}

/**
 * Returns formatted and active pricing for an individual product.
 */
export function getProductPricing(product: Product, date: Date = new Date()): ProductPriceInfo {
  const promoActive = isLaunchPromoActive(date);
  const regularPrice = product.regularPrice;
  const launchPrice = product.launchPrice;
  const activePrice = promoActive ? launchPrice : regularPrice;

  return {
    regularPrice,
    launchPrice,
    activePrice,
    isPromo: promoActive,
    bundleOfferText: product.bundleOfferText
  };
}

/**
 * Calculates the optimal bundle cost for a given quantity in Tier A
 */
function calculateTierACost(count: number, isPromo: boolean): number {
  if (count <= 0) return 0;
  const { regularPrice, launchPrice, bundle2Price, bundle3Price } = SEPTEMBER_2026_LAUNCH_PROMOTION.tierA;

  if (!isPromo) {
    return count * regularPrice;
  }

  const bundlesOf3 = Math.floor(count / 3);
  const remainder = count % 3;

  if (remainder === 0) {
    return bundlesOf3 * bundle3Price;
  } else if (remainder === 1) {
    return bundlesOf3 * bundle3Price + launchPrice;
  } else {
    // remainder === 2
    return bundlesOf3 * bundle3Price + bundle2Price;
  }
}

/**
 * Calculates the optimal bundle cost for a given quantity in Tier B
 */
function calculateTierBCost(count: number, isPromo: boolean): number {
  if (count <= 0) return 0;
  const { regularPrice, launchPrice, bundle2Price, bundle3Price } = SEPTEMBER_2026_LAUNCH_PROMOTION.tierB;

  if (!isPromo) {
    return count * regularPrice;
  }

  const bundlesOf3 = Math.floor(count / 3);
  const remainder = count % 3;

  if (remainder === 0) {
    return bundlesOf3 * bundle3Price;
  } else if (remainder === 1) {
    return bundlesOf3 * bundle3Price + launchPrice;
  } else {
    // remainder === 2
    return bundlesOf3 * bundle3Price + bundle2Price;
  }
}

/**
 * Calculates the optimal bundle cost for a treat product
 */
function calculateTreatCost(slug: string, count: number, isPromo: boolean): number {
  if (count <= 0) return 0;
  const treatConfig =
    SEPTEMBER_2026_LAUNCH_PROMOTION.treats[
      slug as keyof typeof SEPTEMBER_2026_LAUNCH_PROMOTION.treats
    ];

  if (!treatConfig) {
    return count * 15.00;
  }

  if (!isPromo) {
    return count * treatConfig.regularPrice;
  }

  const bundlesOf3 = Math.floor(count / 3);
  const remainder = count % 3;

  if (remainder === 0) {
    return bundlesOf3 * treatConfig.bundle3Price;
  } else if (remainder === 1) {
    return bundlesOf3 * treatConfig.bundle3Price + treatConfig.launchPrice;
  } else {
    return bundlesOf3 * treatConfig.bundle3Price + treatConfig.bundle2Price;
  }
}

/**
 * Comprehensive Order Pricing Calculator
 */
export function calculateOrderPricing(
  items: OrderItem[],
  deliveryMethod: DeliveryMethod = 'standard',
  date: Date = new Date()
): PricingSummary {
  const isPromo = isLaunchPromoActive(date);

  let regularSubtotal = 0;
  let productSubtotal = 0;
  let tierACount = 0;
  let tierBCount = 0;
  let treatsCount = 0;

  // Track treat counts by product id/slug
  const treatCounts: Record<string, number> = {};

  items.forEach((item) => {
    const qty = item.quantity;
    regularSubtotal += item.product.regularPrice * qty;
    productSubtotal += (isPromo ? item.product.launchPrice : item.product.regularPrice) * qty;

    if (item.product.tier === 'tier-a') {
      tierACount += qty;
    } else if (item.product.tier === 'tier-b') {
      tierBCount += qty;
    } else if (item.product.tier === 'treats') {
      treatsCount += qty;
      treatCounts[item.product.id] = (treatCounts[item.product.id] || 0) + qty;
    }
  });

  // Calculate optimized product totals
  const tierACost = calculateTierACost(tierACount, isPromo);
  const tierBCost = calculateTierBCost(tierBCount, isPromo);

  let treatsCost = 0;
  Object.entries(treatCounts).forEach(([slug, count]) => {
    treatsCost += calculateTreatCost(slug, count, isPromo);
  });

  const productTotal = Number((tierACost + tierBCost + treatsCost).toFixed(2));
  const bundleDiscount = Number(Math.max(0, productSubtotal - productTotal).toFixed(2));
  const savingsAmount = Number(Math.max(0, regularSubtotal - productTotal).toFixed(2));

  // Delivery calculations
  const threshold = SEPTEMBER_2026_LAUNCH_PROMOTION.freeDeliveryThreshold;
  const isFreeDeliveryUnlocked = productTotal >= threshold;
  const freeDeliveryThresholdDelta = Number(Math.max(0, threshold - productTotal).toFixed(2));

  let deliveryFee = 0;
  if (deliveryMethod === 'self_collection') {
    deliveryFee = 0;
  } else if (deliveryMethod === 'same_day') {
    deliveryFee = SEPTEMBER_2026_LAUNCH_PROMOTION.sameDayDeliveryFee;
  } else {
    // Standard Local Delivery
    deliveryFee = isFreeDeliveryUnlocked ? 0 : SEPTEMBER_2026_LAUNCH_PROMOTION.standardDeliveryFee;
  }

  const estimatedTotal = Number((productTotal + deliveryFee).toFixed(2));

  // Dynamic Upsell Messages
  const upsellMessages: string[] = [];

  if (isPromo) {
    if (tierACount === 1) {
      upsellMessages.push('Add one more eligible Tier A product to unlock our Mix & Match offer (Any 2 for SGD 43.90).');
    } else if (tierACount === 2) {
      upsellMessages.push('Mix & Match applied! Add one more Tier A product and get any 3 for SGD 62.90.');
    }

    if (tierBCount === 1) {
      upsellMessages.push('Add one more eligible product to unlock our Mix & Match offer (Any 2 for SGD 62.90).');
    } else if (tierBCount === 2) {
      upsellMessages.push('Mix & Match applied! Add one more and get any 3 for SGD 89.90.');
    }
  }

  // Free delivery message
  let freeDeliveryMessage = '';
  if (deliveryMethod !== 'self_collection') {
    if (isFreeDeliveryUnlocked) {
      freeDeliveryMessage = "You've unlocked free local delivery!";
    } else if (productTotal > 0) {
      freeDeliveryMessage = `Add SGD ${freeDeliveryThresholdDelta.toFixed(2)} more to enjoy free local delivery.`;
    }
  }

  return {
    regularSubtotal: Number(regularSubtotal.toFixed(2)),
    productSubtotal: Number(productSubtotal.toFixed(2)),
    bundleDiscount,
    productTotal,
    deliveryFee,
    estimatedTotal,
    savingsAmount,
    tierACount,
    tierBCount,
    treatsCount,
    upsellMessages,
    freeDeliveryMessage,
    isFreeDeliveryUnlocked,
    freeDeliveryThresholdDelta
  };
}
