-- Migration for the Document Management System feature

-- Table: public.files
-- Stores the core, immutable information about an uploaded file.
CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    hash_sha256 TEXT NOT NULL UNIQUE,
    storage_key TEXT NOT NULL, -- e.g., path in Supabase Storage
    uploader_id UUID REFERENCES auth.users(id),
    page_count INT, -- Nullable, for PDFs
    exif_data JSONB, -- Nullable, for JPGs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add comments for clarity
COMMENT ON COLUMN public.files.hash_sha256 IS 'SHA-256 hash of the file content to prevent duplicates.';
COMMENT ON COLUMN public.files.storage_key IS 'The unique path/key where the file is stored in the object storage.';

-- Table: public.file_metadata
-- Stores the current, editable metadata for a file. This table contains the "live" version.
CREATE TABLE public.file_metadata (
    file_id UUID PRIMARY KEY REFERENCES public.files(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    location_text TEXT,
    relevance_date DATE,
    related_asset_id TEXT, -- Could be a site_id, unit_id, etc.
    source TEXT,
    license TEXT,
    notes TEXT,
    updated_by_id UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table: public.file_versions
-- Stores the historical log of all changes made to a file's editable metadata.
CREATE TABLE public.file_versions (
    id BIGSERIAL PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES public.files(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    diff JSONB NOT NULL, -- Stores what changed in this version
    comment TEXT, -- Optional comment explaining the change
    created_by_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (file_id, version_number)
);

-- Add comments for clarity
COMMENT ON COLUMN public.file_versions.diff IS 'A JSON object detailing the changes from the previous version to this one.';

-- Enable Row Level Security (RLS)
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_versions ENABLE ROW LEVEL SECURITY;

-- NOTE: RLS Policies are NOT created here.
-- You must create policies in the Supabase dashboard to control access.
-- Example policies:
-- - Allow authenticated users to insert into 'files'.
-- - Allow users to select files they have access to.
-- - Allow users to update 'file_metadata' for files they have access to.

-- Trigger to automatically update the 'updated_at' timestamp on metadata changes
CREATE OR REPLACE FUNCTION update_metadata_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_file_metadata_updated_at
BEFORE UPDATE ON public.file_metadata
FOR EACH ROW
EXECUTE FUNCTION update_metadata_updated_at_column();
