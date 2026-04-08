ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS deletion_reason_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS deletion_reason_note TEXT,
  ADD COLUMN IF NOT EXISTS last_edit_reason_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS last_edit_reason_note TEXT;

CREATE TABLE IF NOT EXISTS listing_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  old_price DECIMAL(12, 2) NOT NULL,
  new_price DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'AFN',
  change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('increase', 'decrease')),
  reason_code VARCHAR(50),
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_price_history_listing
  ON listing_price_history(listing_id, changed_at DESC);

ALTER TABLE listing_price_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'listing_price_history' AND policyname = 'Anyone can view listing price history'
  ) THEN
    CREATE POLICY "Anyone can view listing price history"
      ON listing_price_history FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'listing_price_history' AND policyname = 'Sellers can insert own listing price history'
  ) THEN
    CREATE POLICY "Sellers can insert own listing price history"
      ON listing_price_history FOR INSERT
      WITH CHECK (
        auth.uid() = changed_by
        AND EXISTS (
          SELECT 1 FROM listings l
          WHERE l.id = listing_id
          AND l.user_id = auth.uid()
        )
      );
  END IF;
END $$;
