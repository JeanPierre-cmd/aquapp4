// Tipos para el cálculo de fatiga
export interface SeaState {
  significantWaveHeight: number; // Hs (m)
  peakPeriod: number; // Tp (s)
  currentVelocity: number; // U (m/s)
}

export interface ComponentSpecs {
  diameter: number; // D (m)
  material: 'A36' | 'AISI316' | 'custom';
  ultimateStrength?: number; // Su (MPa) - para materiales custom
  geometricFactor?: number; // k - factor geométrico-hidrodinámico
  meanStress?: number; // σm (MPa) - tensión media por pre-tensión
}

export interface FatigueResult {
  alternatingStress: number; // σa (MPa)
  equivalentStress: number; // σa,eq (MPa)
  cyclestoFailure: number; // N (ciclos)
  lifeYears: number; // Vida en años
  status: 'failure' | 'critical' | 'moderate' | 'good' | 'infinite';
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green';
  recommendation: string;
}

export type FatigueModel = 'goodman' | 'gerber';

// Constantes del material
const MATERIAL_PROPERTIES = {
  A36: {
    ultimateStrength: 400, // MPa
    fatigueStrength: 480, // σf' MPa
    fatigueExponent: 5.6 // b
  },
  AISI316: {
    ultimateStrength: 520, // MPa
    fatigueStrength: 650, // σf' MPa
    fatigueExponent: 6.2 // b
  }
};

// Constantes físicas
const WATER_DENSITY = 1025; // kg/m³
const GRAVITY = 9.81; // m/s²
const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

/**
 * Paso 1: Cálculo del esfuerzo alternante hidrodinámico
 * σa = k * ρ * g * Hs * (D/4) + kc * ρ * U²
 */
function calculateAlternatingStress(
  seaState: SeaState,
  component: ComponentSpecs
): number {
  const { significantWaveHeight, currentVelocity } = seaState;
  const { diameter, geometricFactor = 0.9 } = component;
  
  // Factor de corriente (kc ≈ 0.5 * k si no se especifica)
  const currentFactor = geometricFactor * 0.5;
  
  // Término de oleaje
  const waveStress = geometricFactor * WATER_DENSITY * GRAVITY * 
                    significantWaveHeight * (diameter / 4);
  
  // Término de corriente
  const currentStress = currentFactor * WATER_DENSITY * Math.pow(currentVelocity, 2);
  
  // Convertir de Pa a MPa
  return (waveStress + currentStress) / 1e6;
}

/**
 * Paso 2: Corrección por tensión media (Goodman / Gerber)
 */
function applyMeanStressCorrection(
  alternatingStress: number,
  component: ComponentSpecs,
  model: FatigueModel
): number {
  const material = component.material === 'custom' 
    ? { ultimateStrength: component.ultimateStrength || 400 }
    : MATERIAL_PROPERTIES[component.material];
  
  const meanStress = component.meanStress || 0;
  const ultimateStrength = material.ultimateStrength;
  
  if (meanStress === 0) {
    return alternatingStress;
  }
  
  switch (model) {
    case 'goodman':
      return alternatingStress / (1 - meanStress / ultimateStrength);
    
    case 'gerber':
      const ratio = meanStress / ultimateStrength;
      return alternatingStress / (1 - Math.pow(ratio, 2));
    
    default:
      return alternatingStress;
  }
}

/**
 * Paso 3: Vida a fatiga por curva S-N
 * N = (σf' / σa,eq)^b
 */
function calculateFatigueCycles(
  equivalentStress: number,
  component: ComponentSpecs
): number {
  const material = component.material === 'custom'
    ? { fatigueStrength: 480, fatigueExponent: 5.6 } // Valores por defecto A36
    : MATERIAL_PROPERTIES[component.material];
  
  const { fatigueStrength, fatigueExponent } = material;
  
  if (equivalentStress <= 0) {
    return Infinity;
  }
  
  return Math.pow(fatigueStrength / equivalentStress, fatigueExponent);
}

/**
 * Paso 4: Convertir a años y aplicar umbrales
 */
function calculateLifeYears(cycles: number, frequency: number): number {
  if (!isFinite(cycles)) {
    return Infinity;
  }
  
  return cycles / (frequency * SECONDS_PER_YEAR);
}

/**
 * Determinar estado y color basado en la vida útil
 */
function determineStatus(lifeYears: number): {
  status: FatigueResult['status'];
  color: FatigueResult['color'];
  recommendation: string;
} {
  if (lifeYears < 1.5) {
    return {
      status: 'failure',
      color: 'red',
      recommendation: 'CRÍTICO: Reemplazo inmediato requerido. Riesgo de falla estructural.'
    };
  } else if (lifeYears < 3) {
    return {
      status: 'critical',
      color: 'orange',
      recommendation: 'URGENTE: Programar reemplazo en los próximos 6 meses.'
    };
  } else if (lifeYears < 10) {
    return {
      status: 'moderate',
      color: 'yellow',
      recommendation: 'ATENCIÓN: Monitoreo frecuente y planificar reemplazo.'
    };
  } else if (lifeYears < 35) {
    return {
      status: 'good',
      color: 'blue',
      recommendation: 'BUENO: Mantenimiento preventivo según cronograma.'
    };
  } else {
    return {
      status: 'infinite',
      color: 'green',
      recommendation: 'EXCELENTE: Vida útil extendida, mantenimiento rutinario.'
    };
  }
}

/**
 * Función principal de estimación de vida útil a fatiga
 */
export function estimateFatigueLife(
  seaState: SeaState,
  component: ComponentSpecs,
  model: FatigueModel = 'goodman'
): FatigueResult {
  // Calcular frecuencia de oleaje
  const frequency = 1 / seaState.peakPeriod;
  
  // Paso 1: Esfuerzo alternante
  const alternatingStress = calculateAlternatingStress(seaState, component);
  
  // Paso 2: Corrección por tensión media
  const equivalentStress = applyMeanStressCorrection(alternatingStress, component, model);
  
  // Paso 3: Ciclos a falla
  const cyclestoFailure = calculateFatigueCycles(equivalentStress, component);
  
  // Paso 4: Vida en años
  const lifeYears = calculateLifeYears(cyclestoFailure, frequency);
  
  // Determinar estado
  const { status, color, recommendation } = determineStatus(lifeYears);
  
  return {
    alternatingStress,
    equivalentStress,
    cyclestoFailure,
    lifeYears,
    status,
    color,
    recommendation
  };
}

/**
 * Función para múltiples escenarios (verano, invierno, etc.)
 */
export function estimateMultipleScenarios(
  scenarios: { name: string; seaState: SeaState }[],
  component: ComponentSpecs,
  model: FatigueModel = 'goodman'
): { name: string; result: FatigueResult }[] {
  return scenarios.map(scenario => ({
    name: scenario.name,
    result: estimateFatigueLife(scenario.seaState, component, model)
  }));
}

/**
 * Función para generar alertas basadas en vida útil
 */
export function generateFatigueAlerts(
  components: Array<{ id: string; name: string; specs: ComponentSpecs }>,
  seaState: SeaState,
  model: FatigueModel = 'goodman'
): Array<{
  componentId: string;
  componentName: string;
  severity: 'critical' | 'high' | 'medium';
  message: string;
  lifeYears: number;
}> {
  const alerts = [];
  
  for (const component of components) {
    const result = estimateFatigueLife(seaState, component.specs, model);
    
    if (result.lifeYears < 3) {
      alerts.push({
        componentId: component.id,
        componentName: component.name,
        severity: result.lifeYears < 1.5 ? 'critical' : 'high',
        message: `${component.name}: Vida útil estimada ${result.lifeYears.toFixed(1)} años. ${result.recommendation}`,
        lifeYears: result.lifeYears
      });
    }
  }
  
  return alerts.sort((a, b) => a.lifeYears - b.lifeYears);
}

/**
 * Escenarios predefinidos para análisis comparativo
 */
export const PREDEFINED_SCENARIOS = {
  summer: {
    name: 'Verano',
    seaState: {
      significantWaveHeight: 2.5,
      peakPeriod: 8.0,
      currentVelocity: 0.8
    }
  },
  winter: {
    name: 'Invierno',
    seaState: {
      significantWaveHeight: 4.2,
      peakPeriod: 10.5,
      currentVelocity: 1.2
    }
  },
  extreme1982: {
    name: 'Extremo 1982',
    seaState: {
      significantWaveHeight: 6.8,
      peakPeriod: 12.0,
      currentVelocity: 1.8
    }
  },
  extreme2013: {
    name: 'Extremo 2013',
    seaState: {
      significantWaveHeight: 7.5,
      peakPeriod: 13.2,
      currentVelocity: 2.1
    }
  }
};

/**
 * Componentes típicos con especificaciones por defecto
 */
export const TYPICAL_COMPONENTS = {
  shackle: {
    diameter: 0.042, // 42mm
    material: 'A36' as const,
    geometricFactor: 0.9,
    meanStress: 150 // MPa
  },
  chain: {
    diameter: 0.032, // 32mm
    material: 'A36' as const,
    geometricFactor: 0.8,
    meanStress: 120 // MPa
  },
  buoy: {
    diameter: 1.5, // 1.5m
    material: 'AISI316' as const,
    geometricFactor: 0.7,
    meanStress: 50 // MPa
  },
  anchor: {
    diameter: 0.8, // 0.8m
    material: 'A36' as const,
    geometricFactor: 1.2,
    meanStress: 200 // MPa
  }
};
