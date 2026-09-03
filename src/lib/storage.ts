import { OrderItem, OrderRecord, OrderSubmission, OrderStatus } from '../types/order';
import { ContactEnquiry } from '../types/enquiry';
import { CommunicationLog } from '../types/communication';
import { deductOrderStockOnPayment, restoreOrderStockOnCancellation } from './inventory';
import { createOrderNotification } from './notifications';

const CART_STORAGE_KEY = 'vetanic_cart_items_v1';
const ORDERS_STORAGE_KEY = 'vetanic_submitted_orders_v1';
const ENQUIRIES_STORAGE_KEY = 'vetanic_enquiries_v1';
const COMM_LOGS_STORAGE_KEY = 'vetanic_comm_logs_v1';

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

export function getOrders(): OrderRecord[] {
  try {
    const existingStr = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!existingStr || JSON.parse(existingStr).length === 0) {
      return seedInitialOrdersIfEmpty();
    }
    return JSON.parse(existingStr);
  } catch (e) {
    console.error('Failed to load orders', e);
    return [];
  }
}

export function getOrderById(id: string): OrderRecord | undefined {
  const allOrders = getOrders();
  return allOrders.find((o) => o.id === id || o.orderReference === id);
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  try {
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderReference === id);
    if (index > -1) {
      const order = orders[index];
      order.status = status;

      // 1. Order transitioned to Paid (or preparing/completed if unpaid previously) -> deduct stock
      if (status === 'Paid' && !order.inventoryDeducted) {
        deductOrderStockOnPayment(order);
        order.inventoryDeducted = true;
        order.inventoryDeductedAt = new Date().toISOString();
      }

      // 2. Order transitioned to Cancelled after stock was already deducted -> restore stock
      if (status === 'Cancelled' && order.inventoryDeducted && !order.inventoryRestored) {
        restoreOrderStockOnCancellation(order);
        order.inventoryRestored = true;
        order.inventoryRestoredAt = new Date().toISOString();
      }

      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  } catch (e) {
    console.error('Failed to update order status', e);
  }
}

export function updateOrderInternalNotes(id: string, notes: string): void {
  try {
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderReference === id);
    if (index > -1) {
      orders[index].internalNotes = notes;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  } catch (e) {
    console.error('Failed to update internal notes', e);
  }
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
    totalItemCount: totalCount,
    internalNotes: ''
  };

  try {
    const existing = getOrders();
    existing.unshift(orderRecord);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing));

    // Generate in-app Admin Notification & dispatch business email alert
    createOrderNotification(orderRecord);
  } catch (e) {
    console.error('Failed to save order to local storage', e);
  }

  return orderRecord;
}

/**
 * Communication History Logs for Customer Responses
 */
export function getCommunicationLogs(orderId: string): CommunicationLog[] {
  try {
    const raw = localStorage.getItem(COMM_LOGS_STORAGE_KEY);
    if (!raw) {
      return seedInitialCommunicationLogs(orderId);
    }
    const allLogs: CommunicationLog[] = JSON.parse(raw);
    const orderLogs = allLogs.filter((l) => l.orderId === orderId || l.orderReference === orderId);
    if (orderLogs.length === 0 && (orderId.startsWith('demo-') || orderId.startsWith('VET-'))) {
      return seedInitialCommunicationLogs(orderId);
    }
    return orderLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error('Failed to load communication logs', e);
    return [];
  }
}

export function saveCommunicationLog(
  logData: Omit<CommunicationLog, 'id' | 'createdAt'>
): CommunicationLog {
  const newLog: CommunicationLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  try {
    const raw = localStorage.getItem(COMM_LOGS_STORAGE_KEY);
    const existing: CommunicationLog[] = raw ? JSON.parse(raw) : [];
    existing.unshift(newLog);
    localStorage.setItem(COMM_LOGS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save communication log', e);
  }

  return newLog;
}

function seedInitialCommunicationLogs(orderId: string): CommunicationLog[] {
  const demoSeed: CommunicationLog[] = [];

  if (orderId === 'demo-102' || orderId === 'VET-2026-7451') {
    demoSeed.push({
      id: 'comm-seed-1',
      orderId: 'demo-102',
      orderReference: 'VET-2026-7451',
      templateType: 'order_confirmed',
      channel: 'WhatsApp',
      message: 'Hi Marcus! Thank you for your VETANIC order 🐾 We are happy to confirm your items are available...',
      createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 hrs ago
      adminUser: 'Sarah Tan (Operations)',
      status: 'Sent'
    });
  }

  if (orderId === 'demo-103' || orderId === 'VET-2026-6210') {
    demoSeed.push(
      {
        id: 'comm-seed-2',
        orderId: 'demo-103',
        orderReference: 'VET-2026-6210',
        templateType: 'order_confirmed',
        channel: 'Telegram',
        message: 'Hi Samantha! Thank you for your VETANIC order 🐾 Order reference VET-2026-6210 confirmed...',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        adminUser: 'VETANIC Admin',
        status: 'Sent'
      },
      {
        id: 'comm-seed-3',
        orderId: 'demo-103',
        orderReference: 'VET-2026-6210',
        templateType: 'payment_received',
        channel: 'Telegram',
        message: 'Hi Samantha! We have received your payment for order VET-2026-6210. Thank you ❤️',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        adminUser: 'VETANIC Admin',
        status: 'Sent'
      }
    );
  }

  if (demoSeed.length > 0) {
    try {
      const raw = localStorage.getItem(COMM_LOGS_STORAGE_KEY);
      const existing: CommunicationLog[] = raw ? JSON.parse(raw) : [];
      const combined = [...existing, ...demoSeed];
      localStorage.setItem(COMM_LOGS_STORAGE_KEY, JSON.stringify(combined));
    } catch (e) {
      console.error('Failed to seed comm logs', e);
    }
  }

  return demoSeed;
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

/**
 * Seed demo orders for prototype admin dashboard if storage is empty
 */
function seedInitialOrdersIfEmpty(): OrderRecord[] {
  const sampleOrders: OrderRecord[] = [
    {
      id: 'demo-101',
      orderReference: 'VET-2026-8192',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago (today)
      status: 'Pending Confirmation',
      totalItemCount: 3,
      internalNotes: 'Customer asked if delivery can be scheduled after 6pm on weekday.',
      customer: {
        fullName: 'Chloe Tan',
        email: 'chloe.tan88@gmail.com',
        contactNumber: '+65 9812 3456',
        preferredContact: 'WhatsApp',
        telegramHandle: '@chloetan_sg',
        customerType: 'new'
      },
      delivery: {
        deliveryMethod: 'standard',
        deliveryAddress: 'Blk 128 Toa Payoh Lorong 1 #14-220',
        postalCode: '310128'
      },
      paymentPreference: 'paynow',
      acknowledgements: {
        stockAvailabilityConfirmed: true,
        petAllergyChecked: true,
        wellnessSupplementAcknowledged: true
      },
      referralSource: 'Instagram',
      items: [
        {
          productId: 'fresh-omega-3-mini',
          productName: 'Fresh Omega-3 Mini',
          packageSize: '151 mg × 60 capsules',
          quantity: 2,
          unitPrice: 22.90
        },
        {
          productId: 'clear-eyes',
          productName: 'Clear Eyes',
          packageSize: '2g × 30 sticks',
          quantity: 1,
          unitPrice: 22.90
        }
      ],
      pricing: {
        subtotal: 68.70,
        bundleDiscount: 5.80, // 3 Everyday Care = 62.90
        productTotal: 62.90,
        deliveryFee: 0, // Free over 50
        estimatedTotal: 62.90
      }
    },
    {
      id: 'demo-102',
      orderReference: 'VET-2026-7451',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      status: 'Awaiting Payment',
      totalItemCount: 2,
      internalNotes: 'Confirmed stock with warehouse. Sent PayNow QR code via WhatsApp.',
      customer: {
        fullName: 'Marcus Lim',
        email: 'marcus.lim@outlook.sg',
        contactNumber: '+65 9123 7890',
        preferredContact: 'WhatsApp',
        customerType: 'new'
      },
      delivery: {
        deliveryMethod: 'self_collection'
      },
      paymentPreference: 'paynow',
      acknowledgements: {
        stockAvailabilityConfirmed: true,
        petAllergyChecked: true,
        wellnessSupplementAcknowledged: true
      },
      referralSource: 'Friend / Referral',
      items: [
        {
          productId: 'probiotics',
          productName: 'Probiotics',
          packageSize: '2g × 30 sticks',
          quantity: 1,
          unitPrice: 32.90
        },
        {
          productId: 'hairball-care',
          productName: 'Hairball Care',
          packageSize: '2g × 30 sticks',
          quantity: 1,
          unitPrice: 32.90
        }
      ],
      pricing: {
        subtotal: 65.80,
        bundleDiscount: 2.90, // 2 Wellness Support = 62.90
        productTotal: 62.90,
        deliveryFee: 0,
        estimatedTotal: 62.90
      }
    },
    {
      id: 'demo-103',
      orderReference: 'VET-2026-6210',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
      status: 'Paid',
      totalItemCount: 4,
      internalNotes: 'Payment verified via UEN PayNow ref: 20260901PAY9921. Packed into courier satchel.',
      customer: {
        fullName: 'Samantha Wong',
        email: 'samantha.wong@gmail.com',
        contactNumber: '+65 8234 5678',
        preferredContact: 'Telegram',
        telegramHandle: '@samwong_pets',
        customerType: 'existing'
      },
      delivery: {
        deliveryMethod: 'standard',
        deliveryAddress: '22 River Valley Green #09-04',
        postalCode: '238435'
      },
      paymentPreference: 'paynow',
      acknowledgements: {
        stockAvailabilityConfirmed: true,
        petAllergyChecked: true,
        wellnessSupplementAcknowledged: true
      },
      referralSource: 'Singapore Pet Festival',
      items: [
        {
          productId: 'fresh-omega-3-premium',
          productName: 'Fresh Omega-3 Premium',
          packageSize: '500 mg × 60 capsules',
          quantity: 3,
          unitPrice: 32.90
        },
        {
          productId: 'sweet-potato-pumpkin-treats',
          productName: 'Sweet Potato & Pumpkin Treats',
          packageSize: '70g',
          quantity: 1,
          unitPrice: 11.90
        }
      ],
      pricing: {
        subtotal: 110.60,
        bundleDiscount: 8.80, // 3 Wellness Support = 89.90 + 11.90 = 101.80
        productTotal: 101.80,
        deliveryFee: 0,
        estimatedTotal: 101.80
      }
    },
    {
      id: 'demo-104',
      orderReference: 'VET-2026-5914',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      status: 'Preparing',
      totalItemCount: 2,
      internalNotes: 'Packed and waiting for NinjaVan courier batch pickup at 2pm.',
      customer: {
        fullName: 'David Lee',
        email: 'david.lee.sg@gmail.com',
        contactNumber: '+65 9456 1234',
        preferredContact: 'SMS',
        customerType: 'new'
      },
      delivery: {
        deliveryMethod: 'standard',
        deliveryAddress: 'Blk 504 Bishan Street 11 #05-18',
        postalCode: '570504'
      },
      paymentPreference: 'bank_transfer',
      acknowledgements: {
        stockAvailabilityConfirmed: true,
        petAllergyChecked: true,
        wellnessSupplementAcknowledged: true
      },
      referralSource: 'Instagram',
      items: [
        {
          productId: 'soft-dental-chew',
          productName: 'Soft Dental Chew',
          packageSize: '150g',
          quantity: 2,
          unitPrice: 32.90
        }
      ],
      pricing: {
        subtotal: 65.80,
        bundleDiscount: 2.90,
        productTotal: 62.90,
        deliveryFee: 0,
        estimatedTotal: 62.90
      }
    },
    {
      id: 'demo-105',
      orderReference: 'VET-2026-4882',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      status: 'Completed',
      totalItemCount: 3,
      internalNotes: 'Successfully collected by customer at Novena MRT Exit B on Saturday morning.',
      customer: {
        fullName: 'Karen Ng',
        email: 'karen.ng@yahoo.com.sg',
        contactNumber: '+65 9789 0123',
        preferredContact: 'WhatsApp',
        customerType: 'existing'
      },
      delivery: {
        deliveryMethod: 'self_collection'
      },
      paymentPreference: 'paynow',
      acknowledgements: {
        stockAvailabilityConfirmed: true,
        petAllergyChecked: true,
        wellnessSupplementAcknowledged: true
      },
      referralSource: 'Singapore Pet Festival',
      items: [
        {
          productId: 'urena-clear',
          productName: 'Urena Clear',
          packageSize: '2g × 30 sticks',
          quantity: 3,
          unitPrice: 32.90
        }
      ],
      pricing: {
        subtotal: 98.70,
        bundleDiscount: 8.80,
        productTotal: 89.90,
        deliveryFee: 0,
        estimatedTotal: 89.90
      }
    }
  ];

  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(sampleOrders));
  } catch (e) {
    console.error('Failed to seed sample orders', e);
  }

  return sampleOrders;
}
