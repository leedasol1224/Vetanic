import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderSubmission, OrderRecord, OrderStatus, DeliveryMethod, ContactMethod, CustomerType, PaymentMethod, ReferralSource } from '../types/order';
import { ContactEnquiry } from '../types/enquiry';
import { AdminNotification } from '../types/notification';
import { CommunicationLog } from '../types/communication';
import { saveLocalOrder, saveLocalEnquiry, getOrders, saveOrdersToStorage } from './storage';
import { deductOrderStockOnPayment, restoreOrderStockOnCancellation } from './inventory';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder')
);

// Public client used for public storefront operations (order submission & guest order lookup)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

interface DbOrderRow {
  id: string;
  order_reference: string;
  created_at: string;
  customer_name: string;
  email: string;
  contact_number: string;
  instagram_account?: string | null;
  preferred_contact: string;
  customer_type: string;
  delivery_method: string;
  delivery_address?: string | null;
  postal_code?: string | null;
  payment_method: string;
  referral_source: string;
  other_referral_source?: string | null;
  acknowledgement: boolean;
  status: string;
  pricing?: {
    subtotal: number;
    bundleDiscount: number;
    productTotal: number;
    deliveryFee: number;
    estimatedTotal: number;
  } | null;
  total_item_count?: number;
  internal_notes?: string | null;
  inventory_deducted?: boolean;
  inventory_deducted_at?: string | null;
  inventory_restored?: boolean;
  inventory_restored_at?: string | null;
  order_items?: Array<{
    id: string;
    product_id: string;
    product_name: string;
    package_size: string;
    quantity: number;
    unit_price?: number;
  }>;
}

/**
 * Maps raw PostgreSQL Supabase rows into strongly typed OrderRecord
 */
export function mapDbRowToOrderRecord(row: DbOrderRow): OrderRecord {
  const items = (row.order_items || []).map((item) => ({
    productId: item.product_id,
    productName: item.product_name,
    packageSize: item.package_size,
    quantity: item.quantity,
    unitPrice: item.unit_price !== undefined ? Number(item.unit_price) : 0
  }));

  const totalCount = row.total_item_count || items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: row.id,
    orderReference: row.order_reference,
    createdAt: row.created_at,
    customer: {
      fullName: row.customer_name,
      email: row.email,
      contactNumber: row.contact_number,
      instagramAccount: row.instagram_account || undefined,
      preferredContact: row.preferred_contact as ContactMethod,
      customerType: row.customer_type as CustomerType
    },
    delivery: {
      deliveryMethod: row.delivery_method as DeliveryMethod,
      deliveryAddress: row.delivery_address || undefined,
      postalCode: row.postal_code || undefined
    },
    paymentPreference: row.payment_method as PaymentMethod,
    referralSource: row.referral_source as ReferralSource,
    otherReferralSource: row.other_referral_source || undefined,
    acknowledgements: {
      stockAvailabilityConfirmed: true,
      petAllergyChecked: true,
      wellnessSupplementAcknowledged: true
    },
    items,
    pricing: row.pricing || undefined,
    status: (row.status as OrderStatus) || 'Pending Confirmation',
    totalItemCount: totalCount,
    internalNotes: row.internal_notes || '',
    inventoryDeducted: row.inventory_deducted || false,
    inventoryDeductedAt: row.inventory_deducted_at || undefined,
    inventoryRestored: row.inventory_restored || false,
    inventoryRestoredAt: row.inventory_restored_at || undefined
  };
}

/**
 * Submit an order with atomic insertion into Supabase (Customer Storefront).
 * If Supabase is configured and insertion fails, an error is thrown to prevent
 * presenting a fake success screen to the customer.
 */
export async function submitOrderRequest(orderData: OrderSubmission): Promise<OrderRecord> {
  const totalCount = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
  const isAcknowledged = Boolean(
    orderData.acknowledgements?.stockAvailabilityConfirmed &&
    orderData.acknowledgements?.petAllergyChecked &&
    orderData.acknowledgements?.wellnessSupplementAcknowledged
  );

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('submit_customer_order', {
        p_customer: {
          fullName: orderData.customer.fullName,
          email: orderData.customer.email,
          contactNumber: orderData.customer.contactNumber,
          instagramAccount: orderData.customer.instagramAccount || null,
          preferredContact: orderData.customer.preferredContact,
          customerType: orderData.customer.customerType
        },
        p_delivery: {
          deliveryMethod: orderData.delivery.deliveryMethod,
          deliveryAddress: orderData.delivery.deliveryAddress || '',
          postalCode: orderData.delivery.postalCode || ''
        },
        p_payment_preference: orderData.paymentPreference,
        p_referral_source: orderData.referralSource,
        p_other_referral: orderData.otherReferralSource || null,
        p_items: orderData.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          packageSize: item.packageSize,
          quantity: item.quantity,
          unitPrice: item.unitPrice || 0
        })),
        p_pricing: orderData.pricing || null,
        p_acknowledgement: isAcknowledged
      });

      if (!rpcError && rpcData && rpcData.success) {
        const createdRecord: OrderRecord = {
          ...orderData,
          id: rpcData.order_id,
          orderReference: rpcData.order_reference,
          createdAt: rpcData.created_at || new Date().toISOString(),
          status: 'Pending Confirmation',
          totalItemCount: rpcData.total_item_count || totalCount,
          internalNotes: '',
          inventoryDeducted: false,
          inventoryRestored: false
        };

        // Cache locally for resilient browsing
        try {
          const localOrders = getOrders();
          localOrders.unshift(createdRecord);
          saveOrdersToStorage(localOrders);
        } catch {
          // Non-critical
        }

        return createdRecord;
      }

      if (rpcError) {
        console.error('submit_customer_order RPC error:', rpcError);
        throw new Error(rpcError.message || 'Order submission rejected by database');
      }
    } catch (rpcEx: unknown) {
      console.error('RPC execution exception:', rpcEx);
      throw rpcEx;
    }
  }

  // Fallback to local storage only if Supabase is completely unconfigured (offline dev)
  return saveLocalOrder(orderData);
}

/**
 * Fetch all orders via secure Serverless Admin API (authoritative source of truth).
 */
export async function fetchOrdersFromDb(): Promise<OrderRecord[]> {
  try {
    const res = await fetch('/api/admin-orders', {
      method: 'GET',
      credentials: 'include'
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        const records = result.data.map((row: DbOrderRow) => mapDbRowToOrderRecord(row));
        saveOrdersToStorage(records);
        return records;
      }
    }
  } catch (err) {
    console.warn('Admin API orders fetch notice:', err);
  }

  return getOrders();
}

/**
 * Fetch a single order by ID or orderReference via secure Serverless Admin API.
 */
export async function fetchOrderByIdFromDb(idOrRef: string): Promise<OrderRecord | undefined> {
  if (!idOrRef) return undefined;

  try {
    const res = await fetch(`/api/admin-orders?id=${encodeURIComponent(idOrRef)}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return mapDbRowToOrderRecord(result.data as DbOrderRow);
      }
    }
  } catch (err) {
    console.warn('Admin API single order fetch notice:', err);
  }

  const localOrders = getOrders();
  return localOrders.find((o) => o.id === idOrRef || o.orderReference === idOrRef);
}

/**
 * Update order status via secure Serverless Admin API.
 */
export async function updateOrderStatusInDb(idOrRef: string, newStatus: OrderStatus): Promise<boolean> {
  const order = await fetchOrderByIdFromDb(idOrRef);
  if (!order) return false;

  const updates: Record<string, unknown> = {
    status: newStatus
  };

  // Stock deduction tracking
  if (newStatus === 'Paid' && !order.inventoryDeducted) {
    deductOrderStockOnPayment(order);
    updates.inventory_deducted = true;
    updates.inventory_deducted_at = new Date().toISOString();
    order.inventoryDeducted = true;
    order.inventoryDeductedAt = updates.inventory_deducted_at as string;
  }

  if (newStatus === 'Cancelled' && order.inventoryDeducted && !order.inventoryRestored) {
    restoreOrderStockOnCancellation(order);
    updates.inventory_restored = true;
    updates.inventory_restored_at = new Date().toISOString();
    order.inventoryRestored = true;
    order.inventoryRestoredAt = updates.inventory_restored_at as string;
  }

  try {
    await fetch('/api/admin-orders', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'update_status',
        id: order.id,
        orderReference: order.orderReference,
        status: newStatus,
        updates
      })
    });
  } catch (err) {
    console.warn('Admin API update status notice:', err);
  }

  // Update local cache
  try {
    const orders = getOrders();
    const idx = orders.findIndex((o) => o.id === order.id || o.orderReference === order.orderReference);
    if (idx > -1) {
      orders[idx].status = newStatus;
      if (updates.inventory_deducted !== undefined) {
        orders[idx].inventoryDeducted = updates.inventory_deducted as boolean;
        orders[idx].inventoryDeductedAt = updates.inventory_deducted_at as string;
      }
      if (updates.inventory_restored !== undefined) {
        orders[idx].inventoryRestored = updates.inventory_restored as boolean;
        orders[idx].inventoryRestoredAt = updates.inventory_restored_at as string;
      }
      saveOrdersToStorage(orders);
    }
  } catch (e) {
    console.error('Failed to update status in local cache', e);
  }

  return true;
}

/**
 * Update order internal notes via secure Serverless Admin API.
 */
export async function updateOrderInternalNotesInDb(idOrRef: string, notes: string): Promise<boolean> {
  try {
    await fetch('/api/admin-orders', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'update_notes',
        id: idOrRef,
        notes
      })
    });
  } catch (err) {
    console.warn('Admin API update internal notes notice:', err);
  }

  // Update local storage cache
  try {
    const orders = getOrders();
    const idx = orders.findIndex((o) => o.id === idOrRef || o.orderReference === idOrRef);
    if (idx > -1) {
      orders[idx].internalNotes = notes;
      saveOrdersToStorage(orders);
    }
  } catch (e) {
    console.error('Failed to update internal notes in local storage', e);
  }

  return true;
}

/**
 * Fetch communication logs via secure Serverless Admin API.
 */
export async function fetchCommunicationLogsFromDb(orderId: string): Promise<CommunicationLog[]> {
  try {
    const res = await fetch(`/api/admin-communications?orderId=${encodeURIComponent(orderId)}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data.map((d: any) => ({
          id: d.id,
          orderId: d.order_id,
          orderReference: d.order_reference,
          templateType: d.template_type,
          channel: d.channel,
          message: d.message,
          adminUser: d.admin_user,
          createdAt: d.created_at,
          status: d.status
        }));
      }
    }
  } catch (err) {
    console.warn('Admin API communication logs fetch notice:', err);
  }

  return [];
}

/**
 * Save communication log via secure Serverless Admin API.
 */
export async function saveCommunicationLogInDb(
  logData: Omit<CommunicationLog, 'id' | 'createdAt'>
): Promise<CommunicationLog> {
  const newLog: CommunicationLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/admin-communications', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logData)
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        newLog.id = result.data.id;
        newLog.createdAt = result.data.created_at;
      }
    }
  } catch (err) {
    console.warn('Admin API save communication log notice:', err);
  }

  return newLog;
}

/**
 * Fetch admin notifications via secure Serverless Admin API.
 */
export async function fetchAdminNotificationsFromDb(): Promise<AdminNotification[]> {
  try {
    const res = await fetch('/api/admin-notifications', {
      method: 'GET',
      credentials: 'include'
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data.map((d: any) => ({
          id: d.id,
          orderId: d.order_id,
          orderReference: d.order_reference,
          customerName: d.customer_name,
          totalAmount: Number(d.total_amount) || 0,
          itemCount: d.item_count || 1,
          read: d.read || false,
          createdAt: d.created_at,
          type: 'new_order',
          message: `${d.customer_name} placed order ${d.order_reference} (${d.item_count} items · SGD ${Number(d.total_amount).toFixed(2)})`
        }));
      }
    }
  } catch (err) {
    console.warn('Admin API notifications fetch notice:', err);
  }

  return [];
}

/**
 * Mark notification as read via secure Serverless Admin API.
 */
export async function markNotificationReadInDb(id: string): Promise<void> {
  try {
    await fetch('/api/admin-notifications', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'mark_read', id })
    });
  } catch (err) {
    console.warn('Admin API mark notification read notice:', err);
  }
}

/**
 * Submit contact enquiry to Supabase or local storage.
 */
export async function submitContactEnquiry(enquiry: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>): Promise<ContactEnquiry> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert({
          name: enquiry.name,
          email: enquiry.email,
          subject: enquiry.subject,
          message: enquiry.message,
          status: 'new'
        })
        .select('id, created_at, status')
        .single();

      if (error) throw error;

      return {
        ...enquiry,
        id: data.id,
        createdAt: data.created_at,
        status: data.status
      };
    } catch (err) {
      console.warn('Supabase enquiry submit failed, saving locally:', err);
      return saveLocalEnquiry(enquiry);
    }
  }

  return saveLocalEnquiry(enquiry);
}

/**
 * Fetch inventory movements via secure Serverless Admin API.
 */
export async function fetchInventoryMovementsFromDb(): Promise<import('../types/inventory').InventoryMovement[]> {
  try {
    const res = await fetch('/api/admin-inventory', {
      method: 'GET',
      credentials: 'include'
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data.map((d: any) => ({
          id: d.id,
          productId: d.product_id,
          productName: d.product_name,
          sku: d.sku,
          createdAt: d.created_at,
          movementType: d.movement_type,
          quantityChange: d.quantity_change,
          stockBefore: d.stock_before,
          stockAfter: d.stock_after,
          orderId: d.order_id,
          orderReference: d.order_reference,
          reason: d.reason,
          internalNote: d.internal_note,
          adminUser: d.admin_user
        }));
      }
    }
  } catch (err) {
    console.warn('Admin API inventory movements fetch notice:', err);
  }

  return [];
}

/**
 * Save inventory movement via secure Serverless Admin API.
 */
export async function saveInventoryMovementToDb(movement: import('../types/inventory').InventoryMovement): Promise<void> {
  try {
    await fetch('/api/admin-inventory', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movement)
    });
  } catch (err) {
    console.warn('Admin API save inventory movement notice:', err);
  }
}
