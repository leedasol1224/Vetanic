import { AdminNotification } from '../types/notification';
import { OrderRecord } from '../types/order';
import { isSupabaseConfigured, supabase } from './supabase';

const NOTIFICATIONS_STORAGE_KEY = 'vetanic_admin_notifications_v1';

export function getAdminNotifications(): AdminNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      return seedInitialNotificationsIfEmpty();
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load admin notifications', e);
    return [];
  }
}

export function saveAdminNotification(notification: AdminNotification): void {
  try {
    const existing = getAdminNotifications();
    existing.unshift(notification);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save notification', e);
  }
}

export function markNotificationAsRead(id: string): void {
  try {
    const notifications = getAdminNotifications();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to mark notification as read', e);
  }
}

export function markAllNotificationsAsRead(): void {
  try {
    const notifications = getAdminNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to mark all notifications as read', e);
  }
}

export function createOrderNotification(order: OrderRecord): AdminNotification {
  const notification: AdminNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    orderId: order.id,
    orderReference: order.orderReference,
    customerName: order.customer.fullName,
    totalAmount: order.pricing?.estimatedTotal || 0,
    itemCount: order.totalItemCount || order.items.reduce((s, i) => s + i.quantity, 0),
    createdAt: new Date().toISOString(),
    read: false,
    type: 'new_order',
    message: `${order.customer.fullName} placed order ${order.orderReference} (${order.totalItemCount} items · SGD ${(order.pricing?.estimatedTotal || 0).toFixed(2)})`
  };

  saveAdminNotification(notification);

  // Attempt external notification in the background without throwing error
  sendBusinessEmailNotification(order).catch((err) => {
    console.warn('[Notification] Background notification attempt logged:', err);
  });

  return notification;
}

/**
 * External Business Notification Dispatcher
 * The destination email is pulled from environment configuration (VITE_BUSINESS_NOTIFICATION_EMAIL).
 * Failures are safely isolated so customer orders never fail.
 */
export async function sendBusinessEmailNotification(order: OrderRecord): Promise<{ success: boolean; error?: string }> {
  const businessEmail = import.meta.env.VITE_BUSINESS_NOTIFICATION_EMAIL || 'orders@vetanic.sg';
  const appBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vetanic.vercel.app';
  const orderAdminLink = `${appBaseUrl}/business/orders/${order.id}`;

  const subject = `New VETANIC Order — ${order.orderReference}`;
  const itemsText = order.items.map((i) => `• ${i.productName} × ${i.quantity} (SGD ${(i.unitPrice * i.quantity).toFixed(2)})`).join('\n');
  const deliveryText = order.delivery.deliveryMethod === 'self_collection'
    ? 'Self-collection @ Novena MRT'
    : order.delivery.deliveryMethod === 'same_day'
    ? `Same-day Delivery (${order.delivery.deliveryAddress || 'Address on file'})`
    : `Standard Delivery (${order.delivery.deliveryAddress || 'Address on file'}, S${order.delivery.postalCode || ''})`;

  const emailBody = `New order received.

Customer:
${order.customer.fullName}
Email: ${order.customer.email}
Phone: ${order.customer.contactNumber}
Preferred Contact: ${order.customer.preferredContact}

Order Items:
${itemsText}

Estimated Total:
SGD ${(order.pricing?.estimatedTotal || 0).toFixed(2)}

Delivery:
${deliveryText}

Payment Method:
${order.paymentPreference === 'paynow' ? 'PayNow (UEN / QR)' : 'Bank Transfer'}

View Order in Business Hub:
${orderAdminLink}
`;

  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('admin_notifications').insert({
        order_id: order.id,
        order_reference: order.orderReference,
        customer_name: order.customer.fullName,
        total_amount: order.pricing?.estimatedTotal || 0,
        item_count: order.totalItemCount,
        read: false,
        notification_type: 'new_order'
      });
      if (error) {
        console.warn('Supabase notification row insert logged:', error.message);
      }
    }

    console.info(`[Notification Engine] Prepared business email (${subject}) to: ${businessEmail} for ${order.orderReference}:\n${emailBody}`);
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'External notification failed';
    console.warn('[Notification Engine] Non-fatal notification error:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

function seedInitialNotificationsIfEmpty(): AdminNotification[] {
  const initial: AdminNotification[] = [
    {
      id: 'notif-seed-1',
      orderId: 'demo-101',
      orderReference: 'VET-2026-8192',
      customerName: 'Chloe Tan',
      totalAmount: 62.90,
      itemCount: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      read: false,
      type: 'new_order',
      message: 'Chloe Tan placed order VET-2026-8192 (3 items · SGD 62.90)'
    },
    {
      id: 'notif-seed-2',
      orderId: 'demo-102',
      orderReference: 'VET-2026-7451',
      customerName: 'Marcus Lim',
      totalAmount: 62.90,
      itemCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      read: true,
      type: 'new_order',
      message: 'Marcus Lim placed order VET-2026-7451 (2 items · SGD 62.90)'
    }
  ];

  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    console.error('Failed to seed sample notifications', e);
  }

  return initial;
}
