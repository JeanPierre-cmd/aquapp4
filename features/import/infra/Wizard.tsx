import { useState, useMemo, ChangeEvent, DragEvent } from "react";
import { parseFile, autoMap, dryRun, schemasByType } from "./mappers";
import { UploadCloud, FileText, ArrowRight, CheckCircle2, XCircle, AlertTriangle, LoaderCircle, DatabaseZap, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const DATASETS = [
  { key: "sitios", label: "Sitios" },
  { key: "unidades", label: "Unidades" },
  { key: "fondeo", label: "Fondeo" },
  { key: "activos", label: "Activos" },
] as const;

type DataSetKey = typeof DATASETS[number]["key"];

const EXAMPLE_CSVS: Record<DataSetKey, string> = {
  sitios: '/seeds/infraestructura_sitios.csv',
  unidades: '/seeds/infraestructura_unidades.csv',
  fondeo: '/seeds/infraestructura_fondeo.csv',
  activos: '/seeds/infraestructura_activos.csv',
};

// A simple, styled card component for local use
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-surface border border-border rounded-xl p-6 space-y-4 shadow-lg", className)}>
    {children}
  </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl font-bold text-text mb-4">{children}</h3>
);

export default function WizardInfra() {
  const [tipo, setTipo] = useState<DataSetKey>("sitios");
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [map, setMap] = useState<Record<string, string>>({});
  const [report, setReport] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const requiredFields = useMemo(() => Object.keys(schemasByType[tipo].shape), [tipo]);

  async function handleFile(selectedFile: File) {
    if (busy) return;
    setBusy(true);
    setFile(selectedFile);
    setReport(null);
    try {
      const { rows, headers } = await parseFile(selectedFile);
      setRows(rows);
      setHeaders(headers);
      setMap(autoMap(headers, requiredFields));
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("No se pudo procesar el archivo. Verifique el formato.");
      setFile(null);
      setRows([]);
      setHeaders([]);
    } finally {
      setBusy(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function remap(target: string, from: string) {
    setMap(prev => ({ ...prev, [target]: from }));
    setReport(null); // Invalidate report on remap
  }

  function runDry() {
    if (busy) return;
    setBusy(true);
    const remapped = rows.map(r => {
      const obj: any = {};
      for (const k of requiredFields) {
        const src = map[k];
        obj[k] = src ? r[src] : undefined;
      }
      return obj;
    });
    const rep = dryRun(remapped, schemasByType[tipo]);
    setReport({ ...rep, preview: remapped.slice(0, 50) });
    setBusy(false);
  }

  async function apply() {
    if (!report?.cleaned?.length || busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/import/${tipo}?dryRun=false`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: report.cleaned }),
      }).then(r => {
        if (!r.ok) throw new Error(`Server responded with status ${r.status}`);
        return r.json();
      });
      alert(res?.error ? `Error: ${res.error}` : `OK: ${res.inserted} insertados, ${res.updated} actualizados, ${res.failed} fallidos`);
    } catch (e) {
      alert(`Error de conexión: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  const handleDatasetChange = (key: DataSetKey) => {
    setTipo(key);
    setFile(null);
    setHeaders([]);
    setRows([]);
    setMap({});
    setReport(null);
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6 bg-background text-text">
      <Card className="animate-scale-in">
        <CardTitle>Paso 1: Seleccionar y Cargar Datos</CardTitle>
        <div className="space-y-2">
          <label className="font-medium text-textSecondary">Tipo de Dato</label>
          <div className="flex flex-wrap gap-2">
            {DATASETS.map(d => (
              <button key={d.key} onClick={() => handleDatasetChange(d.key)} className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                tipo === d.key ? "bg-primary text-white shadow-lg" : "bg-surface hover:bg-border/50 text-textSecondary"
              )}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-medium text-textSecondary">Archivo de Origen</label>
            <a
              href={EXAMPLE_CSVS[tipo]}
              download
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Descargar CSV de ejemplo
            </a>
          </div>
          <div
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl transition-all duration-200",
              isDragging ? "border-primary bg-primary/10" : "bg-background"
            )}
          >
            <UploadCloud className="w-12 h-12 text-textSecondary mb-4" />
            <p className="text-text">Arrastra tu archivo aquí o <span className="font-semibold text-primary">haz clic para buscar</span></p>
            <p className="text-xs text-textSecondary mt-1">Soportado: .xlsx, .xls, .csv, .txt</p>
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".csv,.xlsx,.xls,.txt" onChange={handleFileChange} disabled={busy} />
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm text-textSecondary bg-surface p-2 rounded-md border border-border">
              <FileText className="w-5 h-5 text-primary" />
              <span>{file.name} ({Math.round(file.size / 1024)} KB) - {rows.length} filas detectadas.</span>
            </div>
          )}
        </div>
      </Card>

      {!!headers.length && (
        <Card className="animate-scale-in delay-100">
          <CardTitle>Paso 2: Mapear Columnas</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {requiredFields.map(target => (
              <div className="flex items-center gap-3" key={target}>
                <label className="text-sm text-text w-1/3 flex-shrink-0 font-mono">{target}</label>
                <ArrowRight className="w-4 h-4 text-textSecondary flex-shrink-0" />
                <select
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-text"
                  value={map[target] || ""}
                  onChange={e => remap(target, e.target.value)}
                >
                  <option value="">— No Mapeado —</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <button
              className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              onClick={runDry}
              disabled={!rows.length || busy}
            >
              {busy && report === null ? <LoaderCircle className="animate-spin w-5 h-5" /> : <DatabaseZap className="w-5 h-5" />}
              Validar Datos (Dry-run)
            </button>
          </div>
        </Card>
      )}

      {report && (
        <Card className="animate-scale-in delay-200">
          <CardTitle>Paso 3: Revisar y Aplicar</CardTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-text">Resultado de Validación</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-2xl">{report.ok}</div>
                    <div className="text-sm">Filas Válidas</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-error">
                  <XCircle className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-2xl">{report.fail}</div>
                    <div className="text-sm">Filas con Errores</div>
                  </div>
                </div>
              </div>
              {report.errors?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-textSecondary">Detalle de Errores (primeros 100)</h5>
                  <div className="max-h-60 overflow-auto bg-background/50 p-3 rounded-lg border border-border text-sm space-y-2">
                    {report.errors.slice(0, 100).map((e: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-error/10 text-error">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="font-mono text-xs">{`Fila ${e.row} | ${e.field || "-"}: ${e.message}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-text">Previsualización de Datos Limpios (50)</h4>
              <div className="max-h-96 overflow-auto bg-background p-3 rounded-lg border border-border">
                <pre className="text-xs text-textSecondary">{JSON.stringify(report.preview, null, 2)}</pre>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <button
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              onClick={apply}
              disabled={!report?.cleaned?.length || busy}
            >
              {busy && report !== null ? <LoaderCircle className="animate-spin w-5 h-5" /> : null}
              Aplicar {report.ok} Registros
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
