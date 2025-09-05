import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { Concession } from '../types/concession';

interface ConcessionState {
  concessions: Concession[];
  selectedConcession: Concession | null;
  loading: boolean;
  error: string | null;
  fetchConcessions: () => Promise<void>;
  setSelectedConcession: (concession: Concession | null) => void;
}

export const useConcessionStore = create<ConcessionState>((set) => ({
  concessions: [],
  selectedConcession: null,
  loading: false,
  error: null,
  fetchConcessions: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('concessions')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }
      
      set({ concessions: data || [], loading: false });
      // Automatically select the first concession if available
      if (data && data.length > 0) {
        set({ selectedConcession: data[0] });
      }

    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  setSelectedConcession: (concession) => {
    set({ selectedConcession: concession });
  },
}));
