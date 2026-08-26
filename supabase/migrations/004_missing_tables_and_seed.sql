-- Zero Limit: Missing Tables + Real Product Seed Data
-- Run this in Supabase SQL Editor

-- ============================================
-- STORE SETTINGS (flat key-value store)
-- ============================================
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT DEFAULT 'Zero Limit',
  store_email TEXT DEFAULT 'support@zerolimit.store',
  store_address TEXT DEFAULT 'Lagos, Nigeria',
  store_phone TEXT DEFAULT '',
  shipping_fee NUMERIC DEFAULT 2000,
  free_shipping_threshold NUMERIC DEFAULT 50000,
  currency TEXT DEFAULT 'NGN',
  meta_title TEXT DEFAULT 'Zero Limit - Premium Fashion',
  meta_description TEXT DEFAULT 'Discover premium fashion at Zero Limit.',
  announcement_text TEXT DEFAULT 'Free shipping on orders over ₦50,000',
  announcement_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.store_settings (store_name, store_email, store_address, shipping_fee, free_shipping_threshold, currency)
VALUES ('Zero Limit', 'support@zerolimit.store', 'Lagos, Nigeria', 2000, 50000, 'NGN')
ON CONFLICT DO NOTHING;

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage store settings" ON public.store_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- CMS CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS public.cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.cms_content (page_key, title, content) VALUES
  ('hero_title', 'Beyond Limits. Beyond Style.', 'The hero banner title for the homepage'),
  ('hero_subtitle', 'Discover curated fashion pieces that define contemporary elegance.', 'The hero banner subtitle'),
  ('about_heading', 'About Zero Limit', 'Main heading for the about page'),
  ('about_text', 'Zero Limit was born from a simple belief: fashion should be fearless. We curate premium pieces that push boundaries while maintaining the quality and craftsmanship you deserve.', 'About page main text'),
  ('size_guide', 'S: Chest 36" | M: Chest 38" | L: Chest 40" | XL: Chest 42"', 'Size guide measurements')
ON CONFLICT (page_key) DO NOTHING;

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read CMS content" ON public.cms_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage CMS content" ON public.cms_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'order',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark own notifications read" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read, created_at DESC);

-- ============================================
-- SEED REAL PRODUCTS
-- ============================================

-- First, get the category IDs (using slugs)
-- Categories from 001 migration: new-arrivals, best-sellers, luxury-collection, streetwear, accessories, essentials

INSERT INTO public.products (name, slug, description, price, image_url, category_id, is_active, stock_quantity) VALUES
  ('Lightning Strike Tee', 'lightning-strike-tee', 'Bold graphic tee with electric lightning design. Premium cotton blend for maximum comfort and style.', 23000, '/products/lightning-strike.jpg', (SELECT id FROM categories WHERE slug = 'streetwear'), true, 50),
  ('Bernie Tee', 'bernie-tee', 'Classic Bernie-inspired graphic tee. Soft premium cotton with a relaxed fit.', 13000, '/products/bernie.jpg', (SELECT id FROM categories WHERE slug = 'streetwear'), true, 50),
  ('Tank Top', 'tank-top', 'Premium cotton tank top. Perfect for layering or wearing solo in the heat.', 15000, '/products/tank-top.jpg', (SELECT id FROM categories WHERE slug = 'essentials'), true, 50),
  ('Plain Polo', 'plain-polo', 'Clean and minimal polo shirt. Classic collar with premium pique cotton.', 23000, '/products/plain-polo.jpg', (SELECT id FROM categories WHERE slug = 'essentials'), true, 50),
  ('Polo Shirt', 'polo-shirt', 'Elevated polo with refined details. Premium fabric for a sophisticated look.', 25000, '/products/polo-shirt.jpg', (SELECT id FROM categories WHERE slug = 'best-sellers'), true, 50),
  ('Checkers Shirt', 'checkers-shirt', 'Bold checkered pattern shirt. Stand out with this statement piece.', 25000, '/products/checkers-shirt.jpg', (SELECT id FROM categories WHERE slug = 'best-sellers'), true, 50),
  ('Quarter Zip', 'quarter-zip', 'Premium quarter zip pullover. Perfect blend of style and warmth.', 25000, '/products/quarter-zip.jpg', (SELECT id FROM categories WHERE slug = 'new-arrivals'), true, 50)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED PRODUCT VARIANTS
-- ============================================
DO $$
DECLARE
  prod RECORD;
  sizes TEXT[] := ARRAY['S', 'M', 'L', 'XL', 'XXL'];
  colors TEXT[] := ARRAY['#000000', '#FFFFFF'];
  size TEXT;
  color TEXT;
BEGIN
  FOR prod IN SELECT id, price FROM products WHERE slug IN ('lightning-strike-tee', 'bernie-tee', 'tank-top', 'plain-polo', 'polo-shirt', 'checkers-shirt', 'quarter-zip')
  LOOP
    FOREACH size IN ARRAY sizes LOOP
      FOREACH color IN ARRAY colors LOOP
        INSERT INTO public.product_variants (product_id, size, color, price, stock, is_active)
        VALUES (prod.id, size, color, prod.price, 10, true)
        ON CONFLICT DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- TRIGGER for store_settings updated_at
-- ============================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.store_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cms_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
