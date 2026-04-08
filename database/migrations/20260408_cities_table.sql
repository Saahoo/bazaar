-- Cities table for admin-managed city list
-- Replaces the hard-coded POPULAR_CITIES constant

CREATE TABLE IF NOT EXISTS cities (
  id          SERIAL PRIMARY KEY,
  name_en     VARCHAR(100) NOT NULL UNIQUE,
  name_ps     VARCHAR(100),
  name_fa     VARCHAR(100),
  country     VARCHAR(100),
  latitude    DECIMAL(9,6),
  longitude   DECIMAL(9,6),
  featured    BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Anyone can read cities (used in post-ad wizard and search)
CREATE POLICY "Anyone can read cities"
  ON cities FOR SELECT
  USING (true);

-- Admins can insert / update / delete cities
CREATE POLICY "Admins can manage cities"
  ON cities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
