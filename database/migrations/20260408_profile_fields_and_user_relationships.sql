ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS district VARCHAR(100),
  ADD COLUMN IF NOT EXISTS address_line TEXT,
  ADD COLUMN IF NOT EXISTS profile_type VARCHAR(20) DEFAULT 'personal',
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS sex VARCHAR(20),
  ADD COLUMN IF NOT EXISTS company_name VARCHAR(150),
  ADD COLUMN IF NOT EXISTS occupation VARCHAR(120),
  ADD COLUMN IF NOT EXISTS website TEXT;

CREATE TABLE IF NOT EXISTS user_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relation_type VARCHAR(20) NOT NULL CHECK (relation_type IN ('friend', 'favorite')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_user_id, relation_type),
  CHECK (user_id <> target_user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_relationships_user ON user_relationships(user_id, relation_type);
CREATE INDEX IF NOT EXISTS idx_user_relationships_target ON user_relationships(target_user_id, relation_type);

ALTER TABLE user_relationships ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_relationships' AND policyname = 'Anyone can view user relationships'
  ) THEN
    CREATE POLICY "Anyone can view user relationships"
      ON user_relationships FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_relationships' AND policyname = 'Users can create own user relationships'
  ) THEN
    CREATE POLICY "Users can create own user relationships"
      ON user_relationships FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'user_relationships' AND policyname = 'Users can delete own user relationships'
  ) THEN
    CREATE POLICY "Users can delete own user relationships"
      ON user_relationships FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;