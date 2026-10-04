/*
# Add procurement centres table and link farmers to centres

1. New Tables
- `procurement_centres`: stores procurement centre information
  - id (uuid, PK)
  - name (text, not null)
  - location (text)
  - district (text)
  - state (text)
  - admin_contact (text) — phone number for the admin/operator of this centre
  - created_at (timestamptz, default now())

2. Modified Tables
- `farmers`: add `procurement_centre_id` (uuid, FK to procurement_centres, nullable)
  - Added column to link each farmer to their selected procurement centre.

3. Security
- Enable RLS on procurement_centres.
- Allow anon + authenticated CRUD (single-tenant prototype, no sign-in).
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.

4. Seed Data
- Insert 4 realistic procurement centres based on existing mock data centres.

5. Notes
- This is a no-auth prototype, so data is intentionally shared/public.
- procurement_centre_id is nullable so existing farmers without a centre are not broken.
- admin_contact stores a phone number that the Help page will use for call/SMS actions.
*/

CREATE TABLE IF NOT EXISTS procurement_centres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  district text,
  state text,
  admin_contact text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE procurement_centres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_centres" ON procurement_centres;
CREATE POLICY "anon_select_centres" ON procurement_centres FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_centres" ON procurement_centres;
CREATE POLICY "anon_insert_centres" ON procurement_centres FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_centres" ON procurement_centres;
CREATE POLICY "anon_update_centres" ON procurement_centres FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_centres" ON procurement_centres;
CREATE POLICY "anon_delete_centres" ON procurement_centres FOR DELETE
  TO anon, authenticated USING (true);

-- Add procurement_centre_id to farmers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'farmers' AND column_name = 'procurement_centre_id'
  ) THEN
    ALTER TABLE farmers ADD COLUMN procurement_centre_id uuid REFERENCES procurement_centres(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Seed realistic procurement centres (only if table is empty)
INSERT INTO procurement_centres (name, location, district, state, admin_contact)
SELECT * FROM (VALUES
  ('Jaipur Mandi Center 03', 'Sector 3, Mansarovar, Jaipur', 'Jaipur', 'Rajasthan', '9876543210'),
  ('Chomu Procurement Center', 'Main Road, Chomu, Jaipur', 'Jaipur', 'Rajasthan', '9876543211'),
  ('Sanganer Mandi', 'Industrial Area, Sanganer, Jaipur', 'Jaipur', 'Rajasthan', '9876543212'),
  ('Bagru Procurement Center', 'NH-8, Bagru, Jaipur', 'Jaipur', 'Rajasthan', '9876543213')
) AS v(name, location, district, state, admin_contact)
WHERE NOT EXISTS (SELECT 1 FROM procurement_centres LIMIT 1);

CREATE INDEX IF NOT EXISTS idx_farmers_centre ON farmers(procurement_centre_id);