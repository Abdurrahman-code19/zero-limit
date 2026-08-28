-- Zero Limit: Admin RLS write policies
-- Idempotent: safe to run repeatedly in Supabase SQL Editor.
-- Unblocks admin INSERT/UPDATE/DELETE on the tables the admin panel manages,
-- for any authenticated user whose profiles.role is admin or super_admin.

-- Helper: admin check used by every policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

-- PRODUCTS
DROP POLICY IF EXISTS "Admins can write products" ON public.products;
CREATE POLICY "Admins can write products" ON public.products
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PRODUCT VARIANTS
DROP POLICY IF EXISTS "Admins can write variants" ON public.product_variants;
CREATE POLICY "Admins can write variants" ON public.product_variants
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CATEGORIES
DROP POLICY IF EXISTS "Admins can write categories" ON public.categories;
CREATE POLICY "Admins can write categories" ON public.categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COLLECTIONS
DROP POLICY IF EXISTS "Admins can write collections" ON public.collections;
CREATE POLICY "Admins can write collections" ON public.collections
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COLLECTION PRODUCTS
DROP POLICY IF EXISTS "Admins can write collection products" ON public.collection_products;
CREATE POLICY "Admins can write collection products" ON public.collection_products
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COUPONS
DROP POLICY IF EXISTS "Admins can write coupons" ON public.coupons;
CREATE POLICY "Admins can write coupons" ON public.coupons
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ORDERS (admin update existing orders; admins never create orders directly)
DROP POLICY IF EXISTS "Admins can write orders" ON public.orders;
CREATE POLICY "Admins can write orders" ON public.orders
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ORDER ITEMS (needed so admin order reads/updates that cascade work)
DROP POLICY IF EXISTS "Admins can write order items" ON public.order_items;
CREATE POLICY "Admins can write order items" ON public.order_items
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- REVIEWS (admin moderation: approve / delete)
DROP POLICY IF EXISTS "Admins can write reviews" ON public.reviews;
CREATE POLICY "Admins can write reviews" ON public.reviews
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RETURN REQUESTS (admin approval workflow)
DROP POLICY IF EXISTS "Admins can write return requests" ON public.return_requests;
CREATE POLICY "Admins can write return requests" ON public.return_requests
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SETTINGS (old table)
DROP POLICY IF EXISTS "Admins can write settings" ON public.settings;
CREATE POLICY "Admins can write settings" ON public.settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- STORE SETTINGS
DROP POLICY IF EXISTS "Admins can write store settings" ON public.store_settings;
CREATE POLICY "Admins can write store settings" ON public.store_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CMS CONTENT
DROP POLICY IF EXISTS "Admins can write cms content" ON public.cms_content;
CREATE POLICY "Admins can write cms content" ON public.cms_content
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- NEWSLETTER SUBSCRIBERS (admins can delete/list; inserts are public)
DROP POLICY IF EXISTS "Admins can write newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can write newsletter subscribers" ON public.newsletter_subscribers
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PROFILES (Admins section: change another user's role)
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ACTIVITY LOGS (admin cleanup; insert already allowed for auth)
DROP POLICY IF EXISTS "Admins can manage activity logs" ON public.activity_logs;
CREATE POLICY "Admins can manage activity logs" ON public.activity_logs
  FOR DELETE USING (public.is_admin()) WITH CHECK (public.is_admin());
