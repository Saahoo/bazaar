-- Ensure legacy Phones categories are treated as Electronics subcategories.
-- This keeps Phones out of top-level category selection in the wizard.
WITH electronics AS (
  SELECT id
  FROM categories
  WHERE slug = 'electronics'
  LIMIT 1
)
UPDATE categories
SET parent_id = (SELECT id FROM electronics)
WHERE slug IN ('mobile-phones', 'phones')
  AND parent_id IS NULL
  AND EXISTS (SELECT 1 FROM electronics);
