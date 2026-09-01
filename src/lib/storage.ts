import { OrderItem, OrderRecord, OrderSubmission } from '../types/order';
import { ContactEnquiry } from '../types/enquiry';

const CART_STORAGE_KEY = 'vetanic_cart_items_v1';
const ORDERS_STORAGE_KEY = 'vetanic_submitted_orders_v1';
const ENQUIRIES_STORAGE_KEY = 'vetanic_enquiries_v1';

export function getSavedCart(): OrderItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load cart from storage', e);
    return [];
  }
}

export function saveCart(items: OrderItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart to storage', e);
  }
}

export function clearCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear cart', e);
  }
}

export function generateOrderReference(): string {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `VET-${currentYear}-${randomNum}`;
}

export function saveLocalOrder(submission: OrderSubmission): OrderRecord {
  const orderRef = generateOrderReference();
  const totalCount = submission.items.reduce((sum, item) => sum + item.quantity, 0);

  const orderRecord: OrderRecord = {
    ...submission,
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    orderReference: orderRef,
    createdAt: new Date().toISOString(),
    status: 'Pending Confirmation',
    totalItemCount: totalCount
  };

  try {
    const existingStr = localStorage.getItem(ORDERS_STORAGE_KEY);
    const existing: OrderRecord[] = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(orderRecord);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save order to local storage', e);
  }

  return orderRecord;
}

export function saveLocalEnquiry(enquiryData: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>): ContactEnquiry {
  const enquiry: ContactEnquiry = {
    ...enquiryData,
    id: `enquiry-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  try {
    const existingStr = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    const existing: ContactEnquiry[] = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(enquiry);
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save enquiry locally', e);
  }

  return enquiry;
}
