/*
  # Create concessions table
  1. New Tables: concessions (id uuid, name text, manager text, location text, etc.)
  2. Security: Enable RLS, add CRUD policies for authenticated users, linking concessions to the user who created them.
  3. Triggers: Add trigger to automatically update 'updated_at' timestamp.
*/

CREATE TABLE IF NOT EXISTS public.concessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Link to the user who created the concession
    name TEXT NOT NULL,
    rut TEXT,
    manager TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    established TEXT, -- Year of establishment, e.g., '2005' or '2020s'
    address TEXT,
    location TEXT NOT NULL, -- Region/Country
    water_body TEXT,
    total_area TEXT, -- e.g., '1000 ha'
    max_depth TEXT, -- e.g., '50 m'
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    license TEXT,
    operational_status TEXT NOT NULL DEFAULT 'Activa' CHECK (operational_status IN ('Activa', 'Inactiva', 'Suspendida', 'En Revisión')),
    certifications TEXT[], -- PostgreSQL array type for multiple certifications
    environmental_permits TEXT[], -- PostgreSQL array type for multiple environmental permits
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add comments for clarity
COMMENT ON COLUMN public.concessions.user_id IS 'The ID of the user who created this concession.';
COMMENT ON COLUMN public.concessions.established IS 'Year or period of establishment, stored as text for flexibility.';
COMMENT ON COLUMN public.concessions.certifications IS 'Array of certifications held by the concession.';
COMMENT ON COLUMN public.concessions.environmental_permits IS 'Array of environmental permits held by the concession.';

-- Enable Row Level Security (RLS) for the concessions table
ALTER TABLE public.concessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for concessions table
-- Allow authenticated users to view all concessions
CREATE POLICY "Allow authenticated users to view concessions"
ON public.concessions FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to create their own concessions
CREATE POLICY "Allow authenticated users to create concessions"
ON public.concessions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own concessions
CREATE POLICY "Allow authenticated users to update their own concessions"
ON public.concessions FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own concessions
CREATE POLICY "Allow authenticated users to delete their own concessions"
ON public.concessions FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Trigger to automatically update 'updated_at' column on changes
CREATE OR REPLACE FUNCTION update_concessions_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_concessions_updated_at
BEFORE UPDATE ON public.concessions
FOR EACH ROW
EXECUTE FUNCTION update_concessions_updated_at_column();
