import { OrderItem, OrderRecord, OrderSubmission, OrderStatus } from '../types/order';
import { ContactEnquiry } from '../types/enquiry';
import { CommunicationLog } from '../types/communication';
import { deductOrderStockOnPayment, restoreOrderStockOnCancellation } from './inventory';
import { createOrderNotification } from './notifications';

const CART_STORAGE_KEY = 'vetanic_cart_items_v1';
const ORDERS_STORAGE_KEY = 'vetanic_submitted_orders_v2';
const ENQUIRIES_STORAGE_KEY = 'vetanic_enquiries_v1';
const COMM_LOGS_STORAGE_KEY = 'vetanic_comm_logs_v2';

// Purge legacy demo keys if present in browser storage
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    localStorage.removeItem('vetanic_submitted_orders_v1');
    localStorage.removeItem('vetanic_comm_logs_v1');
  } catch {
    // Ignore storage access errors
  }
}

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
    if (!existingStr) {
      return [];
    }
    return JSON.parse(existingStr);
  } catch (e) {
    console.error('Failed to load orders', e);
    return [];
  }
}

export function saveOrdersToStorage(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to storage', e);
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

      // 1. Order transitioned to Paid -> deduct stock
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
      return [];
    }
    const allLogs: CommunicationLog[] = JSON.parse(raw);
    const orderLogs = allLogs.filter((l) => l.orderId === orderId || l.orderReference === orderId);
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
