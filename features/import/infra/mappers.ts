import Papa from "papaparse";
import * as XLSX from "xlsx";
import { z } from "zod";
import { sitioSchema, unidadSchema, fondeoSchema, activoSchema } from "./schemas";

export const aliases: Record<string, string[]> = {
  site_id:["id_sitio","site","sitio"],
  nombre_site:["nombre","nombre_centro"],
  tipo_site:["tipo","tipo_sitio"],
  rea_numero:["rea","n_rea","rea_number"],
  unit_id:["id_unidad","jaula_id","cage_id"],
  config_mooring:["fondeo","configuracion_fondeo"]
};

export function autoMap(headers: string[], required: string[]) {
  const map: Record<string,string> = {};
  for (const target of required) {
    const cands = [target, ...(aliases[target]||[])];
    const hit = headers.find(h => cands.includes(h.trim()));
    if (hit) map[target] = hit;
  }
  return map;
}

export async function parseFile(file: File): Promise<{rows:any[], headers:string[]}> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const ab = await file.arrayBuffer();
    const wb = XLSX.read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, { defval:"" });
    const headers = Object.keys(json[0]||{});
    return { rows: json, headers };
  }
  // CSV / TXT
  const text = await file.text();
  const delim = name.endsWith(".txt") ? (text.includes("|")?"|": (text.includes("\t")?"\t":",")) : ",";
  const res = Papa.parse(text, { header:true, delimiter:delim, skipEmptyLines:true });
  return { rows: res.data as any[], headers: res.meta.fields||[] };
}

type DryReport = { ok: number; fail: number; errors: {row:number; field?:string; message:string}[]; cleaned:any[] };

export function dryRun(rows:any[], schema: z.ZodSchema): DryReport {
  const errors: DryReport["errors"] = [];
  const cleaned:any[] = [];
  rows.forEach((r, i) => {
    const v = schema.safeParse(r);
    if (!v.success) {
      v.error.issues.forEach(iss => errors.push({ row: i+2, field: String(iss.path[0]||""), message: iss.message }));
    } else {
      cleaned.push(v.data);
    }
  });
  return { ok: cleaned.length, fail: errors.length, errors, cleaned };
}

export const schemasByType = {
  sitios: sitioSchema, unidades: unidadSchema, fondeo: fondeoSchema, activos: activoSchema
} as const;
