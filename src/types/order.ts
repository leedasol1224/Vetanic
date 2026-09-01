import { Product } from './product';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type ContactMethod = 'WhatsApp' | 'Telegram' | 'Instagram DM' | 'SMS';
export type CustomerType = 'new' | 'existing';
export type DeliveryMethod = 'standard' | 'self_collection' | 'same_day';
export type PaymentMethod = 'paynow' | 'bank_transfer';
export type ReferralSource = 'Singapore Pet Festival' | 'Instagram' | 'Friend / Referral' | 'Other';

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Confirmed'
  | 'Awaiting Payment'
  | 'Paid'
  | 'Preparing'
  | 'Ready for Collection'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export interface CustomerDetails {
  fullName: string;
  email: string;
  contactNumber: string;
  telegramHandle?: string;
  instagramAccount?: string;
  preferredContact: ContactMethod;
  customerType: CustomerType;
}

export interface DeliveryDetails {
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  postalCode?: string;
}

export interface OrderAcknowledgements {
  stockAvailabilityConfirmed: boolean;
  petAllergyChecked: boolean;
  wellnessSupplementAcknowledged: boolean;
}

export interface OrderSubmission {
  customer: CustomerDetails;
  delivery: DeliveryDetails;
  paymentPreference: PaymentMethod;
  acknowledgements: OrderAcknowledgements;
  referralSource: ReferralSource;
  otherReferralSource?: string;
  items: Array<{
    productId: string;
    productName: string;
    packageSize: string;
    quantity: number;
  }>;
}

export interface OrderRecord extends OrderSubmission {
  id: string;
  orderReference: string;
  createdAt: string;
  status: OrderStatus;
  totalItemCount: number;
}
