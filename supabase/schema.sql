-- =========================================================================
-- VETANIC SINGAPORE: PRODUCTION SUPABASE DATABASE SCHEMA & MIGRATION
-- Revision: 2026-09-10 (Production Hardened - v3)
-- Purpose: Strict RLS security (zero direct anon INSERT/SELECT on orders),
--          hardened SECURITY DEFINER RPCs with safe search_path, server-side
--          order input & consent validation, no product seed in migration,
--          zero fake staff, zero invented stock.
-- =========================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 2. PRODUCTS TABLE (Schema only; Storefront uses app catalogue until migrated)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT,
    pet_type TEXT NOT NULL CHECK (pet_type IN ('dog', 'cat', 'both')),
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    package_size TEXT NOT NULL,
    image_url TEXT,
    regular_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    launch_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_available BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    instagram_account TEXT,
    preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('WhatsApp', 'Instagram DM', 'SMS')),
    customer_type TEXT NOT NULL CHECK (customer_type IN ('new', 'existing')),
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('standard', 'express')),
    delivery_address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('paynow', 'bank_transfer')),
    referral_source TEXT NOT NULL,
    other_referral_source TEXT,
    acknowledgement BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (
        status IN (
            'pending_confirmation',
            'confirmed',
            'awaiting_payment',
            'paid',
            'preparing',
            'out_for_delivery',
            'completed',
            'cancelled'
        )
    ),
    pricing JSONB,
    total_item_count INT DEFAULT 0,
    internal_notes TEXT DEFAULT '',
    inventory_deducted BOOLEAN DEFAULT false,
    inventory_deducted_at TIMESTAMPTZ,
    inventory_restored BOOLEAN DEFAULT false,
    inventory_restored_at TIMESTAMPTZ
);

-- -------------------------------------------------------------------------
-- 4. ORDER ITEMS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    package_size TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. INVENTORY MOVEMENTS TABLE (Audit Ledger for Real Stock Tracking)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    movement_type TEXT NOT NULL CHECK (
        movement_type IN (
            'Initial Stock',
            'Stock Received',
            'Sale',
            'Cancellation Restock',
            'Manual Addition',
            'Manual Reduction',
            'Stock Correction'
        )
    ),
    quantity_change INT NOT NULL,
    stock_before INT NOT NULL DEFAULT 0,
    stock_after INT NOT NULL DEFAULT 0,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    order_reference TEXT,
    reason TEXT NOT NULL,
    internal_note TEXT,
    admin_user TEXT DEFAULT 'VETANIC Admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. ADMIN USERS TABLE (Linked to real Supabase Auth accounts)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin' CHECK (role IN ('Owner', 'Admin', 'Staff')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7. ADMIN NOTIFICATIONS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    order_reference TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    item_count INT NOT NULL DEFAULT 1,
    read BOOLEAN NOT NULL DEFAULT false,
    notification_type TEXT NOT NULL DEFAULT 'new_order',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. COMMUNICATION LOGS TABLE (Customer Response History)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    order_reference TEXT NOT NULL,
    template_type TEXT NOT NULL,
    channel TEXT NOT NULL,
    message TEXT NOT NULL,
    admin_user TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 9. CONTACT ENQUIRIES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 10. PERFORMANCE INDEXES
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_contact ON public.orders(contact_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_prod ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created ON public.inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notif_created ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comm_logs_order ON public.communication_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_auth ON public.admin_users(auth_user_id);

-- -------------------------------------------------------------------------
-- 11. SECURITY DEFINER HELPER: IS ACTIVE ADMIN
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE auth_user_id = auth.uid()
          AND active = true
    );
END;
$$;

REVOKE ALL ON FUNCTION public.is_active_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

-- -------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Public can read active storefront products; Authenticated admins can manage
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (is_available = true OR public.is_active_admin());

DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Admin manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- ORDERS: Strict security. ZERO direct anonymous SELECT/INSERT/UPDATE/DELETE.
-- Public orders are submitted strictly through the controlled submit_customer_order() RPC.
DROP POLICY IF EXISTS "Public select orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;

CREATE POLICY "Admin full access orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- ORDER ITEMS: Strict security. ZERO direct anonymous SELECT/INSERT/UPDATE/DELETE.
DROP POLICY IF EXISTS "Public select order items" ON public.order_items;
DROP POLICY IF EXISTS "Public update order items" ON public.order_items;
DROP POLICY IF EXISTS "Public insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin full access order items" ON public.order_items;

CREATE POLICY "Admin full access order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- INVENTORY MOVEMENTS: Strictly admin only. No public access.
DROP POLICY IF EXISTS "Public access inventory movements" ON public.inventory_movements;
DROP POLICY IF EXISTS "Admin access inventory movements" ON public.inventory_movements;
CREATE POLICY "Admin access inventory movements"
    ON public.inventory_movements FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- ADMIN USERS: Strictly admin only.
DROP POLICY IF EXISTS "Public access admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin access admin users" ON public.admin_users;
CREATE POLICY "Admin access admin users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- ADMIN NOTIFICATIONS: Strictly admin only.
DROP POLICY IF EXISTS "Public access notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admin access notifications" ON public.admin_notifications;
CREATE POLICY "Admin access notifications"
    ON public.admin_notifications FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- COMMUNICATION LOGS: Strictly admin only.
DROP POLICY IF EXISTS "Public access communication logs" ON public.communication_logs;
DROP POLICY IF EXISTS "Admin access communication logs" ON public.communication_logs;
CREATE POLICY "Admin access communication logs"
    ON public.communication_logs FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- ENQUIRIES: Public can submit; Authenticated admins can view/manage.
DROP POLICY IF EXISTS "Public access enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin manage enquiries" ON public.enquiries;

CREATE POLICY "Public insert enquiries"
    ON public.enquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admin manage enquiries"
    ON public.enquiries FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- -------------------------------------------------------------------------
-- 13. TRANSACTIONAL RPC: SUBMIT CUSTOMER ORDER (Server-Side Atomic Operation)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_customer_order(
    p_customer JSONB,
    p_delivery JSONB,
    p_payment_preference TEXT,
    p_referral_source TEXT,
    p_other_referral TEXT,
    p_items JSONB,
    p_pricing JSONB,
    p_acknowledgement BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order_id UUID;
    v_order_ref TEXT;
    v_created_at TIMESTAMPTZ := NOW();
    v_year TEXT := TO_CHAR(NOW(), 'YYYY');
    v_rand_num INT := FLOOR(1000 + RANDOM() * 9000)::INT;
    v_item JSONB;
    v_total_items INT := 0;
    v_item_qty INT;
    v_item_price NUMERIC;
    v_cust_name TEXT;
    v_cust_email TEXT;
    v_cust_phone TEXT;
    v_pref_contact TEXT;
    v_cust_type TEXT;
    v_deliv_method TEXT;
    v_deliv_addr TEXT;
    v_postal TEXT;
    v_est_total NUMERIC;
BEGIN
    -- 1. Input Validation: Explicit Consent / Acknowledgements
    IF p_acknowledgement IS NOT TRUE THEN
        RAISE EXCEPTION 'Customer must accept order acknowledgements and policy terms to submit an order.';
    END IF;

    -- 2. Input Validation: Customer Details
    IF p_customer IS NULL THEN
        RAISE EXCEPTION 'Customer details payload is required.';
    END IF;

    v_cust_name := TRIM(COALESCE(p_customer->>'fullName', ''));
    IF LENGTH(v_cust_name) < 2 THEN
        RAISE EXCEPTION 'Customer full name is required (minimum 2 characters).';
    END IF;

    v_cust_email := TRIM(COALESCE(p_customer->>'email', ''));
    IF NOT (v_cust_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
        RAISE EXCEPTION 'A valid email address is required.';
    END IF;

    v_cust_phone := TRIM(COALESCE(p_customer->>'contactNumber', ''));
    IF LENGTH(REGEXP_REPLACE(v_cust_phone, '\D', '', 'g')) < 8 THEN
        RAISE EXCEPTION 'A valid contact number with at least 8 digits is required.';
    END IF;

    v_pref_contact := COALESCE(p_customer->>'preferredContact', '');
    IF v_pref_contact NOT IN ('WhatsApp', 'Instagram DM', 'SMS') THEN
        RAISE EXCEPTION 'Invalid preferred contact method. Allowed: WhatsApp, Instagram DM, SMS.';
    END IF;

    v_cust_type := COALESCE(p_customer->>'customerType', '');
    IF v_cust_type NOT IN ('new', 'existing') THEN
        RAISE EXCEPTION 'Invalid customer type. Allowed: new, existing.';
    END IF;

    -- 3. Input Validation: Delivery Details
    IF p_delivery IS NULL THEN
        RAISE EXCEPTION 'Delivery details payload is required.';
    END IF;

    v_deliv_method := COALESCE(p_delivery->>'deliveryMethod', '');
    IF v_deliv_method NOT IN ('standard', 'express') THEN
        RAISE EXCEPTION 'Delivery method must be standard or express.';
    END IF;

    v_deliv_addr := TRIM(COALESCE(p_delivery->>'deliveryAddress', ''));
    IF LENGTH(v_deliv_addr) < 5 THEN
        RAISE EXCEPTION 'Delivery address is required (minimum 5 characters).';
    END IF;

    v_postal := TRIM(COALESCE(p_delivery->>'postalCode', ''));
    IF NOT (v_postal ~ '^[0-9]{6}$') THEN
        RAISE EXCEPTION 'A valid 6-digit Singapore postal code is required.';
    END IF;

    -- 4. Input Validation: Payment Preference
    IF p_payment_preference NOT IN ('paynow', 'bank_transfer') THEN
        RAISE EXCEPTION 'Payment method must be paynow or bank_transfer.';
    END IF;

    -- 5. Input Validation: Order Items (Sanity & Payload bounds)
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cannot submit order with empty items list.';
    END IF;

    IF jsonb_array_length(p_items) > 50 THEN
        RAISE EXCEPTION 'Order item limit exceeded (maximum 50 items per order).';
    END IF;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        IF v_item->>'productId' IS NULL OR TRIM(v_item->>'productId') = '' THEN
            RAISE EXCEPTION 'Each order item must specify a valid productId.';
        END IF;

        IF v_item->>'quantity' IS NULL OR NOT (v_item->>'quantity' ~ '^[1-9][0-9]*$') THEN
            RAISE EXCEPTION 'Item quantity must be a positive integer.';
        END IF;

        v_item_qty := (v_item->>'quantity')::INT;
        IF v_item_qty < 1 OR v_item_qty > 100 THEN
            RAISE EXCEPTION 'Item quantity per line must be between 1 and 100.';
        END IF;

        v_total_items := v_total_items + v_item_qty;
    END LOOP;

    -- 6. Generate unique human-readable order reference
    v_order_ref := 'VET-' || v_year || '-' || v_rand_num::TEXT;
    WHILE EXISTS (SELECT 1 FROM public.orders WHERE order_reference = v_order_ref) LOOP
        v_rand_num := FLOOR(1000 + RANDOM() * 9000)::INT;
        v_order_ref := 'VET-' || v_year || '-' || v_rand_num::TEXT;
    END LOOP;

    -- 7. Insert primary orders record (Status: pending_confirmation)
    INSERT INTO public.orders (
        order_reference,
        created_at,
        customer_name,
        email,
        contact_number,
        instagram_account,
        preferred_contact,
        customer_type,
        delivery_method,
        delivery_address,
        postal_code,
        payment_method,
        referral_source,
        other_referral_source,
        acknowledgement,
        status,
        pricing,
        total_item_count,
        internal_notes,
        inventory_deducted,
        inventory_restored
    ) VALUES (
        v_order_ref,
        v_created_at,
        v_cust_name,
        v_cust_email,
        v_cust_phone,
        NULLIF(TRIM(p_customer->>'instagramAccount'), ''),
        v_pref_contact,
        v_cust_type,
        v_deliv_method,
        v_deliv_addr,
        v_postal,
        p_payment_preference,
        COALESCE(p_referral_source, 'Other'),
        NULLIF(TRIM(p_other_referral), ''),
        true,
        'pending_confirmation',
        p_pricing,
        v_total_items,
        '',
        false,
        false
    )
    RETURNING id INTO v_order_id;

    -- 8. Insert all order items atomically
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_item_qty := (v_item->>'quantity')::INT;
        v_item_price := COALESCE(NULLIF(v_item->>'unitPrice', '')::NUMERIC, 0.00);

        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            package_size,
            quantity,
            unit_price,
            created_at
        ) VALUES (
            v_order_id,
            TRIM(v_item->>'productId'),
            COALESCE(TRIM(v_item->>'productName'), 'Product Item'),
            COALESCE(TRIM(v_item->>'packageSize'), ''),
            v_item_qty,
            v_item_price,
            v_created_at
        );
    END LOOP;

    -- 9. Create internal admin notification row
    v_est_total := COALESCE(NULLIF(p_pricing->>'estimatedTotal', '')::NUMERIC, 0.00);
    INSERT INTO public.admin_notifications (
        order_id,
        order_reference,
        customer_name,
        total_amount,
        item_count,
        read,
        notification_type,
        message,
        created_at
    ) VALUES (
        v_order_id,
        v_order_ref,
        v_cust_name,
        v_est_total,
        v_total_items,
        false,
        'new_order',
        v_cust_name || ' placed order ' || v_order_ref || ' (' || v_total_items::TEXT || ' items)',
        v_created_at
    );

    -- 10. Return success response payload
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_reference', v_order_ref,
        'created_at', v_created_at,
        'status', 'pending_confirmation',
        'total_item_count', v_total_items
    );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_customer_order(JSONB, JSONB, TEXT, TEXT, TEXT, JSONB, JSONB, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_customer_order(JSONB, JSONB, TEXT, TEXT, TEXT, JSONB, JSONB, BOOLEAN) TO anon, authenticated;

-- -------------------------------------------------------------------------
-- 14. SECURE GUEST RPC: LOOKUP GUEST ORDER (Requires Reference + Contact Match)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.lookup_guest_order(
    p_order_reference TEXT,
    p_contact_number TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
    v_clean_ref TEXT := UPPER(TRIM(COALESCE(p_order_reference, '')));
    v_clean_phone TEXT := REGEXP_REPLACE(TRIM(COALESCE(p_contact_number, '')), '\D', '', 'g');
BEGIN
    IF v_clean_ref = '' OR v_clean_phone = '' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'We could not find an order matching those details. Please verify your reference and mobile number.'
        );
    END IF;

    -- Extract last 8 digits for Singapore phone matching
    IF LENGTH(v_clean_phone) >= 8 THEN
        v_clean_phone := RIGHT(v_clean_phone, 8);
    END IF;

    -- Find matching order
    SELECT * INTO v_order
    FROM public.orders
    WHERE UPPER(order_reference) = v_clean_ref
      AND RIGHT(REGEXP_REPLACE(contact_number, '\D', '', 'g'), 8) = v_clean_phone
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'We could not find an order matching those details. Please verify your reference and mobile number.'
        );
    END IF;

    -- Fetch order items for this order
    SELECT jsonb_agg(
        jsonb_build_object(
            'productId', product_id,
            'productName', product_name,
            'packageSize', package_size,
            'quantity', quantity,
            'unitPrice', unit_price
        )
    ) INTO v_items
    FROM public.order_items
    WHERE order_id = v_order.id;

    -- Return safe sanitized customer order view (without internal notes or unrestricted DB access)
    RETURN jsonb_build_object(
        'success', true,
        'order', jsonb_build_object(
            'id', v_order.id,
            'orderReference', v_order.order_reference,
            'createdAt', v_order.created_at,
            'customerName', v_order.customer_name,
            'contactNumberMasked', '+65 **** ' || RIGHT(REGEXP_REPLACE(v_order.contact_number, '\D', '', 'g'), 4),
            'deliveryMethod', v_order.delivery_method,
            'deliveryAddressMasked', SUBSTRING(v_order.delivery_address, 1, 8) || '...',
            'postalCode', v_order.postal_code,
            'paymentPreference', v_order.payment_method,
            'status', v_order.status,
            'pricing', v_order.pricing,
            'totalItemCount', v_order.total_item_count,
            'items', COALESCE(v_items, '[]'::jsonb)
        )
    );
END;
$$;

REVOKE ALL ON FUNCTION public.lookup_guest_order(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_guest_order(TEXT, TEXT) TO anon, authenticated;
