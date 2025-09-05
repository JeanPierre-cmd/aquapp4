import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  MapPin,
  BarChart3,
  Activity,
  FileText,
  Target,
  Zap
} from 'lucide-react';
import { PDFReportGenerator, ExecutiveReportData } from '../../utils/pdfGenerator';

interface CenterComparison {
  id: string;
  name: string;
  location: string;
  metrics: {
    efficiency: number;
    maintenance: number;
    safety: number;
    compliance: number;
    productivity: number;
  };
  status: 'excellent' | 'good' | 'warning' | 'critical';
  criticalComponents: number;
  lastInspection: Date;
}

interface MaintenanceCycle {
  component: string;
  currentCycle: number;
  totalCycles: number;
  nextMaintenance: Date;
  status: 'optimal' | 'attention' | 'urgent';
  wearLevel: number;
}

const ExecutiveDashboard: React.FC = () => {
  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');

  // Datos simulados de centros
  const centers: CenterComparison[] = [
    {
      id: 'center-1',
      name: 'Centro MultiX Norte',
      location: 'Región de Los Lagos',
      metrics: { efficiency: 92, maintenance: 88, safety: 95, compliance: 98, productivity: 89 },
      status: 'excellent',
      criticalComponents: 0,
      lastInspection: new Date('2024-01-10')
    },
    {
      id: 'center-2',
      name: 'Centro MultiX Sur',
      location: 'Región de Aysén',
      metrics: { efficiency: 78, maintenance: 65, safety: 82, compliance: 90, productivity: 75 },
      status: 'warning',
      criticalComponents: 3,
      lastInspection: new Date('2024-01-08')
    },
    {
      id: 'center-3',
      name: 'Centro MultiX Este',
      location: 'Región de Magallanes',
      metrics: { efficiency: 85, maintenance: 92, safety: 88, compliance: 94, productivity: 87 },
      status: 'good',
      criticalComponents: 1,
      lastInspection: new Date('2024-01-12')
    }
  ];

  // Datos de ciclos de mantenimiento
  const maintenanceCycles: MaintenanceCycle[] = [
    {
      component: 'Redes de Contención',
      currentCycle: 8,
      totalCycles: 12,
      nextMaintenance: new Date('2024-02-15'),
      status: 'attention',
      wearLevel: 67
    },
    {
      component: 'Sistema de Anclaje',
      currentCycle: 3,
      totalCycles: 24,
      nextMaintenance: new Date('2024-06-20'),
      status: 'optimal',
      wearLevel: 12
    },
    {
      component: 'Boyas de Flotación',
      currentCycle: 15,
      totalCycles: 18,
      nextMaintenance: new Date('2024-01-30'),
      status: 'urgent',
      wearLevel: 83
    },
    {
      component: 'Sensores IoT',
      currentCycle: 6,
      totalCycles: 8,
      nextMaintenance: new Date('2024-02-05'),
      status: 'attention',
      wearLevel: 75
    }
  ];

  // Indicadores clave ejecutivos
  const kpiData = [
    {
      title: 'Eficiencia Operacional',
      value: '87%',
      trend: 'up',
      change: '+3.2%',
      status: 'good',
      icon: TrendingUp
    },
    {
      title: 'Cumplimiento Normativo',
      value: '94%',
      trend: 'up',
      change: '+1.8%',
      status: 'excellent',
      icon: CheckCircle
    },
    {
      title: 'Componentes Críticos',
      value: '4',
      trend: 'down',
      change: '-2',
      status: 'warning',
      icon: AlertTriangle
    },
    {
      title: 'Tiempo Promedio Reparación',
      value: '2.3h',
      trend: 'down',
      change: '-0.5h',
      status: 'good',
      icon: Activity
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'optimal': return 'bg-green-500';
      case 'attention': return 'bg-yellow-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const generateExecutiveReport = () => {
    const reportData: ExecutiveReportData = {
      title: 'Reporte Ejecutivo - Gestión de Centros Acuícolas',
      period: timeRange,
      generatedAt: new Date().toISOString(),
      centers: centers,
      kpis: kpiData,
      maintenanceCycles: maintenanceCycles,
      recommendations: [
        'Priorizar mantenimiento de boyas de flotación en Centro Norte',
        'Implementar programa de capacitación en Centro Sur',
        'Optimizar ciclos de inspección para reducir tiempos de inactividad',
        'Evaluar renovación de sensores IoT en todos los centros'
      ]
    };
    
    const generator = new PDFReportGenerator();
    generator.generateExecutiveReport(reportData);
  };

  return (
    <div className="space-y-6">
      {/* Header Ejecutivo */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Panel Ejecutivo - Gestión Acuícola</h1>
            <p className="text-blue-100">Resumen integral de operaciones y mantenimiento</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
            >
              <option value="month">Último Mes</option>
              <option value="quarter">Último Trimestre</option>
              <option value="year">Último Año</option>
            </select>
            <button
              onClick={generateExecutiveReport}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Ejecutivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 ${
                  kpi.status === 'excellent' ? 'text-green-600' :
                  kpi.status === 'good' ? 'text-blue-600' :
                  kpi.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  kpi.status === 'excellent' ? 'bg-green-100 text-green-800' :
                  kpi.status === 'good' ? 'bg-blue-100 text-blue-800' :
                  kpi.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {kpi.trend === 'up' ? '↗' : '↘'} {kpi.change}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Panel Semáforo de Componentes Críticos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Target className="h-6 w-6 text-blue-600" />
          <span>Estado de Componentes Críticos</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {maintenanceCycles.map((cycle, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{cycle.component}</h4>
                <div className={`w-4 h-4 rounded-full ${getStatusColor(cycle.status)}`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ciclo:</span>
                  <span className="font-medium">{cycle.currentCycle}/{cycle.totalCycles}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      cycle.wearLevel > 80 ? 'bg-red-500' :
                      cycle.wearLevel > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${cycle.wearLevel}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Desgaste: {cycle.wearLevel}%</span>
                  <span>{cycle.nextMaintenance.toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparación entre Centros - Gráfico Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span>Comparación de Centros</span>
          </h2>
          
          <div className="space-y-4">
            {centers.map((center) => (
              <div key={center.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{center.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {center.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(center.status)}
                    {center.criticalComponents > 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {center.criticalComponents} críticos
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 text-xs">
                  {Object.entries(center.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className={`w-full h-2 rounded-full mb-1 ${
                        value >= 90 ? 'bg-green-500' :
                        value >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ height: `${value/5}px`, minHeight: '8px' }}></div>
                      <span className="text-gray-600 capitalize">{key}</span>
                      <div className="font-medium">{value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa de Ubicación de Fallas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-red-600" />
            <span>Mapa de Fallas Críticas</span>
          </h2>
          
          <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg overflow-hidden">
            {/* Simulación de mapa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Mapa Interactivo de Centros</p>
                <p className="text-sm text-gray-500">Visualización de ubicaciones y estados</p>
              </div>
            </div>
            
            {/* Marcadores de centros */}
            <div className="absolute top-4 left-4 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute top-12 right-8 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute bottom-8 left-12 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            
            {/* Leyenda */}
            <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-2 text-xs">
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Óptimo</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Atención</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Crítico</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo y Recomendaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <FileText className="h-6 w-6 text-green-600" />
          <span>Resumen Ejecutivo y Recomendaciones</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Situación Actual</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">
                  87% de eficiencia operacional promedio
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  4 componentes requieren atención inmediata
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Reducción de 0.5h en tiempo promedio de reparación
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Recomendaciones Prioritarias</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border-l-4 border-red-500 bg-red-50">
                <Zap className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Urgente</p>
                  <p className="text-sm text-red-700">Reemplazar boyas de flotación (83% desgaste)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Importante</p>
                  <p className="text-sm text-yellow-700">Programar mantenimiento preventivo de redes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Optimización</p>
                  <p className="text-sm text-blue-700">Implementar sensores IoT adicionales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Próxima revisión ejecutiva: <span className="font-medium">15 de Febrero, 2024</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cumplimiento normativo SERNAPESCA: 94% | Resolución Exenta 1821
              </p>
            </div>
            <button
              onClick={generateExecutiveReport}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Generar Reporte Completo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
