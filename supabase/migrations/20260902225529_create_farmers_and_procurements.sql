/*
# Create farmers and procurements tables

1. New Tables
- `farmers`: stores farmer registration records
  - id (uuid, PK)
  - name (text, not null)
  - mobile (text, not null, unique)
  - village (text)
  - district (text)
  - state (text)
  - crop (text)
  - token (text)
  - status (text, default 'registered') — procurement status: registered → verified → slot_booked → arrived → procured → payment_sent → payment_received
  - created_at (timestamptz, default now())
- `procurements`: stores procurement records linked to farmers
  - id (uuid, PK)
  - farmer_id (uuid, FK to farmers)
  - lot_id (text)
  - crop (text)
  - center (text)
  - current_stage (text, default 'registered')
  - quantity (text)
  - status_note (jsonb, multilingual)
  - next_step (jsonb, multilingual)
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD (single-tenant prototype, no sign-in).
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.

3. Notes
- This is a no-auth prototype, so data is intentionally shared/public.
- mobile is unique to prevent duplicate farmer records across devices.
*/

CREATE TABLE IF NOT EXISTS farmers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL UNIQUE,
  village text,
  district text,
  state text,
  crop text,
  token text,
  status text NOT NULL DEFAULT 'registered',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_farmers" ON farmers;
CREATE POLICY "anon_select_farmers" ON farmers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_farmers" ON farmers;
CREATE POLICY "anon_insert_farmers" ON farmers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_farmers" ON farmers;
CREATE POLICY "anon_update_farmers" ON farmers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_farmers" ON farmers;
CREATE POLICY "anon_delete_farmers" ON farmers FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS procurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES farmers(id) ON DELETE CASCADE,
  lot_id text,
  crop text,
  center text,
  current_stage text NOT NULL DEFAULT 'registered',
  quantity text,
  status_note jsonb,
  next_step jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_procurements" ON procurements;
CREATE POLICY "anon_select_procurements" ON procurements FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_procurements" ON procurements;
CREATE POLICY "anon_insert_procurements" ON procurements FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_procurements" ON procurements;
CREATE POLICY "anon_update_procurements" ON procurements FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_procurements" ON procurements;
CREATE POLICY "anon_delete_procurements" ON procurements FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_farmers_mobile ON farmers(mobile);
CREATE INDEX IF NOT EXISTS idx_procurements_farmer_id ON procurements(farmer_id);
