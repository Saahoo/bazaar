ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS deletion_reason_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS deletion_reason_note TEXT;
