export const MODULES = {
  DASHBOARD: 'dashboard',
  CONCESIONES: 'concesiones',
  WATER_QUALITY: 'water-quality',
  FISH_HEALTH: 'fish-health',
  VISUALIZATION_3D: 'visualization-3d',
  REPORTS: 'reports',
  MAINTENANCE: 'maintenance',
  ALERTS: 'alerts',
  FEEDING: 'feeding',
  CAGES: 'cages',
  STRUCTURAL_HISTORY: 'structural-history',
  MODELS: 'models',
  CENTER_COMPARISON: 'center-comparison',
  SUPPORT: 'support',
  LOYALTY: 'loyalty',
  NOTIFICATIONS: 'notifications',
  IMPORTAR: 'importar'
} as const;

export type ModuleId = typeof MODULES[keyof typeof MODULES];