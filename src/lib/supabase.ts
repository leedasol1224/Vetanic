import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderSubmission, OrderRecord } from '../types/order';
import { ContactEnquiry } from '../types/enquiry';
import { saveLocalOrder, saveLocalEnquiry, generateOrderReference } from './storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Submit an order either to Supabase (if configured) or safely store locally.
 */
export async function submitOrderRequest(orderData: OrderSubmission): Promise<OrderRecord> {
  const orderRef = generateOrderReference();
  const totalCount = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Insert order record
      const { data: orderRow, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_reference: orderRef,
          customer_name: orderData.customer.fullName,
          email: orderData.customer.email,
          contact_number: orderData.customer.contactNumber,
          telegram_handle: orderData.customer.telegramHandle || null,
          instagram_account: orderData.customer.instagramAccount || null,
          preferred_contact: orderData.customer.preferredContact,
          customer_type: orderData.customer.customerType,
          delivery_method: orderData.delivery.deliveryMethod,
          delivery_address: orderData.delivery.deliveryAddress || null,
          postal_code: orderData.delivery.postalCode || null,
          payment_method: orderData.paymentPreference,
          referral_source: orderData.referralSource,
          other_referral_source: orderData.otherReferralSource || null,
          acknowledgement: true,
          status: 'Pending Confirmation'
        })
        .select('id, created_at')
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      if (orderRow && orderData.items.length > 0) {
        const orderItemsPayload = orderData.items.map(item => ({
          order_id: orderRow.id,
          product_id: item.productId,
          product_name: item.productName,
          package_size: item.packageSize,
          quantity: item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) {
          console.warn('Failed to insert items to Supabase, continuing with order', itemsError);
        }
      }

      const createdRecord: OrderRecord = {
        ...orderData,
        id: orderRow?.id || `supa-${Date.now()}`,
        orderReference: orderRef,
        createdAt: orderRow?.created_at || new Date().toISOString(),
        status: 'Pending Confirmation',
        totalItemCount: totalCount
      };

      // Also save locally as backup
      saveLocalOrder(orderData);
      return createdRecord;
    } catch (err) {
      console.warn('Supabase insert failed, falling back to local persistence:', err);
      return saveLocalOrder(orderData);
    }
  }

  // Fallback to local storage
  return saveLocalOrder(orderData);
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
