-- Migration: contact_submissions table
-- Stores contact form submissions from the /contact-us page

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  subject       TEXT NOT NULL,
  message       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for admin listing / filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
  ON public.contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

-- RLS: anyone (even anon) can INSERT; only admins can SELECT / UPDATE / DELETE
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_contact_updated_at();
