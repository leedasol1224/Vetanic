export type DeliveryOptionId = 'standard' | 'express';

export interface DeliveryConfigOption {
  id: DeliveryOptionId;
  name: string;
  subtitle: string;
  baseFee: number;
  freeThreshold: number; // 0 if never free
  estimatedTime: string;
}

export const DELIVERY_CONFIG: {
  options: Record<DeliveryOptionId, DeliveryConfigOption>;
  freeThreshold: number;
} = {
  freeThreshold: 50.00,
  options: {
    standard: {
      id: 'standard',
      name: 'Standard Delivery',
      subtitle: 'Standard local delivery (Singapore)',
      baseFee: 4.50,
      freeThreshold: 50.00,
      estimatedTime: '2–3 business days'
    },
    express: {
      id: 'express',
      name: 'Express Delivery',
      subtitle: 'Faster delivery option',
      baseFee: 9.00,
      freeThreshold: 0, // Express maintains surcharge or can be configured
      estimatedTime: 'Faster delivery option'
    }
  }
};

export function calculateDeliveryFee(method: DeliveryOptionId, subtotalAfterDiscount: number): number {
  const config = DELIVERY_CONFIG.options[method] || DELIVERY_CONFIG.options.standard;
  if (config.freeThreshold > 0 && subtotalAfterDiscount >= config.freeThreshold) {
    return 0;
  }
  return config.baseFee;
}

export function formatDeliveryLabel(method: DeliveryOptionId | string): string {
  if (method === 'express') return 'Express Delivery';
  return 'Standard Delivery';
}
