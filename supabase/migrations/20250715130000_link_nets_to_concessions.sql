/*
  # Link Nets to Concessions
  This migration establishes a direct relationship between nets and concessions to enable filtering.

  ## Changes:
  1.  **Add Column**: Adds `concession_id` to the `nets` table.
  2.  **Add Foreign Key**: Creates a foreign key constraint from `nets.concession_id` to `concessions.id`.
  3.  **Add Index**: Creates an index on `nets.concession_id` for performance.
  4.  **Update Seed Data**: Assigns a demo concession to the existing demo net to ensure data consistency for development.
*/

-- 1. Add concession_id column to nets table
ALTER TABLE public.nets
ADD COLUMN IF NOT EXISTS concession_id uuid;

-- 2. Add foreign key constraint safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'nets_concession_id_fkey' AND conrelid = 'public.nets'::regclass
  ) THEN
    ALTER TABLE public.nets
    ADD CONSTRAINT nets_concession_id_fkey
    FOREIGN KEY (concession_id) REFERENCES public.concessions(id) ON DELETE SET NULL;
  END IF;
END;
$$;

-- 3. Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_nets_concession_id ON public.nets(concession_id);

-- 4. Update existing demo net with a demo concession_id
-- This assumes a demo concession with this ID was created in the concessions migration.
-- We'll link the first demo net to the first demo concession.
UPDATE public.nets
SET concession_id = (SELECT id from public.concessions ORDER BY created_at LIMIT 1)
WHERE code = 'RED-2025-PRV12-L123-PECERA-60x40-001'
AND company_id = '00000000-0000-0000-0000-000000000001';