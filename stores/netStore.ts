import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { Net, NetDetails } from '../types/net';

interface NetState {
  nets: Net[];
  loading: boolean;
  error: string | null;
  fetchNetsByConcession: (concessionId: string | null) => Promise<void>;

  // State para la vista de detalle
  selectedNetDetails: NetDetails | null;
  detailsLoading: boolean;
  detailsError: string | null;
  fetchNetDetails: (netId: string) => Promise<void>;
}

export const useNetStore = create<NetState>((set) => ({
  nets: [],
  loading: false,
  error: null,
  selectedNetDetails: null,
  detailsLoading: false,
  detailsError: null,

  fetchNetsByConcession: async (concessionId) => {
    if (!concessionId) {
      set({ nets: [], loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('nets')
        .select('*')
        .eq('concession_id', concessionId)
        .order('code', { ascending: true });

      if (error) throw error;
      
      set({ nets: data as Net[], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchNetDetails: async (netId) => {
    set({ detailsLoading: true, detailsError: null, selectedNetDetails: null });
    try {
      // Simulamos la obtención de datos relacionados en paralelo.
      // En una app real, estas serían vistas o funciones RPC de Supabase.
      const [historyRes, kpisRes, certificatesRes] = await Promise.all([
        supabase.from('v_net_history').select('*').eq('net_id', netId).order('ts', { ascending: false }),
        supabase.from('v_net_kpis').select('*').eq('net_id', netId).single(),
        supabase.from('certificates').select('*, issuer:actors(name)').eq('net_id', netId).order('issued_at', { ascending: false })
      ]);

      if (historyRes.error) throw historyRes.error;
      if (kpisRes.error) throw kpisRes.error;
      if (certificatesRes.error) throw certificatesRes.error;

      // Procesamos los certificados para aplanar el nombre del emisor
      const certificates = certificatesRes.data.map(c => ({
        ...c,
        issuer_name: (c.issuer as any)?.name || 'Desconocido'
      }));

      set({
        selectedNetDetails: {
          history: historyRes.data,
          kpis: kpisRes.data,
          certificates: certificates,
        },
        detailsLoading: false,
      });
    } catch (error: any) {
      set({ detailsError: error.message, detailsLoading: false });
    }
  },
}));
