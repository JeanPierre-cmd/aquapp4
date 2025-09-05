/**
 * Centraliza TODAS las feature-flags del visor 3D/2D de Infraestructura.
 *
 * – GLTF/GLB soporte → VITE_VIEWER_GLTF_SUPPORT  (default: true)
 * – APS genérico     → VITE_VIEWER_APS_SUPPORT   (default: false)
 * – APS infra módulo → VITE_INFRA_APS_ENABLED    (default: false)
 * – Multi-URN        → VITE_INFRA_APS_MULTI      (default: false)
 *
 * Leer desde import.meta.env mantiene el tree-shaking de Vite.
 */
export const features = {
  // flags históricas (se mantienen p/otros módulos)
  gltfSupport:
    import.meta.env.VITE_VIEWER_GLTF_SUPPORT !== 'false', // ON por defecto
  apsSupport: import.meta.env.VITE_VIEWER_APS_SUPPORT === 'true', // OFF por defecto

  // flags NUEVAS – exclusivas del módulo Infraestructura
  infraApsEnabled: import.meta.env.VITE_INFRA_APS_ENABLED === 'true', // OFF por defecto
  infraApsMulti: import.meta.env.VITE_INFRA_APS_MULTI === 'true' // OFF por defecto
} as const;
