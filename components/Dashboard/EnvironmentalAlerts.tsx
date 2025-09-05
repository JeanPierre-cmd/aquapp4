import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Waves, Wind, Thermometer, Droplets } from 'lucide-react';
import { EnvironmentalParameter } from '../../types';
import { environmentalRanges, evaluateEnvironmentalParameter } from '../../utils/environmentalRanges';

const EnvironmentalAlerts: React.FC = () => {
  // Datos simulados de parámetros ambientales actuales
  const currentParameters = [
    { type: 'waveHeight' as const, value: 3.2 },
    { type: 'windSpeed' as const, value: 25 },
    { type: 'currentSpeed' as const, value: 1.4 },
    { type: 'seaTemperature' as const, value: 13.5 },
    { type: 'depth' as const, value: 450 },
    { type: 'chlorophyll' as const, value: 35 },
    { type: 'salinity' as const, value: 33.2 }
  ];

  const getIcon = (parameterType: string) => {
    switch (parameterType) {
      case 'waveHeight':
        return Waves;
      case 'windSpeed':
        return Wind;
      case 'currentSpeed':
        return Waves;
      case 'seaTemperature':
        return Thermometer;
      case 'depth':
        return Droplets;
      case 'chlorophyll':
        return Droplets;
      case 'salinity':
        return Droplets;
      default:
        return AlertTriangle;
    }
  };

  const getAlertIcon = (alertLevel: string) => {
    switch (alertLevel) {
      case 'green':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'yellow':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'red':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (alertLevel: string) => {
    switch (alertLevel) {
      case 'green':
        return 'border-l-green-500 bg-green-50';
      case 'yellow':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'red':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'Impacto Positivo';
      case 'neutral':
        return 'Impacto Neutro';
      case 'negative':
        return 'Impacto Negativo';
      case 'highly_negative':
        return 'Impacto Altamente Negativo';
      default:
        return 'Impacto Desconocido';
    }
  };

  const evaluatedParameters = currentParameters.map(param => {
    const evaluation = evaluateEnvironmentalParameter(param.type, param.value);
    const parameterInfo = environmentalRanges[param.type];
    
    return {
      ...param,
      ...evaluation,
      name: parameterInfo.name,
      unit: parameterInfo.unit
    };
  });

  // Contar alertas por nivel
  const alertCounts = evaluatedParameters.reduce((acc, param) => {
    acc[param.alertLevel] = (acc[param.alertLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alertas Ambientales</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{alertCounts.green || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{alertCounts.yellow || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{alertCounts.red || 0}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {evaluatedParameters.map((param, index) => {
          const Icon = getIcon(param.type);
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${getAlertColor(param.alertLevel)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{param.name}</h4>
                    <p className="text-sm text-gray-600">
                      {param.value} {param.unit} - Rango: {param.condition}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getAlertIcon(param.alertLevel)}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {getImpactText(param.impact)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      Riesgo: {param.riskLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de Estado */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Resumen del Estado Ambiental</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{alertCounts.green || 0}</p>
            <p className="text-sm text-gray-600">Condiciones Óptimas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{alertCounts.yellow || 0}</p>
            <p className="text-sm text-gray-600">Precaución</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{alertCounts.red || 0}</p>
            <p className="text-sm text-gray-600">Riesgo Alto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalAlerts;
