import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import WaterQualityChart from './WaterQualityChart';
import RecentAlerts from './RecentAlerts';
import EnvironmentalAlerts from './EnvironmentalAlerts';
import TrafficLightPanel from './TrafficLightPanel';
import { useLiveParams } from '../../hooks/useLiveParams';
import { getThresholds, SiteThresholds } from '../../services/thresholds';
import { listAlerts, Alert } from '../../services/alerts';
import { getStatus } from '../../utils/status';
import { 
  Thermometer, 
  Droplets, 
  Activity, 
  Fish,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface DashboardLiveProps {
  onNavigateToReports: () => void;
}

const DashboardLive: React.FC<DashboardLiveProps> = ({ onNavigateToReports }) => {
  const { kpi, isLoading: isLoadingParams } = useLiveParams('centro-01');
  const [thresholds, setThresholds] = useState<SiteThresholds>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [thresholdsData, alertsData] = await Promise.all([
        getThresholds('centro-01'),
        listAlerts('centro-01')
      ]);
      setThresholds(thresholdsData);
      setAlerts(alertsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setLastUpdate(new Date());
  }, [kpi]);

  const metrics = [
    {
      id: 'temp',
      title: 'Temperatura Promedio',
      value: kpi.temperatura ?? 0,
      unit: '°C',
      icon: Thermometer,
      status: getStatus(kpi.temperatura ?? 0, thresholds.temperatura) === 'OK' ? 'normal' : 'warning',
    },
    {
      id: 'oxygen',
      title: 'Oxígeno Disuelto',
      value: kpi.oxigeno ?? 0,
      unit: 'mg/L',
      icon: Activity,
      status: getStatus(kpi.oxigeno ?? 0, thresholds.oxigeno) === 'OK' ? 'normal' : 'warning',
    },
    {
      id: 'ph',
      title: 'pH del Agua',
      value: kpi.ph ?? 0,
      unit: '',
      icon: Droplets,
      status: getStatus(kpi.ph ?? 0, thresholds.ph) === 'OK' ? 'normal' : 'warning',
    },
    {
      id: 'population',
      title: 'Población Total',
      value: 528000, // This would come from another source
      unit: 'peces',
      icon: Fish,
      status: 'normal' as const,
      subTitle: 'Biomasa Estimada',
      subValue: '1,848 T',
    },
    {
      id: 'growth',
      title: 'Tasa de Crecimiento',
      value: 2.3, // This would come from another source
      unit: '%/día',
      icon: TrendingUp,
      status: 'normal' as const,
    },
    {
      id: 'alerts',
      title: 'Alertas Activas',
      value: alerts.length,
      unit: '',
      icon: AlertTriangle,
      status: alerts.length > 0 ? 'warning' : 'normal',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard (Live)</h1>
            <p className="text-gray-600">
              Monitoreo en tiempo real de tus centros de cultivo
              <span className="ml-2 text-sm text-gray-500">
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
             <button
                onClick={onNavigateToReports}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ir a Reportes
              </button>
          </div>
        </div>
      </div>

      {isLoading || isLoadingParams ? (
        <div className="text-center py-10">Cargando datos en vivo...</div>
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
                trend={'stable'} // Trend data not available from live source yet
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
          
          {/* We can pass the live alerts to this component if we refactor it */}
          <RecentAlerts /> 
        </>
      )}
    </div>
  );
};

export default DashboardLive;
