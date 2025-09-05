/*
  # Create alerts table
  1. New Table: alerts (id, created_at, site_id, parameter, value, status, message, acknowledged_at, acknowledged_by)
  2. Security: Enable RLS and add policies for read/update.
*/

-- 1. Create the table for persistent alerts
CREATE TABLE IF NOT EXISTS public.alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    site_id text NOT NULL,
    parameter text NOT NULL,
    value double precision NOT NULL,
    status text NOT NULL, -- 'WARN' or 'CRIT'
    message text,
    acknowledged_at timestamptz,
    acknowledged_by uuid REFERENCES auth.users(id)
);

COMMENT ON TABLE public.alerts IS 'Stores persistent alerts generated when parameters cross critical thresholds.';

-- 2. Add indexes
CREATE INDEX IF NOT EXISTS idx_alerts_site_id_created_at ON public.alerts (site_id, created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Allow authenticated users to read their site alerts"
ON public.alerts
FOR SELECT
TO authenticated
USING (true); -- In a multi-tenant app, you'd check against a user-sites table.

CREATE POLICY "Allow authenticated users to acknowledge alerts"
ON public.alerts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (auth.uid() = acknowledged_by);
