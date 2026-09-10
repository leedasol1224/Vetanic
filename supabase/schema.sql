-- =========================================================================
-- VETANIC Singapore Supabase Database Schema
-- Canonical schema for production database.
-- =========================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    pet_type TEXT NOT NULL CHECK (pet_type IN ('dog', 'cat', 'both')),
    category TEXT NOT NULL,
    short_description TEXT NOT NULL,
    package_size TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
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

-- 3. Order Items Table
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

-- 4. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin' CHECK (role IN ('Owner', 'Admin', 'Staff')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Admin Notifications Table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    order_reference TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    item_count INTEGER NOT NULL DEFAULT 1,
    read BOOLEAN NOT NULL DEFAULT false,
    notification_type TEXT NOT NULL DEFAULT 'new_order',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Communication Logs Table
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

-- 7. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_admin_notif_created ON public.admin_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comm_logs_order ON public.communication_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public select orders" ON public.orders;
DROP POLICY IF EXISTS "Only active staff can view orders" ON public.orders;
CREATE POLICY "Public select orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public update orders" ON public.orders;
DROP POLICY IF EXISTS "Only active staff can update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE TO anon, authenticated USING (true);

-- Order Items Policies
DROP POLICY IF EXISTS "Public insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public insert order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public select order items" ON public.order_items;
DROP POLICY IF EXISTS "Only active staff can view order items" ON public.order_items;
CREATE POLICY "Public select order items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public update order items" ON public.order_items;
CREATE POLICY "Public update order items" ON public.order_items FOR UPDATE TO anon, authenticated USING (true);

-- Admin Notifications Policies
DROP POLICY IF EXISTS "Staff can manage notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Public access notifications" ON public.admin_notifications;
CREATE POLICY "Public access notifications" ON public.admin_notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Communication Logs Policies
DROP POLICY IF EXISTS "Staff can manage communication logs" ON public.communication_logs;
DROP POLICY IF EXISTS "Public access communication logs" ON public.communication_logs;
CREATE POLICY "Public access communication logs" ON public.communication_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enquiries Policies
DROP POLICY IF EXISTS "Public insert enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Public access enquiries" ON public.enquiries;
CREATE POLICY "Public access enquiries" ON public.enquiries FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Admin Users Policies
DROP POLICY IF EXISTS "Staff can access admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Public access admin users" ON public.admin_users;
CREATE POLICY "Public access admin users" ON public.admin_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
