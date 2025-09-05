import { supabase } from '../lib/supabaseClient';
import { Thresholds } from '../utils/status';

export type SiteThresholds = Record<string, Thresholds>;

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// --- DATOS ESTÁTICOS PARA MODO DEMO ---
const demoThresholds: SiteThresholds = {
  temperatura: { warn_min: 12.0, warn_max: 16.0, crit_min: 10.0, crit_max: 18.0 },
  oxigeno: { warn_min: 6.0, warn_max: 12.0, crit_min: 4.0, crit_max: 14.0 },
  ph: { warn_min: 7.5, warn_max: 8.5, crit_min: 7.0, crit_max: 9.0 },
  salinidad: { warn_min: 32.0, warn_max: 34.5, crit_min: 30.0, crit_max: 36.0 },
  clorofila: { warn_min: 0, warn_max: 40, crit_min: 0, crit_max: 50 },
};

/**
 * Fetches the parameter thresholds for a given site.
 * Returns mocked data in DEMO mode.
 * @param siteId The identifier of the cultivation site.
 * @returns A promise that resolves to an object mapping parameters to their thresholds.
 */
export const getThresholds = async (siteId: string): Promise<SiteThresholds> => {
  if (isDemoMode) {
    console.log('Thresholds Service: Running in DEMO mode.');
    return Promise.resolve(demoThresholds);
  }

  const { data, error } = await supabase
    .from('site_thresholds')
    .select('parameter, warn_min, warn_max, crit_min, crit_max')
    .eq('site_id', siteId);

  if (error) {
    console.error('Error fetching thresholds:', error);
    // Fallback to demo data in case of an error
    return demoThresholds;
  }

  if (!data) {
    return {};
  }

  // Transform the array into a dictionary for easy lookup
  const thresholdsMap = data.reduce((acc, row) => {
    acc[row.parameter] = {
      warn_min: row.warn_min,
      warn_max: row.warn_max,
      crit_min: row.crit_min,
      crit_max: row.crit_max,
    };
    return acc;
  }, {} as SiteThresholds);

  return thresholdsMap;
};
