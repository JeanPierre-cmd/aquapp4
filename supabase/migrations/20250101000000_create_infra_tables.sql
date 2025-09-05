-- This migration script creates the necessary tables for infrastructure data
-- (sitios, unidades, fondeo, activos) in Supabase, based on the Zod schemas.
--
-- IMPORTANT:
-- 1. Replace '20250101000000' with an actual timestamp for your migration file name.
-- 2. After running this migration, ensure you configure Row Level Security (RLS)
--    policies in your Supabase project for these tables to control access.
--    For example, you might want to enable RLS and create policies like:
--    - "Enable read access for all users" (SELECT)
--    - "Enable insert for authenticated users" (INSERT)
--    - "Enable update for authenticated users" (UPDATE)
--    - "Enable delete for authenticated users" (DELETE)

-- Table: public.sitios
CREATE TABLE public.sitios (
    site_id TEXT PRIMARY KEY,
    nombre_site TEXT NOT NULL,
    tipo_site TEXT NOT NULL CHECK (tipo_site IN ('centro_cultivo', 'planta_proceso', 'hatchery')),
    region TEXT NOT NULL,
    comuna TEXT NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    propietario TEXT DEFAULT '',
    estado_operacion TEXT DEFAULT 'operativo' CHECK (estado_operacion IN ('operativo', 'detenido', 'en_mantenimiento')),
    rea_numero TEXT DEFAULT '',
    fecha_alta DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: public.unidades
CREATE TABLE public.unidades (
    unit_id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL REFERENCES public.sitios(site_id) ON DELETE CASCADE,
    tipo_unidad TEXT NOT NULL CHECK (tipo_unidad IN ('balsa_jaula_circular', 'linea_rectangular', 'plataforma')),
    diametro_m NUMERIC(10, 2),
    largo_m NUMERIC(10, 2),
    ancho_m NUMERIC(10, 2),
    prof_fondeo_m NUMERIC(10, 2) NOT NULL,
    config_mooring TEXT NOT NULL CHECK (config_mooring IN ('SPM', 'MPM')),
    capacidad_peq NUMERIC(10, 2) NOT NULL,
    fabricante TEXT DEFAULT '',
    fecha_instalacion DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: public.fondeo
CREATE TABLE public.fondeo (
    mooring_id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL REFERENCES public.sitios(site_id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL REFERENCES public.unidades(unit_id) ON DELETE CASCADE,
    tipo_elemento TEXT NOT NULL,
    material TEXT NOT NULL,
    wll_t NUMERIC(10, 2) NOT NULL,
    diametro_mm NUMERIC(10, 2),
    longitud_m NUMERIC(10, 2),
    fabricante TEXT DEFAULT '',
    ultima_inspeccion DATE NOT NULL,
    proxima_inspeccion DATE NOT NULL,
    res_1821_compliance TEXT NOT NULL CHECK (res_1821_compliance IN ('si', 'no')),
    nota TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: public.activos
CREATE TABLE public.activos (
    asset_id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL REFERENCES public.sitios(site_id) ON DELETE CASCADE,
    unit_id TEXT DEFAULT '' REFERENCES public.unidades(unit_id) ON DELETE SET DEFAULT, -- Can be empty, so SET DEFAULT
    categoria TEXT NOT NULL CHECK (categoria IN ('sensor', 'alimentador', 'bomba', 'generador', 'camara', 'red')),
    nombre TEXT NOT NULL,
    marca TEXT DEFAULT '',
    modelo TEXT DEFAULT '',
    serie TEXT DEFAULT '',
    fecha_compra DATE NOT NULL,
    estado TEXT DEFAULT 'operativo' CHECK (estado IN ('operativo', 'fuera_servicio', 'baja')),
    ubicacion TEXT DEFAULT '',
    critico TEXT DEFAULT 'no' CHECK (critico IN ('si', 'no')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add triggers to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sitios_updated_at
BEFORE UPDATE ON public.sitios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unidades_updated_at
BEFORE UPDATE ON public.unidades
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fondeo_updated_at
BEFORE UPDATE ON public.fondeo
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activos_updated_at
BEFORE UPDATE ON public.activos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
