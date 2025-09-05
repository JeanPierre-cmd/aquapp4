import { supabase } from '../lib/supabaseClient';

export interface Alert {
  id: string;
  created_at: string;
  site_id: string;
  parameter: string;
  value: number;
  status: 'WARN' | 'CRIT';
  message: string;
  acknowledged_at: string | null;
}

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// --- DATOS ESTÁTICOS PARA MODO DEMO ---
const demoAlerts: Alert[] = [
  {
    id: '1',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    site_id: 'centro-01',
    parameter: 'Oxígeno Disuelto',
    value: 4.8,
    status: 'CRIT',
    message: 'Nivel de oxígeno críticamente bajo en Jaula 5.',
    acknowledged_at: null,
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    site_id: 'centro-01',
    parameter: 'Temperatura',
    value: 17.5,
    status: 'WARN',
    message: 'Temperatura del agua superó el umbral de advertencia.',
    acknowledged_at: null,
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    site_id: 'centro-01',
    parameter: 'Salinidad',
    value: 30.5,
    status: 'WARN',
    message: 'Baja salinidad detectada post-lluvias.',
    acknowledged_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Fetches active (unacknowledged) alerts for a given site.
 * Returns mocked data in DEMO mode.
 * @param siteId The identifier of the cultivation site.
 * @returns A promise that resolves to an array of active alerts.
 */
export const listAlerts = async (siteId: string): Promise<Alert[]> => {
  if (isDemoMode) {
    console.log('Alerts Service: Running in DEMO mode.');
    return Promise.resolve(demoAlerts.filter(a => a.acknowledged_at === null));
  }

  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('site_id', siteId)
    .is('acknowledged_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }

  return data as Alert[];
};

/**
 * Marks an alert as acknowledged.
 * Simulates the action in DEMO mode.
 * @param alertId The UUID of the alert to acknowledge.
 * @returns A promise that resolves when the operation is complete.
 */
export const ackAlert = async (alertId: string): Promise<void> => {
  if (isDemoMode) {
    console.log(`Alerts Service (DEMO): Acknowledged alert ${alertId}`);
    const alert = demoAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged_at = new Date().toISOString();
    }
    return Promise.resolve();
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('Cannot acknowledge alert: user not authenticated.');
    return;
  }

  const { error } = await supabase
    .from('alerts')
    .update({
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: user.id,
    })
    .eq('id', alertId);

  if (error) {
    console.error('Error acknowledging alert:', error);
  }
};
