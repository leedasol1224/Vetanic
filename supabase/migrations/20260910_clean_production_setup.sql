-- =========================================================================
-- VETANIC SINGAPORE: PRODUCTION SUPABASE DATABASE SCHEMA & MIGRATION
-- Revision: 2026-09-10 (Production Hardened)
-- Purpose: Strict RLS security, transactional RPC order creation, secure guest
--          lookup, exact product catalogue, canonical snake_case statuses,
--          zero fake staff, zero invented stock.
-- =========================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
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
    telegram_handle TEXT,
    instagram_account TEXT,
    preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('WhatsApp', 'Telegram', 'Instagram DM', 'SMS')),
    customer_type TEXT NOT NULL CHECK (customer_type IN ('new', 'existing')),
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('standard', 'express')),
    delivery_address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('paynow', 'bank_transfer')),
    referral_source TEXT NOT NULL,
    other_referral_source TEXT,
    acknowledgement BOOLEAN DEFAULT true,
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

-- -------------------------------------------------------------------------
-- 11. SECURITY DEFINER HELPER: IS ACTIVE ADMIN
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE auth_user_id = auth.uid()
          AND active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- ORDERS: Strict security. Public anon CANNOT list/select/update orders.
-- Authenticated admins can perform full management.
DROP POLICY IF EXISTS "Public select orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;

CREATE POLICY "Admin full access orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

-- Fallback direct INSERT for public orders (if not calling submit RPC)
CREATE POLICY "Public insert orders"
    ON public.orders FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- ORDER ITEMS: Public anon CANNOT list/select/update.
DROP POLICY IF EXISTS "Public select order items" ON public.order_items;
DROP POLICY IF EXISTS "Public update order items" ON public.order_items;
DROP POLICY IF EXISTS "Public insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin full access order items" ON public.order_items;

CREATE POLICY "Admin full access order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (public.is_active_admin())
    WITH CHECK (public.is_active_admin());

CREATE POLICY "Public insert order items"
    ON public.order_items FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

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
    p_pricing JSONB
)
RETURNS JSONB AS $$
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
BEGIN
    -- 1. Generate unique human-readable order reference
    v_order_ref := 'VET-' || v_year || '-' || v_rand_num::TEXT;
    
    -- Ensure reference uniqueness in edge case of collision
    WHILE EXISTS (SELECT 1 FROM public.orders WHERE order_reference = v_order_ref) LOOP
        v_rand_num := FLOOR(1000 + RANDOM() * 9000)::INT;
        v_order_ref := 'VET-' || v_year || '-' || v_rand_num::TEXT;
    END LOOP;

    -- 2. Validate items
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Cannot submit order with empty items list.';
    END IF;

    -- Calculate total item count
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_item_qty := COALESCE((v_item->>'quantity')::INT, 1);
        v_total_items := v_total_items + v_item_qty;
    END LOOP;

    -- 3. Insert primary orders record (Pending Confirmation, no stock deduction)
    INSERT INTO public.orders (
        order_reference,
        created_at,
        customer_name,
        email,
        contact_number,
        telegram_handle,
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
        TRIM(p_customer->>'fullName'),
        TRIM(p_customer->>'email'),
        TRIM(p_customer->>'contactNumber'),
        NULLIF(TRIM(p_customer->>'telegramHandle'), ''),
        NULLIF(TRIM(p_customer->>'instagramAccount'), ''),
        p_customer->>'preferredContact',
        p_customer->>'customerType',
        p_delivery->>'deliveryMethod',
        TRIM(p_delivery->>'deliveryAddress'),
        TRIM(p_delivery->>'postalCode'),
        p_payment_preference,
        p_referral_source,
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

    -- 4. Insert all order items atomically
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_item_qty := COALESCE((v_item->>'quantity')::INT, 1);
        v_item_price := COALESCE((v_item->>'unitPrice')::NUMERIC, 0.00);

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
            v_item->>'productId',
            v_item->>'productName',
            COALESCE(v_item->>'packageSize', ''),
            v_item_qty,
            v_item_price,
            v_created_at
        );
    END LOOP;

    -- 5. Create internal admin notification row
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
        TRIM(p_customer->>'fullName'),
        COALESCE((p_pricing->>'estimatedTotal')::NUMERIC, 0.00),
        v_total_items,
        false,
        'new_order',
        TRIM(p_customer->>'fullName') || ' placed order ' || v_order_ref,
        v_created_at
    );

    -- 6. Return response payload
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_reference', v_order_ref,
        'created_at', v_created_at,
        'status', 'pending_confirmation',
        'total_item_count', v_total_items
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.submit_customer_order TO anon, authenticated;

-- -------------------------------------------------------------------------
-- 14. SECURE GUEST RPC: LOOKUP GUEST ORDER (Requires Reference + Contact Match)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.lookup_guest_order(
    p_order_reference TEXT,
    p_contact_number TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
    v_clean_ref TEXT := UPPER(TRIM(p_order_reference));
    v_clean_phone TEXT := REGEXP_REPLACE(TRIM(p_contact_number), '\D', '', 'g');
BEGIN
    IF v_clean_ref IS NULL OR v_clean_ref = '' OR v_clean_phone IS NULL OR v_clean_phone = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid reference or contact number.');
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.lookup_guest_order TO anon, authenticated;

-- -------------------------------------------------------------------------
-- 15. INITIAL CATALOGUE SEED (Derived Exactly From Current Website Products)
-- -------------------------------------------------------------------------
INSERT INTO public.products (id, name, slug, sku, pet_type, category, short_description, package_size, image_url, regular_price, launch_price, is_available, display_order)
VALUES
    (
        'fresh-omega-3-mini',
        'Fresh Omega-3 Mini',
        'fresh-omega-3-mini',
        'VET-OMG-MINI',
        'both',
        'skin-coat',
        'Pure, German KD Pharma rTG Omega-3 oil (119.5mg EPA+DHA) in an easy-to-swallow 1.0 cm mini capsule.',
        '9.06g (151mg × 60 capsules)',
        '/images/products/fresh-omega-3-mini.png',
        24.90,
        22.90,
        true,
        1
    ),
    (
        'joint-support',
        'Joint Support ver 2.0',
        'joint-support',
        'VET-JNT-SUPP',
        'dog',
        'joint-care',
        'Meat-free sweet potato puree formula with Boswellia, OptiMSM, Lilium extract, and NAG for dual joint & cartilage care in dogs.',
        '150g (10g × 15 sticks)',
        '/images/products/joint-support.png',
        24.90,
        22.90,
        true,
        2
    ),
    (
        'probiotics',
        'Postbiotics for Dog Digestion',
        'probiotics',
        'VET-DIG-PROB',
        'dog',
        'digestion',
        '5-strain patented lactic acid bacteria + 3rd generation heat-treated postbiotics puree for comprehensive canine gut flora support.',
        '150g (10g × 15 sticks)',
        '/images/products/probiotics.png',
        24.90,
        22.90,
        true,
        3
    ),
    (
        'clear-eyes',
        'Clear Eyes & Tear Stain Care',
        'clear-eyes',
        'VET-EYE-CARE',
        'dog',
        'eye-care',
        'Veterinary-curated dual eye & liver support puree with FloraGLO Lutein, Bilberry, Milk Thistle, and Astaxanthin.',
        '150g (10g × 15 sticks)',
        '/images/products/clear-eyes.png',
        34.90,
        32.90,
        true,
        4
    ),
    (
        'urena-clear',
        'Urena Clear (Cat Urinary & Kidney)',
        'urena-clear',
        'VET-CAT-UREN',
        'cat',
        'kidney-urinary',
        'Meat-free, high-moisture Korean purple sweet potato puree with Cranberry, D-Mannose, GABA, and Chitosan for feline renal and urinary health.',
        '150g (10g × 15 sticks)',
        '/images/products/urena-clear.png',
        34.90,
        32.90,
        true,
        5
    ),
    (
        'hairball-care',
        'Hairball Care Puree Paste',
        'hairball-care',
        'VET-CAT-HAIR',
        'cat',
        'hairball',
        'Dietary fiber paste with Oat Fiber, Psyllium Husk, FOS, and LPL2 postbiotics for smooth feline digestive transit.',
        '84g (14g × 6 sticks)',
        '/images/products/hairball-care.png',
        34.90,
        32.90,
        true,
        6
    ),
    (
        'fresh-omega-3-premium',
        'Fresh Omega-3 Premium',
        'fresh-omega-3-premium',
        'VET-OMG-PREM',
        'both',
        'skin-coat',
        'High-potency German KD Pharma rTG fish oil (480mg EPA+DHA) formulated for medium & large companion animals.',
        '36.24g (604mg × 60 capsules)',
        '/images/products/fresh-omega-3-premium.png',
        34.90,
        32.90,
        true,
        7
    ),
    (
        'soft-dental-chew',
        'Soft Dental Chew (Yogurt Flavor)',
        'soft-dental-chew',
        'VET-DNT-CHEW',
        'dog',
        'dental',
        'Pliable, gentle yogurt-flavored dental chew jointly developed with veterinarians for daily canine plaque care.',
        '300g (10g × 30 sticks)',
        '/images/products/soft-dental-chew.png',
        34.90,
        32.90,
        true,
        8
    ),
    (
        'sweet-potato-pumpkin-treats',
        'Paju''s Sweet Potato & Pumpkin Treats',
        'sweet-potato-pumpkin-treats',
        'VET-TRT-PUMP',
        'dog',
        'treats',
        'Naturally delicious, meat-free oven-baked reward snacks made with 100% Korean agricultural produce from Paju.',
        '90g',
        '/images/products/sweet-potato-pumpkin-treats.png',
        13.90,
        11.90,
        true,
        9
    ),
    (
        'freeze-dried-vegetables',
        '100% Korean Freeze-Dried Vegetables',
        'freeze-dried-vegetables',
        'VET-TRT-VEG',
        'both',
        'treats',
        'Nutrient-rich, low-calorie 4-veggie topper crafted with 100% Korean-grown agricultural produce.',
        '60g',
        '/images/products/freeze-dried-vegetables.png',
        18.90,
        16.90,
        true,
        10
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    sku = EXCLUDED.sku,
    regular_price = EXCLUDED.regular_price,
    launch_price = EXCLUDED.launch_price,
    is_available = EXCLUDED.is_available,
    display_order = EXCLUDED.display_order;
