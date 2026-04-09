CREATE TABLE IF NOT EXISTS listing_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_drafts_user ON listing_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_listing_drafts_updated ON listing_drafts(updated_at DESC);

ALTER TABLE listing_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own listing drafts" ON listing_drafts;

CREATE POLICY "Users can manage own listing drafts"
  ON listing_drafts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_listing_drafts_updated_at ON listing_drafts;

CREATE TRIGGER update_listing_drafts_updated_at
  BEFORE UPDATE ON listing_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();