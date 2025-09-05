import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values for demo mode
const fallbackUrl = 'https://demo.supabase.co';
const fallbackKey = 'demo-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. The app will run in DEMO mode.');
}
  auth: {
    persistSession: true,
  },
});

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey || fallbackKey, 
  {