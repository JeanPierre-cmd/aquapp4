import React, { useEffect, useMemo, useState } from "react";
import { 
  Network, FileText, ShieldCheck, ArrowLeft, Loader, AlertTriangle,
  Calendar, Anchor, TestTube2, CheckCircle, XCircle, FileDown, Clock,
  Recycle, Award, Wrench, Waves
} from "lucide-react";
import { useConcessionStore } from "../../../stores/concessionStore";
import { useNetStore } from "../../../stores/netStore";
import { Net, NetDetails, NetHistoryEvent, NetCertificate } from "../../../types/net";

/**
 * AquApp · Módulo Redes — Vista de Detalle Avanzada
 * - Integrado con `useConcessionStore` y `useNetStore`.
 * - Muestra redes filtradas por la concesión seleccionada.
 * - Maneja estados de carga, error y "sin selección".
 * - La vista de detalle ahora carga y muestra KPIs, historial y certificados.
 */

// --- Themed UI Helpers ---
const toneClasses = {
  gray: "bg-textSecondary/10 text-textSecondary border-textSecondary/20",
  green: "bg-success/10 text-success border-success/20",
  yellow: "bg-warning/10 text-warning border-warning/20",
  blue: "bg-secondary/10 text-secondary border-secondary/20",
  red: "bg-error/10 text-error border-error/20",
  slate: "bg-textSecondary/10 text-textSecondary border-textSecondary/20",
  primary: "bg-primary/10 text-primary border-primary/20",
};
const Badge = ({ children, tone = "gray" }) => (
  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium border ${toneClasses[tone]}`}>
    {children}
  </span>
);

const Card = ({ children, onClick, className = '' }) => (
  <div onClick={onClick} className={`rounded-lg border border-border p-4 transition-colors bg-surface ${onClick ? "cursor-pointer hover:bg-border/50" : ""} ${className}`}>
    {children}
  </div>
);

const Select = ({ options, ...props }) => (
  <select {...props} className={`bg-surface border border-border rounded-md px-3 py-1.5 text-text placeholder-textSecondary/60 focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 w-full ${props.className||''}`}>
    {options.map(o => <option key={o.value} value={o.value} className="bg-surface text-text">{o.label}</option>)}
  </select>
);

const stateTone = (s) => ({ NUEVA: "slate", FABRICADA: "slate", RECEPCIONADA: "blue", INSTALADA: "green", RETIRADA: "gray", EN_LAVADO: "yellow", EN_TALLER: "yellow", APROBADA: "green", RECHAZADA: "red", DISPOSICION_FINAL: "red" }[s] || "gray");

// --- Componentes de Estado ---
const CenteredMessage = ({ icon: Icon, title, children }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-surface rounded-lg border border-border p-8 text-center">
    <Icon size={48} className="text-textSecondary/50 mb-4" />
    <h2 className="text-xl font-semibold text-text">{title}</h2>
    <p className="text-textSecondary mt-1 max-w-sm">{children}</p>
  </div>
);

const LoadingSpinner = ({ text = "Cargando..." }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <Loader className="animate-spin text-primary" size={40} />
        <p className="text-textSecondary mt-3">{text}</p>
    </div>
);

// --- Componentes de la Lista ---
function RedesList({ onOpen }) {
  const { selectedConcession } = useConcessionStore();
  const { nets, loading, error, fetchNetsByConcession } = useNetStore();
  const [estado, setEstado] = useState("");

  useEffect(() => {
    fetchNetsByConcession(selectedConcession?.id || null);
  }, [selectedConcession, fetchNetsByConcession]);

  const filteredNets = useMemo(() => estado ? nets.filter(n => n.state === estado) : nets, [estado, nets]);

  if (!selectedConcession) {
    return <CenteredMessage icon={Network} title="Seleccione una Concesión">
      Por favor, elija una concesión desde el selector principal para ver las redes asociadas.
    </CenteredMessage>;
  }

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <CenteredMessage icon={AlertTriangle} title="Error al Cargar Redes">
      No se pudieron obtener los datos de las redes. Por favor, intente de nuevo más tarde. <br/> <code className="text-xs mt-2 bg-background p-1 rounded">{error}</code>
    </CenteredMessage>;
  }

  return (
    <div className="space-y-6 text-text animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Redes ({nets.length})</h1>
        <button className="btn-primary">Nueva red</button>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm text-textSecondary">Filtrar por estado</span>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="max-w-xs"
          options={[
            { value: "", label: "Todos" },
            ...["NUEVA", "FABRICADA", "RECEPCIONADA", "INSTALADA", "RETIRADA", "EN_LAVADO", "EN_TALLER", "APROBADA", "RECHAZADA", "DISPOSICION_FINAL"].map(s => ({ value: s, label: s }))
          ]}
        />
      </div>

      {filteredNets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredNets.map((r) =>
            <Card key={r.id} onClick={() => onOpen(r)}>
              <div className="flex items-center justify-between">
                <div className="font-semibold truncate max-w-[70%]" title={r.code}>{r.code}</div>
                <Badge tone={stateTone(r.state)}>{r.state}</Badge>
              </div>
              <div className="text-sm text-textSecondary mt-1 capitalize">Tipo: {r.tipo}</div>
              <div className="text-xs text-textSecondary/70">Fabricación: {r.fecha_fabricacion ?? "—"}</div>
            </Card>
          )}
        </div>
      ) : (
        <CenteredMessage icon={FileText} title="No se encontraron redes">
          No hay redes registradas para la concesión "{selectedConcession.name}" {estado ? `con el estado "${estado}"` : ''}.
        </CenteredMessage>
      )}
    </div>
  );
}

// --- Componentes de Detalle ---

const KpiCard = ({ icon: Icon, value, label, colorClass }) => (
  <div className="bg-surface p-4 rounded-lg border border-border flex items-center gap-4">
    <div className={`p-2 rounded-lg ${colorClass}/10`}>
      <Icon size={24} className={colorClass} />
    </div>
    <div>
      <div className="text-2xl font-bold text-text">{value}</div>
      <div className="text-sm text-textSecondary">{label}</div>
    </div>
  </div>
);

const KpiPanel = ({ kpis }) => {
  if (!kpis) return <div className="text-textSecondary">No hay KPIs disponibles.</div>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiCard icon={Waves} value={kpis.dias_en_agua || 0} label="Días en agua" colorClass="text-secondary" />
      <KpiCard icon={Anchor} value={kpis.ciclos || 0} label="Ciclos de uso" colorClass="text-primary" />
      <KpiCard icon={CheckCircle} value={kpis.ensayos_ok || 0} label="Ensayos OK" colorClass="text-success" />
      <KpiCard icon={XCircle} value={kpis.ensayos_fail || 0} label="Ensayos Fallidos" colorClass="text-error" />
    </div>
  );
};

const eventIcons = {
  STATE_CHANGED: Clock,
  INSTALL: Anchor,
  WITHDRAW: Waves,
  SEND_TO_WORKSHOP: Wrench,
  TEST_PASS: TestTube2,
  TEST_FAIL: TestTube2,
  DISPOSAL: Recycle,
  CERTIFICATE_ISSUED: Award,
  default: FileText,
};
const eventColors = {
  STATE_CHANGED: "text-textSecondary",
  INSTALL: "text-success",
  WITHDRAW: "text-warning",
  SEND_TO_WORKSHOP: "text-yellow-400",
  TEST_PASS: "text-success",
  TEST_FAIL: "text-error",
  DISPOSAL: "text-red-500",
  CERTIFICATE_ISSUED: "text-primary",
  default: "text-textSecondary",
};

const HistoryTimeline = ({ history }: { history: NetHistoryEvent[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-text">Historial de Trazabilidad</h3>
    <div className="relative border-l-2 border-border/50 pl-6 space-y-8">
      {history.map((event, i) => {
        const Icon = eventIcons[event.type] || eventIcons.default;
        const color = eventColors[event.type] || eventColors.default;
        return (
          <div key={i} className="relative">
            <div className={`absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-surface border-2 border-border ${color.replace('text-','border-')}`}></div>
            <p className="text-sm text-textSecondary">{new Date(event.ts).toLocaleString()}</p>
            <p className="font-semibold text-text flex items-center gap-2">
              <Icon size={16} className={color} />
              {event.type.replace(/_/g, ' ').toLowerCase()}
            </p>
            {event.actor && <p className="text-xs text-textSecondary/80">Actor: {event.actor}</p>}
            {event.payload?.to && <p className="text-xs text-textSecondary/80">Nuevo estado: <Badge tone={stateTone(event.payload.to)}>{event.payload.to}</Badge></p>}
          </div>
        );
      })}
    </div>
  </div>
);

const CertificatesList = ({ certificates }: { certificates: NetCertificate[] }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-text">Certificados y Documentos</h3>
    {certificates.length > 0 ? (
      <div className="space-y-3">
        {certificates.map(cert => (
          <Card key={cert.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-text"><Badge tone="primary">{cert.type}</Badge></p>
              <p className="text-sm text-textSecondary mt-1">Emitido por: <b>{cert.issuer_name}</b> el {new Date(cert.issued_at).toLocaleDateString()}</p>
            </div>
            <a href={cert.file_url || '#'} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm" aria-disabled={!cert.file_url}>
              <FileDown size={16} className="mr-2" /> Ver
            </a>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-textSecondary text-sm">No hay certificados asociados a esta red.</p>
    )}
  </div>
);


function RedDetail({ net, onBack }: { net: Net, onBack: () => void }) {
  const { selectedNetDetails, detailsLoading, detailsError, fetchNetDetails } = useNetStore();

  useEffect(() => {
    fetchNetDetails(net.id);
  }, [net.id, fetchNetDetails]);

  return (
    <div className="space-y-6 text-text animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full border border-border hover:bg-surface text-textSecondary transition-colors"><ArrowLeft size={18} /></button>
          <div>
            <h1 className="text-2xl font-bold">{net.code}</h1>
            <div className="text-sm text-textSecondary flex items-center gap-2">
              Estado: <Badge tone={stateTone(net.state)}>{net.state}</Badge>
            </div>
          </div>
        </div>
        <button className="btn-secondary" onClick={() => alert("Exportar Historial PDF (demo)")}>Exportar Historial PDF</button>
      </div>

      {detailsLoading && <LoadingSpinner text="Cargando detalles..." />}
      {detailsError && <CenteredMessage icon={AlertTriangle} title="Error al Cargar Detalles">{detailsError}</CenteredMessage>}
      
      {selectedNetDetails && !detailsLoading && (
        <div className="space-y-8">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-text">Indicadores Clave</h3>
            <KpiPanel kpis={selectedNetDetails.kpis} />
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <HistoryTimeline history={selectedNetDetails.history} />
            <CertificatesList certificates={selectedNetDetails.certificates} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function NetsModule() {
  const [open, setOpen] = useState<Net | null>(null);
  return (
    <div className="p-6 bg-background text-text min-h-screen">
      {!open && <RedesList onOpen={setOpen} />}
      {open && <RedDetail net={open} onBack={() => setOpen(null)} />}
    </div>
  );
}
