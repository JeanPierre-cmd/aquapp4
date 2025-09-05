import React, { useState } from 'react';
import ParameterCard from './ParameterCard';
import ParameterHistory from './ParameterHistory';
import { WaterParameter } from '../../types';
import { Droplets, Thermometer, Activity, Beaker, Download, RefreshCw, Settings, Leaf } from 'lucide-react';
import { PDFReportGenerator, WaterQualityReportData } from '../../utils/pdfGenerator';

const WaterQuality: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState<string>('temperatura');
  const [parameters, setParameters] = useState<WaterParameter[]>([
    {
      id: 'temp-1',
      name: 'Temperatura',
      value: 14.5,
      unit: '°C',
      minRange: 10,
      maxRange: 16,
      timestamp: new Date(),
      status: 'normal'
    },
    {
      id: 'oxygen-1',
      name: 'Oxígeno Disuelto',
      value: 8.2,
      unit: 'mg/L',
      minRange: 6,
      maxRange: 12,
      timestamp: new Date(),
      status: 'normal'
    },
    {
      id: 'ph-1',
      name: 'pH',
      value: 8.1,
      unit: '',
      minRange: 7.0,
      maxRange: 8.5,
      timestamp: new Date(),
      status: 'normal'
    },
    {
      id: 'salinity-1',
      name: 'Salinidad',
      value: 32.5,
      unit: 'PSU',
      minRange: 32,
      maxRange: 34.5,
      timestamp: new Date(),
      status: 'normal'
    },
    {
      id: 'chloro-1',
      name: 'Clorofila',
      value: 25.5,
      unit: 'mg/m³',
      minRange: 0,
      maxRange: 50,
      timestamp: new Date(),
      status: 'warning'
    }
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setRefreshing(true);
    // Simular actualización de datos desde sensores
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Actualizar con valores simulados que fluctúan
    setParameters(prev => prev.map(param => {
      let newValue = param.value + (Math.random() - 0.5) * (param.maxRange - param.minRange) * 0.1;
      newValue = Math.max(param.minRange * 0.8, Math.min(param.maxRange * 1.2, newValue));
      return {
        ...param,
        value: parseFloat(newValue.toFixed(1)),
        timestamp: new Date()
      };
    }));
    
    setRefreshing(false);
  };

  const handleExportData = () => {
    const reportData: WaterQualityReportData = {
      reportDate: new Date(),
      parameters: parameters,
      observations: `Reporte generado según los requerimientos del D.S. N° 320/2001 (RAMA) y compromisos de la RCA aplicable. Todos los valores se encuentran dentro de los rangos operacionales.`
    };
    
    const generator = new PDFReportGenerator();
    generator.generateWaterQualityReport(reportData);
  };

  const handleCalibrateParameter = (parameterId: string) => {
    const parameterName = parameters.find(p => p.name.toLowerCase() === parameterId)?.name || parameterId;
    if (confirm(`¿Desea iniciar la calibración del sensor de ${parameterName}?\n\nEste proceso es crucial para asegurar la validez de los datos reportados a la autoridad (SERNAPESCA, SMA) y tomará aproximadamente 5 minutos.`)) {
      alert(`Calibración iniciada para ${parameterName}.\n\nSiga las instrucciones en pantalla del sensor.\nTiempo estimado: 5 minutos.`);
    }
  };

  const getIcon = (parameterName: string) => {
    switch (parameterName.toLowerCase()) {
      case 'temperatura':
        return Thermometer;
      case 'oxígeno disuelto':
        return Activity;
      case 'ph':
        return Beaker;
      case 'salinidad':
        return Droplets;
      case 'clorofila':
        return Leaf;
      default:
        return Droplets;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Calidad del Agua</h1>
          <p className="text-gray-600">Monitoreo de parámetros críticos según D.S. N° 320/2001 (RAMA) y RCA.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefreshData}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exportar INFA</span>
          </button>
          <button
            onClick={() => handleCalibrateParameter(selectedParameter)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Calibrar Sensor</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {parameters.map((parameter) => (
          <ParameterCard
            key={parameter.id}
            parameter={parameter}
            icon={getIcon(parameter.name)}
            onClick={() => setSelectedParameter(parameter.name.toLowerCase())}
            isSelected={selectedParameter === parameter.name.toLowerCase()}
          />
        ))}
      </div>

      <ParameterHistory selectedParameter={selectedParameter} />
    </div>
  );
};

export default WaterQuality;
