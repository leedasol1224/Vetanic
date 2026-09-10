-- =========================================================================
-- VETANIC SINGAPORE: PRODUCTION SUPABASE DATABASE SCHEMA & INITIAL SEED
-- Description: Complete schema for products, orders, order items, inventory,
--              admin operations, notifications, communication logs, and enquiries.
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
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
-- 2. ORDERS TABLE
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
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('standard', 'express', 'same_day', 'self_collection')),
    delivery_address TEXT,
    postal_code TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('paynow', 'bank_transfer')),
    referral_source TEXT NOT NULL,
    other_referral_source TEXT,
    acknowledgement BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'Pending Confirmation' CHECK (
        status IN (
            'Pending Confirmation',
            'Confirmed',
            'Awaiting Payment',
            'Paid',
            'Preparing',
            'Ready for Collection',
            'Out for Delivery',
            'Completed',
            'Cancelled'
        )
    ),
    pricing JSONB,
    total_item_count INT DEFAULT 0,
    internal_notes TEXT,
    inventory_deducted BOOLEAN DEFAULT false,
    inventory_deducted_at TIMESTAMPTZ,
    inventory_restored BOOLEAN DEFAULT false,
    inventory_restored_at TIMESTAMPTZ
);

-- -------------------------------------------------------------------------
-- 3. ORDER ITEMS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    package_size TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. INVENTORY MOVEMENTS TABLE (Chronological Audit Ledger)
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
    order_id UUID,
    order_reference TEXT,
    reason TEXT NOT NULL,
    internal_note TEXT,
    admin_user TEXT DEFAULT 'VETANIC Admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. ADMIN USERS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin' CHECK (role IN ('Owner', 'Admin', 'Staff')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. ADMIN NOTIFICATIONS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
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
-- 7. COMMUNICATION LOGS TABLE (Customer Response History)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    order_reference TEXT NOT NULL,
    template_type TEXT NOT NULL,
    channel TEXT NOT NULL,
    message TEXT NOT NULL,
    admin_user TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. CONTACT ENQUIRIES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved'))
);

-- -------------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_prod ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created ON public.inventory_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notif_created ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comm_logs_order ON public.communication_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- -------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public can read, authenticated can manage
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public manage products" ON public.products;
CREATE POLICY "Public manage products" ON public.products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Orders Policies: Public can insert, select, and update (used by storefront checkout & admin)
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public select orders" ON public.orders;
CREATE POLICY "Public select orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true);

-- Order Items Policies: Public can insert, select, and update
DROP POLICY IF EXISTS "Public insert order items" ON public.order_items;
CREATE POLICY "Public insert order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public select order items" ON public.order_items;
CREATE POLICY "Public select order items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public update order items" ON public.order_items;
CREATE POLICY "Public update order items" ON public.order_items FOR UPDATE TO anon, authenticated USING (true);

-- Inventory Movements Policies
DROP POLICY IF EXISTS "Public access inventory movements" ON public.inventory_movements;
CREATE POLICY "Public access inventory movements" ON public.inventory_movements FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Admin Users Policies
DROP POLICY IF EXISTS "Public access admin users" ON public.admin_users;
CREATE POLICY "Public access admin users" ON public.admin_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Notifications Policies
DROP POLICY IF EXISTS "Public access notifications" ON public.admin_notifications;
CREATE POLICY "Public access notifications" ON public.admin_notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Communication Logs Policies
DROP POLICY IF EXISTS "Public access communication logs" ON public.communication_logs;
CREATE POLICY "Public access communication logs" ON public.communication_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enquiries Policies
DROP POLICY IF EXISTS "Public access enquiries" ON public.enquiries;
CREATE POLICY "Public access enquiries" ON public.enquiries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 11. INITIAL SEED DATA (Official VETANIC Catalogue & Staff)
-- -------------------------------------------------------------------------
INSERT INTO public.products (id, name, slug, sku, pet_type, category, short_description, package_size, image_url, regular_price, launch_price, is_available, display_order)
VALUES
    ('fresh-omega-3-mini', 'Fresh Omega-3 Mini', 'fresh-omega-3-mini', 'VET-OMG-MINI', 'both', 'skin-coat', 'Pure, German KD Pharma rTG Omega-3 oil (119.5mg EPA+DHA) in an easy-to-swallow 1.0 cm mini capsule.', '9.06g (151mg × 60 capsules)', '/images/products/fresh-omega-3-mini.png', 36.00, 29.00, true, 1),
    ('fresh-omega-3-premium', 'Fresh Omega-3 Premium', 'fresh-omega-3-premium', 'VET-OMG-PREM', 'both', 'skin-coat', 'High-concentration rTG Omega-3 oil (480mg EPA+DHA) designed for medium & large companions.', '36.24g (604mg × 60 capsules)', '/images/products/fresh-omega-3-premium.png', 52.00, 42.00, true, 2),
    ('joint-support', 'Joint Support Dog Chews', 'joint-support', 'VET-JNT-DOG', 'dog', 'joint-care', 'Veterinary-grade joint mobility soft chews with Glucosamine, Shark Cartilage (Chondroitin), MSM & Green-Lipped Mussel.', '240g (4g × 60 chews)', '/images/products/joint-support.png', 48.00, 38.00, true, 3),
    ('probiotics', 'Immune & Digestive Probiotics', 'probiotics', 'VET-PRO-DOG', 'dog', 'digestion', 'Veterinary-grade synbiotics powder formulated with 10 billion CFU live lactic acid bacteria and postbiotics.', '60g (2g × 30 sachets)', '/images/products/probiotics.png', 45.00, 36.00, true, 4),
    ('clear-eyes', 'Clear Eyes & Liver Support', 'clear-eyes', 'VET-EYE-DOG', 'dog', 'eye-care', 'Complete canine ocular and hepatobiliary care powered by FloraGLO® Lutein, Zeaxanthin, Milk Thistle & Bilberry.', '60g (2g × 30 sachets)', '/images/products/clear-eyes.png', 45.00, 36.00, true, 5),
    ('urena-clear', 'Urena Clear (Kidney & Urinary)', 'urena-clear', 'VET-URN-CAT', 'cat', 'kidney-urinary', 'Targeted feline urinary tract and renal support featuring N-Acetyl-D-Glucosamine (NAG), Cranberry & D-Mannose.', '60g (2g × 30 sachets)', '/images/products/urena-clear.png', 46.00, 38.00, true, 6),
    ('hairball-care', 'Hairball Care Sticks', 'hairball-care', 'VET-HBL-CAT', 'cat', 'hairball', 'Delicious veterinary-developed puree paste formulated with dietary fiber, Oat Fiber, FOS prebiotics and LPL2 postbiotics.', '84g (14g × 6 sticks)', '/images/products/hairball-care.png', 18.00, 14.50, true, 7),
    ('soft-dental-chew', 'Soft Dental Chew (Yogurt Flavor)', 'soft-dental-chew', 'VET-DNT-CHEW', 'dog', 'dental', 'Pliable, gentle yogurt-flavored dental chew jointly developed with veterinarians for daily canine plaque care.', '300g (10g × 30 sticks)', '/images/products/soft-dental-chew.png', 22.00, 18.00, true, 8),
    ('sweet-potato-pumpkin-treats', 'Paju''s Sweet Potato & Pumpkin Treats', 'sweet-potato-pumpkin-treats', 'VET-TRT-PUMP', 'dog', 'treats', 'Naturally delicious, meat-free oven-baked reward snacks made with 100% Korean agricultural produce from Paju.', '90g', '/images/products/sweet-potato-pumpkin-treats.png', 13.00, 11.00, true, 9),
    ('freeze-dried-vegetables', '100% Korean Freeze-Dried Vegetables', 'freeze-dried-vegetables', 'VET-TRT-VEG', 'both', 'treats', 'Nutrient-rich, low-calorie 4-veggie topper crafted with 100% Korean-grown agricultural produce.', '60g', '/images/products/freeze-dried-vegetables.png', 19.00, 16.00, true, 10)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    sku = EXCLUDED.sku,
    regular_price = EXCLUDED.regular_price,
    launch_price = EXCLUDED.launch_price,
    is_available = EXCLUDED.is_available,
    display_order = EXCLUDED.display_order;

-- Default Admin User Records
INSERT INTO public.admin_users (name, email, role, active)
VALUES
    ('VETANIC Admin', 'admin@vetanic.sg', 'Admin', true),
    ('Sarah Tan (Operations)', 'sarah@vetanic.sg', 'Staff', true)
ON CONFLICT (email) DO NOTHING;

-- Initial Stock Movement Ledger Intake
INSERT INTO public.inventory_movements (product_id, product_name, sku, movement_type, quantity_change, stock_before, stock_after, reason, internal_note)
VALUES
    ('fresh-omega-3-mini', 'Fresh Omega-3 Mini', 'VET-OMG-MINI', 'Initial Stock', 40, 0, 40, 'Singapore launch initial batch intake', 'Launch stock'),
    ('fresh-omega-3-premium', 'Fresh Omega-3 Premium', 'VET-OMG-PREM', 'Initial Stock', 30, 0, 30, 'Singapore launch initial batch intake', 'Launch stock'),
    ('joint-support', 'Joint Support Dog Chews', 'VET-JNT-DOG', 'Initial Stock', 35, 0, 35, 'Singapore launch initial batch intake', 'Launch stock'),
    ('probiotics', 'Immune & Digestive Probiotics', 'VET-PRO-DOG', 'Initial Stock', 40, 0, 40, 'Singapore launch initial batch intake', 'Launch stock'),
    ('clear-eyes', 'Clear Eyes & Liver Support', 'VET-EYE-DOG', 'Initial Stock', 30, 0, 30, 'Singapore launch initial batch intake', 'Launch stock'),
    ('urena-clear', 'Urena Clear (Kidney & Urinary)', 'VET-URN-CAT', 'Initial Stock', 35, 0, 35, 'Singapore launch initial batch intake', 'Launch stock'),
    ('hairball-care', 'Hairball Care Sticks', 'VET-HBL-CAT', 'Initial Stock', 45, 0, 45, 'Singapore launch initial batch intake', 'Launch stock'),
    ('soft-dental-chew', 'Soft Dental Chew (Yogurt Flavor)', 'VET-DNT-CHEW', 'Initial Stock', 35, 0, 35, 'Singapore launch initial batch intake', 'Launch stock'),
    ('sweet-potato-pumpkin-treats', 'Paju''s Sweet Potato & Pumpkin Treats', 'VET-TRT-PUMP', 'Initial Stock', 50, 0, 50, 'Singapore launch initial batch intake', 'Launch stock'),
    ('freeze-dried-vegetables', '100% Korean Freeze-Dried Vegetables', 'VET-TRT-VEG', 'Initial Stock', 40, 0, 40, 'Singapore launch initial batch intake', 'Launch stock');
