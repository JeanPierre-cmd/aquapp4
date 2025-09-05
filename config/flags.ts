/**
 * Feature flags to enable or disable functionalities across the application.
 * This allows for gradual rollouts, A/B testing, or hiding incomplete features.
 */
export const FLAGS = {
  /**
   * Controls the visibility of the data import module.
   * If `false`, the sidebar link and the `/importar` route will be hidden.
   */
  IMPORTAR_ENABLED: true,
};
