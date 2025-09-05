import React from 'react';
import { LucideIcon } from 'lucide-react';
import { WaterParameter } from '../../types';
import { evaluateEnvironmentalParameter } from '../../utils/environmentalRanges';

interface ParameterCardProps {
  parameter: WaterParameter;
  icon: LucideIcon;
  onClick: () => void;
  isSelected: boolean;
}

const ParameterCard: React.FC<ParameterCardProps> = ({ 
  parameter, 
  icon: Icon, 
  onClick, 
  isSelected 
}) => {
  const getStatusColorClasses = (alertLevel: 'green' | 'yellow' | 'red') => {
    switch (alertLevel) {
      case 'green':
        return {
          border: 'border-green-400',
          bg: 'bg-green-50',
          text: 'text-green-600',
          progress: 'bg-green-500',
        };
      case 'yellow':
        return {
          border: 'border-yellow-400',
          bg: 'bg-yellow-50',
          text: 'text-yellow-600',
          progress: 'bg-yellow-500',
        };
      case 'red':
        return {
          border: 'border-red-500',
          bg: 'bg-red-50',
          text: 'text-red-600',
          progress: 'bg-red-500',
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-white',
          text: 'text-gray-900',
          progress: 'bg-gray-500',
        };
    }
  };

  const getEnvironmentalStatus = () => {
    const parameterTypeMap: Record<string, keyof typeof import('../../utils/environmentalRanges').environmentalRanges> = {
      'Temperatura': 'seaTemperature',
      'Salinidad': 'salinity',
      'Clorofila': 'chlorophyll'
    };
    
    const envType = parameterTypeMap[parameter.name];
    if (envType) {
      return evaluateEnvironmentalParameter(envType, parameter.value);
    }
    // Fallback for parameters not in environmentalRanges (like pH, Oxygen)
    const isOutOfRange = parameter.value < parameter.minRange || parameter.value > parameter.maxRange;
    return {
      impact: isOutOfRange ? 'negative' : 'positive',
      alertLevel: isOutOfRange ? 'yellow' : 'green',
      riskLevel: isOutOfRange ? 'medium' : 'low',
      condition: isOutOfRange ? 'Fuera de rango' : 'Normal'
    };
  };

  const envStatus = getEnvironmentalStatus();
  const colors = getStatusColorClasses(envStatus.alertLevel);

  const getProgressPercentage = () => {
    const range = parameter.maxRange - parameter.minRange;
    if (range <= 0) return 50; // Avoid division by zero
    const position = parameter.value - parameter.minRange;
    return Math.max(0, Math.min(100, (position / range) * 100));
  };

  const impactTextMap = {
    positive: '✓ Impacto Positivo',
    neutral: '○ Impacto Neutro',
    negative: '⚠ Impacto Negativo',
    highly_negative: '✗ Impacto Altamente Negativo'
  };

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
        colors.border
      } ${colors.bg} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{parameter.name}</h3>
        <Icon className={`h-5 w-5 ${colors.text}`} />
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className={`text-2xl font-bold ${colors.text}`}>
            {parameter.value.toFixed(1)}
          </span>
          <span className="ml-1 text-sm text-gray-500">{parameter.unit}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{parameter.minRange}</span>
          <span>{parameter.maxRange}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${colors.progress}`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-1 mt-4">
        <p className="text-xs text-gray-500">
          Rango óptimo: {parameter.minRange} - {parameter.maxRange} {parameter.unit}
        </p>
        <p className={`text-xs font-medium ${colors.text}`}>
          {impactTextMap[envStatus.impact] || envStatus.condition}
        </p>
      </div>
    </div>
  );
};

export default ParameterCard;
