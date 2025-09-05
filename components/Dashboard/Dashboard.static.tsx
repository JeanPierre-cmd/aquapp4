import React from 'react';
import { useState } from 'react';
import MetricCard from './MetricCard';
import WaterQualityChart from './WaterQualityChart';
import RecentAlerts from './RecentAlerts';
import EnvironmentalAlerts from './EnvironmentalAlerts';
import TrafficLightPanel from './TrafficLightPanel';
import ExecutiveTrafficLight from './ExecutiveTrafficLight';
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Fish,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

// NOTE: This file is the original Dashboard.tsx, renamed to Dashboard.static.tsx
// to support conditional loading without deleting the original code.

interface DashboardProps {
  onNavigateToReports: () => void;
}

const initialMetrics = [
  {
    id: 'temp',
    title: 'Temperatura Promedio',
    value: 14.5,
    unit: '°C',
    icon: Thermometer,
    status: 'normal' as const,
    trend: 'stable' as const,
  },
  {
    id: 'oxygen',
    title: 'Oxígeno Disuelto',
    value: 8.2,
    unit: 'mg/L',
    icon: Activity,
    status: 'normal' as const,
    trend: 'up' as const,
  },
  {
    id: 'ph',
    title: 'pH del Agua',
    value: 7.8,
    unit: '',
    icon: Droplets,
    status: 'warning' as const,
    trend: 'down' as const,
  },
  {
    id: 'population',
    title: 'Población Total',
    value: 528000,
    unit: 'peces',
    icon: Fish,
    status: 'normal' as const,
    trend: 'stable' as const,
    subTitle: 'Biomasa Estimada',
    subValue: '1,848 T',
  },
  {
    id: 'growth',
    title: 'Tasa de Crecimiento',
    value: 2.3,
    unit: '%/día',
    icon: TrendingUp,
    status: 'normal' as const,
    trend: 'up' as const,
  },
  {
    id: 'alerts',
    title: 'Alertas Activas',
    value: 3,
    unit: '',
    icon: AlertTriangle,
    status: 'warning' as const,
    trend: 'down' as const,
  },
];

const StaticDashboard: React.FC<DashboardProps> = ({ onNavigateToReports }) => {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showExecutiveView, setShowExecutiveView] = useState(true);

  const handleRefresh = () => {
    setRefreshing(true);
    
    setTimeout(() => {
      const newMetrics = metrics.map(metric => {
        let newValue = metric.value;
        const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
        const newTrend = trends[Math.floor(Math.random() * trends.length)];

        switch (metric.id) {
          case 'temp':
            newValue = parseFloat((metric.value + (Math.random() - 0.5) * 0.5).toFixed(1));
            break;
          case 'oxygen':
            newValue = parseFloat((metric.value + (Math.random() - 0.5) * 0.2).toFixed(1));
            break;
          case 'ph':
            newValue = parseFloat((metric.value + (Math.random() - 0.5) * 0.1).toFixed(1));
            break;
          case 'population':
            const mortality = Math.floor(Math.random() * 500);
            newValue = Math.max(0, (metric.value as number) - mortality);
            break;
          case 'growth':
            newValue = parseFloat((metric.value + (Math.random() - 0.5) * 0.1).toFixed(1));
            break;
          case 'alerts':
            newValue = Math.max(0, metric.value + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0));
            break;
          default:
            break;
        }

        if (metric.id === 'population') {
            const newBiomass = ((newValue as number) * 3.5 / 1000).toFixed(0);
            return { 
                ...metric, 
                value: newValue, 
                trend: newTrend,
                subValue: `${parseInt(newBiomass).toLocaleString('es-ES')} T`
            };
        }

        return { ...metric, value: newValue, trend: newTrend };
      });

      setMetrics(newMetrics);
      setLastUpdate(new Date());
      setRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard (Demo)</h1>
            <p className="text-gray-600">
              Monitoreo en tiempo real de tus centros de cultivo
              <span className="ml-2 text-sm text-gray-500">
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowExecutiveView(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ease-in-out ${
                  showExecutiveView
                    ? 'bg-blue-700 shadow-md scale-105'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Vista Ejecutiva
              </button>
              <button
                onClick={() => setShowExecutiveView(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 ease-in-out ${
                  !showExecutiveView
                    ? 'bg-blue-700 shadow-md scale-105'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Vista Operacional
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refreshing ? 'Actualizando...' : 'Actualizar Datos'}
              </button>
              <button
                onClick={onNavigateToReports}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ir a Reportes
              </button>
            </div>
          </div>
        </div>
      </div>

      {showExecutiveView ? (
        <ExecutiveTrafficLight lastUpdate={lastUpdate} />
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.id === 'population' ? (metric.value as number).toLocaleString('es-ES') : metric.value}
            unit={metric.unit}
            icon={metric.icon}
            status={metric.status}
            trend={metric.trend}
            subTitle={(metric as any).subTitle}
            subValue={(metric as any).subValue}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterQualityChart />
        <EnvironmentalAlerts />
      </div>
      
      <TrafficLightPanel />
      
      <RecentAlerts />
        </>
      )}
    </div>
  );
};

export default StaticDashboard;
