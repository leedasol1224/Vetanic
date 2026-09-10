import { OrderRecord } from '../types/order';
import { getOrders } from './storage';
import { mapToCustomerStatus, CustomerStatusInfo } from './orderStatus';
import { supabase, isSupabaseConfigured } from './supabase';

export interface CustomerOrderView {
  id: string;
  orderReference: string;
  createdAt: string;
  customerName: string;
  customerMobileMasked: string;
  deliveryMethod: string;
  deliveryAddressMasked?: string;
  postalCode?: string;
  paymentPreference: string;
  items: Array<{
    productId: string;
    productName: string;
    packageSize: string;
    quantity: number;
    unitPrice: number;
  }>;
  pricing?: {
    subtotal: number;
    bundleDiscount: number;
    productTotal: number;
    deliveryFee: number;
    estimatedTotal: number;
  };
  statusInfo: CustomerStatusInfo;
}

export interface GuestLookupResult {
  success: boolean;
  order?: CustomerOrderView;
  error?: string;
}

const RATE_LIMIT_KEY = 'vetanic_guest_lookup_attempts_v1';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 10 * 60 * 1000; // 10 minutes

// Helper to normalize phone numbers for robust digit matching
export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // If Singapore number with country code 65 (10 digits), extract last 8 digits
  if (digits.length >= 8) {
    return digits.slice(-8);
  }
  return digits;
}

function checkRateLimit(): { allowed: boolean; remainingMs?: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY) || localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { allowed: true };

    const data: { count: number; firstAttempt: number } = JSON.parse(raw);
    const elapsed = Date.now() - data.firstAttempt;

    if (elapsed > LOCKOUT_MS) {
      sessionStorage.removeItem(RATE_LIMIT_KEY);
      localStorage.removeItem(RATE_LIMIT_KEY);
      return { allowed: true };
    }

    if (data.count >= MAX_ATTEMPTS) {
      return { allowed: false, remainingMs: LOCKOUT_MS - elapsed };
    }

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function recordFailedAttempt(): void {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY) || localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let data = { count: 1, firstAttempt: now };

    if (raw) {
      const parsed = JSON.parse(raw);
      if (now - parsed.firstAttempt < LOCKOUT_MS) {
        data = { count: parsed.count + 1, firstAttempt: parsed.firstAttempt };
      }
    }

    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Rate limit record error', e);
  }
}

function clearRateLimit(): void {
  sessionStorage.removeItem(RATE_LIMIT_KEY);
  localStorage.removeItem(RATE_LIMIT_KEY);
}

/**
 * Sanitize internal OrderRecord to a safe CustomerOrderView
 */
export function sanitizeToCustomerOrder(order: OrderRecord): CustomerOrderView {
  const phone = order.customer.contactNumber || '';
  const digits = phone.replace(/\D/g, '');
  const maskedPhone = digits.length >= 4 
    ? `+65 **** ${digits.slice(-4)}` 
    : '***';

  const address = order.delivery.deliveryAddress || '';
  const maskedAddress = address.length > 10 
    ? `${address.slice(0, 8)}...` 
    : address;

  return {
    id: order.id,
    orderReference: order.orderReference,
    createdAt: order.createdAt,
    customerName: order.customer.fullName,
    customerMobileMasked: maskedPhone,
    deliveryMethod: order.delivery.deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
    deliveryAddressMasked: maskedAddress,
    postalCode: order.delivery.postalCode,
    paymentPreference: order.paymentPreference === 'paynow' ? 'PayNow' : 'Bank Transfer',
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      packageSize: item.packageSize,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    })),
    pricing: order.pricing,
    statusInfo: mapToCustomerStatus(order.status)
  };
}

/**
 * Secure Guest Order Lookup
 * Validates Order Reference and Mobile Number with rate limiting and generic error handling.
 */
export async function lookupGuestOrder(
  orderReference: string,
  mobileNumber: string
): Promise<GuestLookupResult> {
  const cleanRef = orderReference.trim().toUpperCase();
  const cleanDigits = normalizePhoneDigits(mobileNumber);

  if (!cleanRef || !cleanDigits) {
    return {
      success: false,
      error: "We couldn't find an order matching those details. Please check your information and try again."
    };
  }

  // Rate limit check
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    const mins = Math.ceil((rateLimit.remainingMs || 0) / 60000);
    return {
      success: false,
      error: `Too many lookup attempts. For your security, please wait ${mins} minute${mins === 1 ? '' : 's'} before trying again.`
    };
  }

  try {
    // 1. If Supabase configured, call secure SECURITY DEFINER RPC
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('lookup_guest_order', {
          p_order_reference: cleanRef,
          p_contact_number: cleanDigits
        });

        if (!rpcError && rpcData && rpcData.success && rpcData.order) {
          clearRateLimit();
          saveGuestSession(cleanRef);
          return {
            success: true,
            order: {
              id: rpcData.order.id,
              orderReference: rpcData.order.orderReference,
              createdAt: rpcData.order.createdAt,
              customerName: rpcData.order.customerName,
              customerMobileMasked: rpcData.order.contactNumberMasked,
              deliveryMethod: rpcData.order.deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
              deliveryAddressMasked: rpcData.order.deliveryAddressMasked,
              postalCode: rpcData.order.postalCode,
              paymentPreference: rpcData.order.paymentPreference === 'paynow' ? 'PayNow' : 'Bank Transfer',
              items: (rpcData.order.items || []).map((it: { productId: string; productName: string; packageSize: string; quantity: number; unitPrice: number }) => ({
                productId: it.productId,
                productName: it.productName,
                packageSize: it.packageSize,
                quantity: it.quantity,
                unitPrice: Number(it.unitPrice) || 0
              })),
              pricing: rpcData.order.pricing,
              statusInfo: mapToCustomerStatus(rpcData.order.status)
            }
          };
        }
      } catch (rpcEx) {
        console.warn('RPC lookup error:', rpcEx);
      }
    }

    // 2. Check local storage / mock orders cache
    const allOrders = getOrders();
    const matched = allOrders.find((o) => {
      const matchesRef = o.orderReference.toUpperCase() === cleanRef || o.id === cleanRef;
      const matchesPhone = normalizePhoneDigits(o.customer.contactNumber) === cleanDigits;
      return matchesRef && matchesPhone;
    });

    if (matched) {
      clearRateLimit();
      saveGuestSession(matched.orderReference);
      return {
        success: true,
        order: sanitizeToCustomerOrder(matched)
      };
    }

    // Failed attempt
    recordFailedAttempt();
    return {
      success: false,
      error: "We couldn't find an order matching those details. Please check your information and try again."
    };
  } catch (err) {
    console.error('Guest lookup error', err);
    recordFailedAttempt();
    return {
      success: false,
      error: "We couldn't find an order matching those details. Please check your information and try again."
    };
  }
}

const GUEST_SESSION_PREFIX = 'vetanic_guest_session_';

export function saveGuestSession(orderReference: string): void {
  try {
    const sessionData = {
      orderReference: orderReference.toUpperCase(),
      verifiedAt: Date.now()
    };
    sessionStorage.setItem(`${GUEST_SESSION_PREFIX}${orderReference.toUpperCase()}`, JSON.stringify(sessionData));
  } catch (e) {
    console.warn('Session storage error', e);
  }
}

export function isGuestSessionVerified(orderReference: string): boolean {
  try {
    const raw = sessionStorage.getItem(`${GUEST_SESSION_PREFIX}${orderReference.toUpperCase()}`);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return session && session.orderReference === orderReference.toUpperCase();
  } catch {
    return false;
  }
}
