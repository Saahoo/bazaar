-- database/migrations/20260514_admin_panel_redesign.sql
-- Comprehensive Admin Panel redesign: currencies table, user management fields, AdSense config

-- ============================================
-- CURRENCIES TABLE (admin-managed)
-- ============================================
CREATE TABLE IF NOT EXISTS currencies (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  exchange_rate DECIMAL(12, 6) DEFAULT 1.000000,
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_currencies_sort_order ON currencies(sort_order);

ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

-- Anyone can read currencies
CREATE POLICY "Anyone can view currencies"
  ON currencies FOR SELECT USING (true);

-- Admins can manage currencies
CREATE POLICY "Admins can manage currencies"
  ON currencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
    )
  );

-- Seed default currencies
INSERT INTO currencies (code, name, symbol, exchange_rate, is_default, sort_order) VALUES
  ('AFN', 'Afghan Afghani', '؋', 0.012000, TRUE, 1),
  ('USD', 'US Dollar', '$', 1.000000, FALSE, 2),
  ('PKR', 'Pakistani Rupee', '₨', 0.003600, FALSE, 3),
  ('IRR', 'Iranian Rial', '﷼', 0.000024, FALSE, 4)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- USER MANAGEMENT FIELDS ON PROFILES
-- ============================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS listing_restricted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS block_reason TEXT,
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
  ADD COLUMN IF NOT EXISTS listing_restriction_reason TEXT;

-- ============================================
-- ADMIN RLS POLICY FOR USER MANAGEMENT
-- ============================================
-- Admins can view all profiles (already exists as "Public profiles are viewable by everyone")
-- Admins can update any profile for moderation purposes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins can manage user profiles'
  ) THEN
    CREATE POLICY "Admins can manage user profiles"
      ON profiles FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid()
          AND p.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid()
          AND p.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================
-- ENSURE site_settings TABLE EXISTS
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS if not already enabled
DO $$ BEGIN
  ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Ensure public read policy
DO $$ BEGIN
  CREATE POLICY "Public can read site settings"
    ON site_settings FOR SELECT USING (TRUE);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Ensure admin manage policy
DO $$ BEGIN
  CREATE POLICY "Admins can manage site settings"
    ON site_settings FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- ADSENSE CONFIG IN SITE_SETTINGS
-- ============================================
-- Header AdSense config
INSERT INTO site_settings (setting_key, setting_value)
VALUES (
  'adsense_header',
  jsonb_build_object(
    'enabled', false,
    'client', '',
    'slot', '',
    'format', 'horizontal',
    'responsive', true,
    'style', jsonb_build_object(
      'margin_top', 0,
      'margin_bottom', 8,
      'max_width', '100%',
      'bg_color', '#ffffff'
    )
  )
)
ON CONFLICT (setting_key) DO NOTHING;

-- Sidebar AdSense config
INSERT INTO site_settings (setting_key, setting_value)
VALUES (
  'adsense_sidebar',
  jsonb_build_object(
    'enabled', false,
    'client', '',
    'slot', '',
    'format', 'vertical',
    'responsive', true,
    'style', jsonb_build_object(
      'margin_top', 16,
      'margin_bottom', 16,
      'max_width', '300px',
      'bg_color', '#ffffff'
    )
  )
)
ON CONFLICT (setting_key) DO NOTHING;

-- General AdSense config (global toggle, publisher ID)
INSERT INTO site_settings (setting_key, setting_value)
VALUES (
  'adsense_global',
  jsonb_build_object(
    'enabled', false,
    'publisher_id', '',
    'auto_ads', false,
    'page_level_ads', false,
    'anchor_ads', false,
    'vignette_ads', false
  )
)
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- HOMEPAGE BLOCKS ORDERING CONFIG
-- ============================================
-- Enhanced homepage config with block ordering
INSERT INTO site_settings (setting_key, setting_value)
VALUES (
  'homepage_blocks_order',
  jsonb_build_object(
    'blocks', jsonb_build_array(
      jsonb_build_object('id', 'hero', 'enabled', true, 'order', 1),
      jsonb_build_object('id', 'categorySidebar', 'enabled', true, 'order', 2),
      jsonb_build_object('id', 'showcase', 'enabled', true, 'order', 3),
      jsonb_build_object('id', 'trending', 'enabled', true, 'order', 4),
      jsonb_build_object('id', 'mostWatched', 'enabled', true, 'order', 5),
      jsonb_build_object('id', 'popularArea', 'enabled', true, 'order', 6)
    )
  )
)
ON CONFLICT (setting_key) DO NOTHING;