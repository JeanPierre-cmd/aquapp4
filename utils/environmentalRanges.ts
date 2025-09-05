import { EnvironmentalParameter } from '../types';

export const environmentalRanges = {
  waveHeight: {
    name: 'Altura de ola significativa',
    unit: 'm',
    ranges: [
      { condition: '0-2', min: 0, max: 2, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '2-4', min: 2, max: 4, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '4-6', min: 4, max: 6, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '6-8', min: 6, max: 8, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '8-10', min: 8, max: 10, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '>10', min: 10, max: Infinity, impact: 'highly_negative' as const, riskLevel: 'high' as const }
    ]
  },
  windSpeed: {
    name: 'Velocidad del viento',
    unit: 'kn',
    ranges: [
      { condition: '0-10', min: 0, max: 10, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '10-20', min: 10, max: 20, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '20-30', min: 20, max: 30, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '30-40', min: 30, max: 40, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '40-50', min: 40, max: 50, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '>50', min: 50, max: Infinity, impact: 'highly_negative' as const, riskLevel: 'high' as const }
    ]
  },
  currentSpeed: {
    name: 'Velocidad de corriente',
    unit: 'kn',
    ranges: [
      { condition: '0-0.4', min: 0, max: 0.4, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '0.4-0.8', min: 0.4, max: 0.8, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '0.8-1.2', min: 0.8, max: 1.2, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '1.2-1.6', min: 1.2, max: 1.6, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '1.6-2.0', min: 1.6, max: 2.0, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '>2.0', min: 2.0, max: Infinity, impact: 'highly_negative' as const, riskLevel: 'high' as const }
    ]
  },
  seaTemperature: {
    name: 'Temperatura superficial del mar',
    unit: '°C',
    ranges: [
      { condition: '6-8', min: 6, max: 8, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '8-10', min: 8, max: 10, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '10-12', min: 10, max: 12, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '12-14', min: 12, max: 14, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '14-16', min: 14, max: 16, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '>16', min: 16, max: Infinity, impact: 'negative' as const, riskLevel: 'medium' as const }
    ]
  },
  depth: {
    name: 'Profundidad',
    unit: 'm',
    ranges: [
      { condition: '30-100', min: 30, max: 100, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '100-300', min: 100, max: 300, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '300-500', min: 300, max: 500, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '500-700', min: 500, max: 700, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '700-900', min: 700, max: 900, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '>900', min: 900, max: Infinity, impact: 'highly_negative' as const, riskLevel: 'high' as const }
    ]
  },
  chlorophyll: {
    name: 'Clorofila',
    unit: 'mg/m³',
    ranges: [
      { condition: '0-10', min: 0, max: 10, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '10-20', min: 10, max: 20, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '20-30', min: 20, max: 30, impact: 'positive' as const, riskLevel: 'low' as const },
      { condition: '30-40', min: 30, max: 40, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '40-50', min: 40, max: 50, impact: 'negative' as const, riskLevel: 'medium' as const },
      { condition: '>50', min: 50, max: Infinity, impact: 'negative' as const, riskLevel: 'medium' as const }
    ]
  },
  salinity: {
    name: 'Salinidad',
    unit: 'PSU',
    ranges: [
      { condition: '32-32.5', min: 32, max: 32.5, impact: 'neutral' as const, riskLevel: 'low' as const },
      { condition: '32.5-33', min: 32.5, max: 33, impact: 'neutral' as const, riskLevel: 'low' as const },
      { condition: '33-33.5', min: 33, max: 33.5, impact: 'neutral' as const, riskLevel: 'low' as const },
      { condition: '33.5-34', min: 33.5, max: 34, impact: 'neutral' as const, riskLevel: 'low' as const },
      { condition: '34-34.5', min: 34, max: 34.5, impact: 'neutral' as const, riskLevel: 'low' as const }
    ]
  }
};

export const evaluateEnvironmentalParameter = (
  parameterType: keyof typeof environmentalRanges,
  value: number
): {
  impact: 'positive' | 'neutral' | 'negative' | 'highly_negative';
  alertLevel: 'green' | 'yellow' | 'red';
  riskLevel: 'low' | 'medium' | 'high';
  condition: string;
} => {
  const parameter = environmentalRanges[parameterType];
  
  for (const range of parameter.ranges) {
    if (value >= range.min && value < range.max) {
      let alertLevel: 'green' | 'yellow' | 'red';
      
      switch (range.impact) {
        case 'positive':
          alertLevel = 'green';
          break;
        case 'neutral':
          alertLevel = 'green';
          break;
        case 'negative':
          alertLevel = 'yellow';
          break;
        case 'highly_negative':
          alertLevel = 'red';
          break;
        default:
          alertLevel = 'green';
      }
      
      return {
        impact: range.impact,
        alertLevel,
        riskLevel: range.riskLevel,
        condition: range.condition
      };
    }
  }
  
  // Default fallback
  return {
    impact: 'neutral',
    alertLevel: 'green',
    riskLevel: 'low',
    condition: 'unknown'
  };
};
