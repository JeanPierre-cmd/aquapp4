export type NetStateEnum = 'NUEVA' | 'FABRICADA' | 'RECEPCIONADA' | 'INSTALADA' | 'RETIRADA' | 'EN_LAVADO' | 'EN_TALLER' | 'APROBADA' | 'RECHAZADA' | 'DISPOSICION_FINAL';
export type NetTypeEnum = 'pecera' | 'lobera';
export type CertTypeEnum = 'PANO' | 'JAULA' | 'MANTENCION' | 'LIMPIEZA' | 'ENSAYO' | 'BAJA';

export interface Net {
  id: string;
  company_id: string;
  code: string;
  tipo: NetTypeEnum;
  cloth_panel_id: string | null;
  fabricante_id: string | null;
  dimensiones: {
    alto: number;
    ancho: number;
    fondo: number;
  } | null;
  peso_kg: number | null;
  tratamientos: {
    tipo: string;
    fecha: string;
    nota?: string;
  }[] | null;
  fecha_fabricacion: string | null;
  certificado_jaula_url: string | null;
  state: NetStateEnum;
  created_at: string;
  concession_id: string | null;
}

// --- Tipos para la Vista de Detalle ---

export interface NetHistoryEvent {
  net_id: string;
  ts: string;
  type: string;
  payload: Record<string, any> | null;
  actor: string | null;
}

export interface NetKpis {
  net_id: string;
  code: string;
  dias_en_agua: number;
  ciclos: number;
  ensayos_ok: number;
  ensayos_fail: number;
}

export interface NetCertificate {
  id: string;
  type: CertTypeEnum;
  file_url: string | null;
  issued_at: string;
  issuer_name?: string; // Asumimos que un JOIN podría traer este dato
}

export interface NetDetails {
  history: NetHistoryEvent[];
  kpis: NetKpis | null;
  certificates: NetCertificate[];
}
