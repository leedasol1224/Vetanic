-- =========================================================================
-- VETANIC SINGAPORE: ADMIN SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- Date: 2026-09-03
-- Purpose: Protect customer records, financial summaries, inventory ledgers,
--          and internal communication logs from public unauthorized access.
-- =========================================================================

-- 1. Create Admin Users table linked with Supabase Auth
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'Admin' CHECK (role IN ('Owner', 'Admin', 'Staff')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Admin Notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  order_reference TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  item_count INTEGER NOT NULL DEFAULT 1,
  read BOOLEAN NOT NULL DEFAULT false,
  notification_type TEXT NOT NULL DEFAULT 'new_order',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Communication Logs table
CREATE TABLE IF NOT EXISTS public.communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  order_reference TEXT NOT NULL,
  template_type TEXT NOT NULL,
  channel TEXT NOT NULL,
  message TEXT NOT NULL,
  admin_user TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Sent',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;

-- If orders and order_items exist, ensure RLS is enabled
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
    ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inventory_movements') THEN
    ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 5. Helper Function: Is Active Admin
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

-- 6. RLS POLICIES FOR ORDERS
-- Public (anon) can submit new orders, but CANNOT view or list other customers' orders
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only active staff can view orders" ON public.orders;
CREATE POLICY "Only active staff can view orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS "Only active staff can update orders" ON public.orders;
CREATE POLICY "Only active staff can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_active_admin());

-- 7. RLS POLICIES FOR ORDER ITEMS
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items"
  ON public.order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only active staff can view order items" ON public.order_items;
CREATE POLICY "Only active staff can view order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

-- 8. RLS POLICIES FOR ADMIN USERS, NOTIFICATIONS & LOGS
DROP POLICY IF EXISTS "Staff can access admin users" ON public.admin_users;
CREATE POLICY "Staff can access admin users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS "Staff can manage notifications" ON public.admin_notifications;
CREATE POLICY "Staff can manage notifications"
  ON public.admin_notifications FOR ALL
  TO authenticated
  USING (public.is_active_admin());

DROP POLICY IF EXISTS "Staff can manage communication logs" ON public.communication_logs;
CREATE POLICY "Staff can manage communication logs"
  ON public.communication_logs FOR ALL
  TO authenticated
  USING (public.is_active_admin());
