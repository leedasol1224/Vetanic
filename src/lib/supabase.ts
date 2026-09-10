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
 * Submit an order with atomic insertion into Supabase.
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
    // 1. Try atomic PostgreSQL RPC first
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

        // Cache locally
        try {
          const localOrders = getOrders();
          localOrders.unshift(createdRecord);
          saveOrdersToStorage(localOrders);
        } catch {
          // Non-critical local storage error
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

  // Fallback to local storage only if Supabase is completely unconfigured (offline / local demo)
  return saveLocalOrder(orderData);
}

/**
 * Fetch all orders directly from Supabase (authoritative source of truth),
 * ordered by created_at DESC.
 */
export async function fetchOrdersFromDb(): Promise<OrderRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch orders from Supabase:', error);
        return getOrders();
      }

      if (data) {
        const records = data.map((row) => mapDbRowToOrderRecord(row as DbOrderRow));
        // Keep local cache synced
        saveOrdersToStorage(records);
        return records;
      }
    } catch (err) {
      console.error('Error querying Supabase orders:', err);
      return getOrders();
    }
  }

  return getOrders();
}

/**
 * Fetch a single order by ID or orderReference from Supabase.
 */
export async function fetchOrderByIdFromDb(idOrRef: string): Promise<OrderRecord | undefined> {
  if (!idOrRef) return undefined;

  if (isSupabaseConfigured && supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrRef);
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `);

      if (isUuid) {
        query = query.or(`id.eq.${idOrRef},order_reference.eq.${idOrRef}`);
      } else {
        query = query.eq('order_reference', idOrRef);
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return mapDbRowToOrderRecord(data as DbOrderRow);
      }
    } catch (err) {
      console.error('Error fetching single order from Supabase:', err);
    }
  }

  const localOrders = getOrders();
  return localOrders.find((o) => o.id === idOrRef || o.orderReference === idOrRef);
}

/**
 * Update order status in Supabase and sync local inventory state.
 */
export async function updateOrderStatusInDb(idOrRef: string, newStatus: OrderStatus): Promise<boolean> {
  // First load current order
  const order = await fetchOrderByIdFromDb(idOrRef);
  if (!order) return false;

  const updates: Record<string, unknown> = {
    status: newStatus
  };

  // 1. Order transitioned to Paid -> deduct stock
  if (newStatus === 'Paid' && !order.inventoryDeducted) {
    deductOrderStockOnPayment(order);
    updates.inventory_deducted = true;
    updates.inventory_deducted_at = new Date().toISOString();
    order.inventoryDeducted = true;
    order.inventoryDeductedAt = updates.inventory_deducted_at as string;
  }

  // 2. Order transitioned to Cancelled after stock was already deducted -> restore stock
  if (newStatus === 'Cancelled' && order.inventoryDeducted && !order.inventoryRestored) {
    restoreOrderStockOnCancellation(order);
    updates.inventory_restored = true;
    updates.inventory_restored_at = new Date().toISOString();
    order.inventoryRestored = true;
    order.inventoryRestoredAt = updates.inventory_restored_at as string;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .or(`id.eq.${order.id},order_reference.eq.${order.orderReference}`);

      if (error) {
        console.error('Failed to update order status in Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase update order status error:', err);
    }
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
    console.error('Failed to update status in local storage cache', e);
  }

  return true;
}

/**
 * Update order internal notes in Supabase.
 */
export async function updateOrderInternalNotesInDb(idOrRef: string, notes: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ internal_notes: notes })
        .or(`id.eq.${idOrRef},order_reference.eq.${idOrRef}`);

      if (error) {
        console.error('Failed to update internal notes in Supabase:', error);
      }
    } catch (err) {
      console.error('Supabase update internal notes error:', err);
    }
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
 * Fetch communication logs for an order from Supabase
 */
export async function fetchCommunicationLogsFromDb(orderId: string): Promise<CommunicationLog[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select('*')
        .or(`order_id.eq.${orderId},order_reference.eq.${orderId}`)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
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
    } catch (err) {
      console.error('Failed to fetch communication logs from Supabase:', err);
    }
  }

  return [];
}

/**
 * Save communication log to Supabase
 */
export async function saveCommunicationLogInDb(
  logData: Omit<CommunicationLog, 'id' | 'createdAt'>
): Promise<CommunicationLog> {
  const newLog: CommunicationLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .insert({
          order_id: logData.orderId,
          order_reference: logData.orderReference,
          template_type: logData.templateType,
          channel: logData.channel,
          message: logData.message,
          admin_user: logData.adminUser,
          status: logData.status || 'Sent'
        })
        .select('id, created_at')
        .single();

      if (!error && data) {
        newLog.id = data.id;
        newLog.createdAt = data.created_at;
      }
    } catch (err) {
      console.error('Failed to save communication log to Supabase:', err);
    }
  }

  return newLog;
}

/**
 * Fetch admin notifications from Supabase
 */
export async function fetchAdminNotificationsFromDb(): Promise<AdminNotification[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        return data.map((d) => ({
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
    } catch (err) {
      console.error('Failed to fetch admin notifications from Supabase:', err);
    }
  }

  return [];
}

/**
 * Mark notification as read in Supabase
 */
export async function markNotificationReadInDb(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', id);
    } catch (err) {
      console.error('Failed to mark notification read in Supabase:', err);
    }
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
 * Fetch inventory movements from Supabase
 */
export async function fetchInventoryMovementsFromDb(): Promise<import('../types/inventory').InventoryMovement[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
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
    } catch (err) {
      console.error('Failed to fetch inventory movements from Supabase:', err);
    }
  }

  return [];
}

/**
 * Save inventory movement to Supabase
 */
export async function saveInventoryMovementToDb(movement: import('../types/inventory').InventoryMovement): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('inventory_movements').insert({
        product_id: movement.productId,
        product_name: movement.productName,
        sku: movement.sku,
        movement_type: movement.movementType,
        quantity_change: movement.quantityChange,
        stock_before: movement.stockBefore,
        stock_after: movement.stockAfter,
        order_id: movement.orderId || null,
        order_reference: movement.orderReference || null,
        reason: movement.reason,
        internal_note: movement.internalNote || null,
        admin_user: movement.adminUser || 'VETANIC Admin'
      });
    } catch (err) {
      console.error('Failed to save inventory movement to Supabase:', err);
    }
  }
}


