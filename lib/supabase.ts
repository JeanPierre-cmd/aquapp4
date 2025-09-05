import { createClient } from '@supabase/supabase-js';
import { config } from '../shared/env';

// Ensure Supabase URL and Anon Key are provided
if (!config.supabase.url || !config.supabase.anonKey) {
  console.error('Supabase URL and Anon Key are required in environment variables.');
  // In a production app, you might want to throw an error or handle this more gracefully.
  // For now, we'll proceed with undefined values, which will likely cause runtime errors.
}

export const supabase = createClient(
  config.supabase.url || '', // Provide a fallback empty string if undefined
  config.supabase.anonKey || '' // Provide a fallback empty string if undefined
);
