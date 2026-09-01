-- VETANIC Singapore Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to initialize all tables and policies.

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
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('standard', 'self_collection', 'same_day')),
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
    )
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    package_size TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enquiries Table
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
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.enquiries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Public Access Policies (Frontend can read products and insert order/enquiries)
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
