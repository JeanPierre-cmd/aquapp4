import { z } from "zod";

export const isoDate = z.string().transform(s=>{
  // acepta dd/mm/yyyy o yyyy-mm-dd → yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d,m,y] = s.split("/"); return `${y}-${m}-${d}`;
  }
  return s;
}).pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/,"Fecha inválida (YYYY-MM-DD)"));

const nonneg = z.coerce.number().min(0);

export const sitioSchema = z.object({
  site_id: z.string().min(1),
  nombre_site: z.string().min(1),
  tipo_site: z.enum(["centro_cultivo","planta_proceso","hatchery"]),
  region: z.string().min(1),
  comuna: z.string().min(1),
  lat: z.coerce.number().gte(-90).lte(90),
  lng: z.coerce.number().gte(-180).lte(180),
  propietario: z.string().optional().default(""),
  estado_operacion: z.enum(["operativo","detenido","en_mantenimiento"]).optional().default("operativo"),
  rea_numero: z.string().optional().default(""),
  fecha_alta: isoDate
});

export const unidadSchema = z.object({
  unit_id: z.string().min(1),
  site_id: z.string().min(1),
  tipo_unidad: z.enum(["balsa_jaula_circular","linea_rectangular","plataforma"]),
  diametro_m: nonneg.optional(),
  largo_m: nonneg.optional(),
  ancho_m: nonneg.optional(),
  prof_fondeo_m: nonneg,
  config_mooring: z.enum(["SPM","MPM"]),
  capacidad_peq: nonneg,
  fabricante: z.string().optional().default(""),
  fecha_instalacion: isoDate
});

export const fondeoSchema = z.object({
  mooring_id: z.string().min(1),
  site_id: z.string().min(1),
  unit_id: z.string().min(1),
  tipo_elemento: z.string().min(1),
  material: z.string().min(1),
  wll_t: nonneg,
  diametro_mm: nonneg.optional(),
  longitud_m: nonneg.optional(),
  fabricante: z.string().optional().default(""),
  ultima_inspeccion: isoDate,
  proxima_inspeccion: isoDate,
  res_1821_compliance: z.enum(["si","no"]),
  nota: z.string().optional().default("")
});

export const activoSchema = z.object({
  asset_id: z.string().min(1),
  site_id: z.string().min(1),
  unit_id: z.string().optional().default(""),
  categoria: z.enum(["sensor","alimentador","bomba","generador","camara","red"]),
  nombre: z.string().min(1),
  marca: z.string().optional().default(""),
  modelo: z.string().optional().default(""),
  serie: z.string().optional().default(""),
  fecha_compra: isoDate,
  estado: z.enum(["operativo","fuera_servicio","baja"]).optional().default("operativo"),
  ubicacion: z.string().optional().default(""),
  critico: z.enum(["si","no"]).optional().default("no")
});

export type Sitio = z.infer<typeof sitioSchema>;
export type Unidad = z.infer<typeof unidadSchema>;
export type Fondeo = z.infer<typeof fondeoSchema>;
export type Activo = z.infer<typeof activoSchema>;
