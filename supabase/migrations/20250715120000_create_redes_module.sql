/*
  # AquApp - Create Redes (Nets) Module
  This migration establishes the complete database schema for the end-to-end traceability of aquaculture nets.

  ## Features:
  1.  **Enums**: Defines custom types for net states, cleaning methods, verdicts, certificate types, and actor roles.
  2.  **Core Tables**:
      - `actors`: Manages all entities involved (suppliers, manufacturers, workshops).
      - `cloth_panels`: Stores data for the raw net panels.
      - `nets`: The central table for individual nets, including their state.
  3.  **Lifecycle Tables**:
      - `installations`: Tracks operational cycles in the water.
      - `cleanings`: Logs washing events.
      - `workshop_orders`: Manages maintenance and repair orders.
      - `resistance_tests`: Records tensiometry test results.
      - `disposals`: Handles the end-of-life process for nets.
  4.  **Supporting Tables**:
      - `certificates`: A centralized repository for all documentary evidence.
      - `events`: An event-sourcing log for complete, immutable traceability.
  5.  **Performance**: Adds indexes on frequently queried columns.
  6.  **Data Views**: Creates `v_net_history` and `v_net_kpis` for simplified querying and reporting.
  7.  **Business Logic**: Implements the `redes_transition` RPC function to enforce documentary gates between state transitions.
  8.  **Security**: Enables Row Level Security (RLS) on all tables, ensuring multi-tenant data isolation.
  9.  **Seed Data**: Inserts initial demo data for suppliers, manufacturers, and a sample net to facilitate testing.
*/

-- 1.1 Enums
create type net_state as enum ('NUEVA','FABRICADA','RECEPCIONADA','INSTALADA','RETIRADA','EN_LAVADO','EN_TALLER','APROBADA','RECHAZADA','DISPOSICION_FINAL');
create type cleaning_type as enum ('IN_SITU','TALLER');
create type verdict as enum ('PASS','FAIL');
create type cert_type as enum ('PANO','JAULA','MANTENCION','LIMPIEZA','ENSAYO','BAJA');
create type actor_type as enum ('EMPRESA','PROVEEDOR','FABRICANTE','TALLER','LABORATORIO','RECICLADOR');

-- 1.2 Actores
create table if not exists actors (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  type actor_type not null,
  name text not null,
  rut text, email text, phone text, address text,
  created_at timestamptz default now()
);

-- 1.3 Paños y redes
create table if not exists cloth_panels (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  supplier_id uuid references actors(id),
  lote text,
  material text, construccion text, titulacion text,
  diametro_hilo_mm numeric, tamano_malla_mm numeric,
  superficie_m2 numeric,
  fecha_produccion date, fecha_venta date,
  certificado_url text,
  created_at timestamptz default now()
);

create table if not exists nets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  code text unique not null,
  tipo text check (tipo in ('pecera','lobera')),
  cloth_panel_id uuid references cloth_panels(id),
  fabricante_id uuid references actors(id),
  dimensiones jsonb,          -- {alto, ancho, fondo}
  peso_kg numeric,
  tratamientos jsonb,         -- [{tipo, fecha, nota}]
  fecha_fabricacion date,
  certificado_jaula_url text,
  state net_state not null default 'NUEVA',
  created_at timestamptz default now()
);

-- 1.4 Ciclo de vida
create table if not exists installations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  net_id uuid references nets(id) on delete cascade,
  centro_id uuid, balsa_id uuid,
  lat numeric, lon numeric,
  fecha_instalacion timestamptz not null,
  fecha_retiro timestamptz,
  acta_url text
);

create table if not exists cleanings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  net_id uuid references nets(id) on delete cascade,
  tipo cleaning_type not null,
  metodo text, quimicos text, temperatura_c numeric, tiempo_min integer,
  certificado_url text,
  fecha timestamptz not null default now()
);

create table if not exists workshop_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  net_id uuid references nets(id) on delete cascade,
  taller_id uuid references actors(id),
  ingreso timestamptz not null,
  salida timestamptz,
  diagnostico text,
  metros_reparados numeric,
  repuestos jsonb,  -- [{item, qty, costo}]
  costo_total numeric
);

create table if not exists resistance_tests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  order_id uuid references workshop_orders(id) on delete cascade,
  protocolo text, equipo text, calibracion text,
  muestras int, resultados_kn numeric[], min_req_kn numeric,
  verdict verdict not null,
  certificado_url text,
  fecha timestamptz not null default now()
);

-- 1.5 Certificados, baja y eventos
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  type cert_type not null,
  net_id uuid references nets(id),
  panel_id uuid references cloth_panels(id),
  issuer_id uuid references actors(id),
  file_url text,
  issued_at timestamptz not null default now()
);

create table if not exists disposals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  net_id uuid references nets(id) on delete cascade,
  causa text, destino text, doc_url text,
  fecha timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null,
  net_id uuid references nets(id) on delete cascade,
  type text not null,         -- INSTALL, WITHDRAW, SEND_TO_WORKSHOP, TEST_PASS, etc.
  actor_id uuid references actors(id),
  ts timestamptz not null default now(),
  payload jsonb,
  attachment_urls text[]
);

create index if not exists idx_events_net_ts on events(net_id, ts);
create index if not exists idx_inst_net on installations(net_id);
create index if not exists idx_orders_net on workshop_orders(net_id);

-- 1.6 Vistas
create or replace view v_net_history as
  select e.net_id, e.ts, e.type, e.payload, a.name as actor
  from events e left join actors a on a.id=e.actor_id
  order by e.ts;

create or replace view v_net_kpis as
  select
    n.company_id, n.id as net_id, n.code,
    sum(coalesce(extract(epoch from (i.fecha_retiro - i.fecha_instalacion))/86400,0)) as dias_en_agua,
    count(i.id) as ciclos,
    (select count(*) from resistance_tests rt join workshop_orders o on o.id=rt.order_id where o.net_id=n.id and rt.verdict='PASS') as ensayos_ok,
    (select count(*) from resistance_tests rt join workshop_orders o on o.id=rt.order_id where o.net_id=n.id and rt.verdict='FAIL') as ensayos_fail
  from nets n
  left join installations i on i.net_id=n.id
  group by n.company_id, n.id, n.code;

-- 1.7 RPC: transiciones con gates documentales
create or replace function redes_transition(_net uuid, _new net_state, _actor uuid)
returns text language plpgsql security definer as $$
declare _company uuid;
begin
  select company_id into _company from nets where id=_net;

  if _new = 'FABRICADA' then
    if not exists (select 1 from certificates c where c.company_id=_company and c.net_id=_net and c.type='PANO') then
      raise exception 'Falta Certificado de Paño (PC-1)';
    end if;
  end if;

  if _new = 'RECEPCIONADA' then
    if not exists (select 1 from certificates c where c.company_id=_company and c.net_id=_net and c.type='JAULA') then
      raise exception 'Falta Certificado de Jaula (PC-2)';
    end if;
  end if;

  if _new = 'INSTALADA' then
    if exists(
      select 1 from resistance_tests rt
      join workshop_orders o on o.id=rt.order_id
      where o.net_id=_net
      order by rt.fecha desc limit 1
      having max(rt.verdict)='FAIL'
    ) then
      raise exception 'Ensayo de resistencia inválido';
    end if;
  end if;

  update nets set state=_new where id=_net;
  insert into events (company_id, net_id, type, actor_id, payload)
  values (_company, _net, 'STATE_CHANGED', _actor, jsonb_build_object('to',_new));
  return 'OK';
end $$;

-- 1.8 RLS por compañía (incluye excepción para DEMO_ID)
-- DEMO_ID: 00000000-0000-0000-0000-000000000001
do $$
declare r record;
begin
  for r in
    select tablename from pg_tables where schemaname='public'
    and tablename in ('actors','cloth_panels','nets','installations','cleanings','workshop_orders','resistance_tests','certificates','disposals','events')
  loop
    execute format('alter table %I enable row level security;', r.tablename);
    execute format($p$
      create policy "%I_sel" on %I for select using (
        company_id = (auth.jwt()->>'company_id')::uuid
        or company_id = '00000000-0000-0000-0000-000000000001'::uuid
      );
    $p$, r.tablename||'_sel', r.tablename);
    execute format($p$
      create policy "%I_ins" on %I for insert with check (
        company_id = (auth.jwt()->>'company_id')::uuid
        or company_id = '00000000-0000-0000-0000-000000000001'::uuid
      );
    $p$, r.tablename||'_ins', r.tablename);
    execute format($p$
      create policy "%I_upd" on %I for update using (
        company_id = (auth.jwt()->>'company_id')::uuid
        or company_id = '00000000-0000-0000-0000-000000000001'::uuid
      ) with check (
        company_id = (auth.jwt()->>'company_id')::uuid
        or company_id = '00000000-0000-0000-0000-000000000001'::uuid
      );
    $p$, r.tablename||'_upd', r.tablename);
     execute format($p$
      create policy "%I_del" on %I for delete using (
        company_id = (auth.jwt()->>'company_id')::uuid
        or company_id = '00000000-0000-0000-0000-000000000001'::uuid
      );
    $p$, r.tablename||'_del', r.tablename);
  end loop;
end $$;


-- 1.10 Seeds (mínimos para demo)
-- Tenant demo
insert into actors (company_id, type, name, rut, email)
values
('00000000-0000-0000-0000-000000000001','PROVEEDOR','Textil Fiordo','76.123.456-7','proveedor@fiordo.cl'),
('00000000-0000-0000-0000-000000000001','FABRICANTE','Redes Austral','77.987.654-3','fab@austral.cl'),
('00000000-0000-0000-0000-000000000001','TALLER','Taller Comau','70.111.222-3','taller@comau.cl')
on conflict (name) do nothing;

-- Un paño + red + certificados
DO $$
DECLARE
  v_supplier_id uuid;
  v_fabricante_id uuid;
  v_cloth_panel_id uuid;
  v_net_id uuid;
BEGIN
  -- Get actor IDs
  SELECT id INTO v_supplier_id FROM actors WHERE name='Textil Fiordo' LIMIT 1;
  SELECT id INTO v_fabricante_id FROM actors WHERE name='Redes Austral' LIMIT 1;

  -- Insert cloth panel if it doesn't exist
  INSERT INTO cloth_panels (company_id,supplier_id,lote,material,construccion,titulacion,diametro_hilo_mm,tamano_malla_mm,superficie_m2,fecha_produccion,fecha_venta,certificado_url)
  VALUES ('00000000-0000-0000-0000-000000000001', v_supplier_id, 'L123','Polietileno','Trenzado','210D','3.0','25',1200,'2025-06-15','2025-06-20','https://example.com/cert_pano.pdf')
  ON CONFLICT (lote) DO NOTHING;
  
  SELECT id INTO v_cloth_panel_id FROM cloth_panels WHERE lote='L123' LIMIT 1;

  -- Insert net if it doesn't exist
  INSERT INTO nets (company_id,code,tipo,cloth_panel_id,fabricante_id,dimensiones,peso_kg,tratamientos,fecha_fabricacion,certificado_jaula_url,state)
  VALUES ('00000000-0000-0000-0000-000000000001','RED-2025-PRV12-L123-PECERA-60x40-001','pecera', v_cloth_panel_id, v_fabricante_id, '{"alto":15,"ancho":60,"fondo":40}', 520, '[{"tipo":"pintura","fecha":"2025-06-22"}]', '2025-06-22', 'https://example.com/cert_jaula.pdf','RECEPCIONADA')
  ON CONFLICT (code) DO NOTHING;

  SELECT id INTO v_net_id FROM nets WHERE code='RED-2025-PRV12-L123-PECERA-60x40-001' LIMIT 1;

  -- Link certificates if they don't exist
  INSERT INTO certificates (company_id,type,net_id,panel_id,issuer_id,file_url)
  VALUES ('00000000-0000-0000-0000-000000000001','PANO',v_net_id,v_cloth_panel_id,v_supplier_id,'https://example.com/cert_pano.pdf')
  ON CONFLICT DO NOTHING;

  INSERT INTO certificates (company_id,type,net_id,issuer_id,file_url)
  VALUES ('00000000-0000-0000-0000-000000000001','JAULA',v_net_id,v_fabricante_id,'https://example.com/cert_jaula.pdf')
  ON CONFLICT DO NOTHING;
END $$;
