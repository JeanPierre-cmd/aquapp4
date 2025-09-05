/**
 * Parses environment variables to provide a typed configuration object.
 * This centralizes environment-dependent settings and provides default fallbacks.
 */

const parseEnvBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) {
    return defaultValue;
  }
  return ['true', '1', 'on'].includes(value.toLowerCase());
};

export const config = {
  notifications: {
    enabled: parseEnvBoolean(import.meta.env.VITE_NOTIF_ENABLED, true),
    toastsEnabled: parseEnvBoolean(import.meta.env.VITE_NOTIF_TOASTS_ENABLED, true),
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  // Future configuration sections can be added here.
  // e.g., api: { baseUrl: import.meta.env.VITE_API_URL }
};
