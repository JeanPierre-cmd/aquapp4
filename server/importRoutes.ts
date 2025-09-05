import express from "express";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { sitioSchema, unidadSchema, fondeoSchema, activoSchema } from "../src/features/import/infra/schemas";

const r = express.Router();

// Initialize Supabase client
// Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is not set in environment variables.");
  // In a production app, you might want to throw an error or handle this more gracefully.
  // For now, we'll proceed but Supabase operations will fail.
}

const supabase = createClient(supabaseUrl || "http://localhost:54321", supabaseAnonKey || "dummy_key");

const cfg = {
  sitios: { schema: sitioSchema, key: "site_id", tableName: "sitios" },
  unidades: { schema: unidadSchema, key: "unit_id", tableName: "unidades" },
  fondeo: { schema: fondeoSchema, key: "mooring_id", tableName: "fondeo" },
  activos: { schema: activoSchema, key: "asset_id", tableName: "activos" },
} as const;

r.post("/api/import/:tipo", express.json({ limit: "10mb" }), async (req, res) => {
  const tipo = req.params.tipo as keyof typeof cfg;
  const dry = String(req.query.dryRun || "true") === "true";

  if (!cfg[tipo]) {
    return res.status(400).json({ error: "Tipo de importación inválido" });
  }

  const { schema, key, tableName } = cfg[tipo];

  try {
    const rows = z.array(schema).parse(req.body.rows || []);

    if (dry) {
      // For dry run, Zod parsing already validates the structure.
      // We could add more complex business rule validation here if needed.
      return res.json({ inserted: 0, updated: 0, failed: 0, errors: [] });
    }

    let inserted = 0, updated = 0, failed = 0;
    const errors: any[] = [];

    for (const row of rows) {
      const id = (row as any)[key];
      if (!id) {
        failed++;
        errors.push({ row, message: `Falta la clave única '${key}'` });
        continue;
      }

      try {
        // Check if the record already exists to differentiate between insert and update
        const { data: existingRecord, error: selectError } = await supabase
          .from(tableName)
          .select(key)
          .eq(key, id)
          .single();

        if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means "no rows found"
          failed++;
          errors.push({ row, message: `Error al verificar existencia en Supabase: ${selectError.message}` });
          continue;
        }

        const isUpdate = existingRecord !== null;

        // Perform upsert operation
        const { data: upsertedData, error: upsertError } = await supabase
          .from(tableName)
          .upsert(row, { onConflict: key, ignoreDuplicates: false })
          .select(); // Select the upserted data to confirm success

        if (upsertError) {
          failed++;
          errors.push({ row, message: `Error al guardar en Supabase: ${upsertError.message}` });
        } else if (upsertedData && upsertedData.length > 0) {
          if (isUpdate) {
            updated++;
          } else {
            inserted++;
          }
        } else {
          // This case should ideally not be reached if upsertError is null
          failed++;
          errors.push({ row, message: `No se pudo guardar el registro en Supabase sin error aparente.` });
        }
      } catch (dbError: any) {
        failed++;
        errors.push({ row, message: `Excepción inesperada al interactuar con Supabase: ${dbError.message}` });
      }
    }

    console.log(`[IMPORT LOG | ${new Date().toISOString()}] Tipo: ${tipo}, Insertados: ${inserted}, Actualizados: ${updated}, Fallidos: ${failed}`);

    return res.json({ inserted, updated, failed, errors });

  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: "Datos inválidos", details: e.errors });
    }
    return res.status(500).json({ error: e?.message || "Falló la aplicación de datos" });
  }
});

export default r;
