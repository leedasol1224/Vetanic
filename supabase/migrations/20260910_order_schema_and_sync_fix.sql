-- =========================================================================
-- VETANIC SINGAPORE: DATABASE FIX & SINGLE SOURCE OF TRUTH MIGRATION
-- Date: 2026-09-10
-- Purpose: Fix order insertion check constraints (add 'express'),
--          add missing pricing, inventory, and notes columns,
--          and ensure public/admin RLS policies allow seamless data sync.
-- =========================================================================

-- 1. Ensure 'delivery_method' CHECK constraint supports 'express'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_delivery_method_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_delivery_method_check 
  CHECK (delivery_method IN ('standard', 'express', 'same_day', 'self_collection'));

-- 2. Add missing columns to 'orders' table safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'pricing') THEN
    ALTER TABLE public.orders ADD COLUMN pricing JSONB;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total_item_count') THEN
    ALTER TABLE public.orders ADD COLUMN total_item_count INT DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'internal_notes') THEN
    ALTER TABLE public.orders ADD COLUMN internal_notes TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'inventory_deducted') THEN
    ALTER TABLE public.orders ADD COLUMN inventory_deducted BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'inventory_deducted_at') THEN
    ALTER TABLE public.orders ADD COLUMN inventory_deducted_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'inventory_restored') THEN
    ALTER TABLE public.orders ADD COLUMN inventory_restored BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'inventory_restored_at') THEN
    ALTER TABLE public.orders ADD COLUMN inventory_restored_at TIMESTAMPTZ;
  END IF;
END $$;

-- 3. Add 'unit_price' to 'order_items' table safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'unit_price') THEN
    ALTER TABLE public.order_items ADD COLUMN unit_price NUMERIC(10,2) DEFAULT 0.00;
  END IF;
END $$;

-- 4. Enable Row Level Security (RLS) on all core tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 5. Orders Policies (Allow anon/auth insert, select, and update)
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public insert orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public select orders" ON public.orders;
DROP POLICY IF EXISTS "Only active staff can view orders" ON public.orders;
CREATE POLICY "Public select orders"
  ON public.orders FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public update orders" ON public.orders;
DROP POLICY IF EXISTS "Only active staff can update orders" ON public.orders;
CREATE POLICY "Public update orders"
  ON public.orders FOR UPDATE
  TO anon, authenticated
  USING (true);

-- 6. Order Items Policies (Allow anon/auth insert, select, and update)
DROP POLICY IF EXISTS "Public insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public insert order items"
  ON public.order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public select order items" ON public.order_items;
DROP POLICY IF EXISTS "Only active staff can view order items" ON public.order_items;
CREATE POLICY "Public select order items"
  ON public.order_items FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public update order items" ON public.order_items;
CREATE POLICY "Public update order items"
  ON public.order_items FOR UPDATE
  TO anon, authenticated
  USING (true);

-- 7. Ensure Indexes exist for fast queries
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
