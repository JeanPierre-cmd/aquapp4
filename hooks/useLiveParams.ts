import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define la estructura de los datos que esperamos de la tabla 'measurements'
interface Measurement {
  id: number;
  created_at: string;
  site_id: string;
  parameter: 'temperatura' | 'oxigeno' | 'ph' | 'salinidad' | 'clorofila';
  value: number;
}

// Define la estructura del objeto de KPIs
interface Kpi {
  temperatura?: number;
  oxigeno?: number;
  ph?: number;
  salinidad?: number;
  clorofila?: number;
}

// Define la estructura del valor de retorno del hook
interface UseLiveParamsReturn {
  rows: Measurement[];
  kpi: Kpi;
  isLoading: boolean;
  isDemo: boolean;
}

// --- DATOS ESTÁTICOS PARA MODO DEMO ---
// No se eliminan, se usan como fallback si VITE_DEMO_MODE es 'true'
const getDemoData = (): { rows: Measurement[], kpi: Kpi } => {
  const now = new Date();
  const kpi = {
    temperatura: 14.5,
    oxigeno: 8.2,
    ph: 8.1,
    salinidad: 32.5,
    clorofila: 25.5,
  };
  const rows = [
    { id: 1, created_at: new Date(now.getTime() - 3600 * 1000).toISOString(), site_id: 'centro-01', parameter: 'temperatura', value: 14.2 },
    { id: 2, created_at: new Date(now.getTime() - 3600 * 1000).toISOString(), site_id: 'centro-01', parameter: 'oxigeno', value: 8.5 },
    { id: 3, created_at: new Date(now.getTime() - 1800 * 1000).toISOString(), site_id: 'centro-01', parameter: 'temperatura', value: 14.4 },
    { id: 4, created_at: new Date(now.getTime() - 1800 * 1000).toISOString(), site_id: 'centro-01', parameter: 'oxigeno', value: 8.3 },
    { id: 5, created_at: now.toISOString(), site_id: 'centro-01', parameter: 'temperatura', value: kpi.temperatura },
    { id: 6, created_at: now.toISOString(), site_id: 'centro-01', parameter: 'oxigeno', value: kpi.oxigeno },
    { id: 7, created_at: now.toISOString(), site_id: 'centro-01', parameter: 'ph', value: kpi.ph },
    { id: 8, created_at: now.toISOString(), site_id: 'centro-01', parameter: 'salinidad', value: kpi.salinidad },
    { id: 9, created_at: now.toISOString(), site_id: 'centro-01', parameter: 'clorofila', value: kpi.clorofila },
  ] as Measurement[];
  return { rows, kpi };
};

/**
 * Hook para obtener parámetros de calidad de agua en tiempo real o en modo demo.
 * @param siteId - El identificador del centro de cultivo.
 */
export const useLiveParams = (siteId: string): UseLiveParamsReturn => {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const [rows, setRows] = useState<Measurement[]>([]);
  const [kpi, setKpi] = useState<Kpi>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isDemoMode) {
      const { rows: demoRows, kpi: demoKpi } = getDemoData();
      setRows(demoRows);
      setKpi(demoKpi);
      setIsLoading(false);
      return;
    }

    let channel: RealtimeChannel | null = null;

    const fetchInitialData = async () => {
      setIsLoading(true);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('site_id', siteId)
        .gte('created_at', oneDayAgo)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching initial data:', error);
        // Fallback a modo demo en caso de error
        const { rows: demoRows, kpi: demoKpi } = getDemoData();
        setRows(demoRows);
        setKpi(demoKpi);
      } else if (data) {
        setRows(data);
        // Calcular KPIs iniciales
        const latestKpis = data.reduce((acc, measurement) => {
          if (!acc[measurement.parameter]) {
            acc[measurement.parameter] = measurement.value;
          }
          return acc;
        }, {} as Kpi);
        setKpi(latestKpis);
      }
      setIsLoading(false);
    };

    fetchInitialData();

    // Suscripción a cambios en tiempo real
    channel = supabase
      .channel(`public:measurements:site_id=eq.${siteId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'measurements', filter: `site_id=eq.${siteId}` },
        (payload) => {
          const newMeasurement = payload.new as Measurement;
          setRows(currentRows => [newMeasurement, ...currentRows]);
          setKpi(currentKpi => ({ ...currentKpi, [newMeasurement.parameter]: newMeasurement.value }));
        }
      )
      .subscribe();

    // Función de limpieza para desuscribirse cuando el componente se desmonte
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, [siteId, isDemoMode]);

  return { rows, kpi, isLoading, isDemo: isDemoMode };
};
