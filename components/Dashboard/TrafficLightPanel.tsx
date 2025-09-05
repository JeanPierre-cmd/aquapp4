import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Wrench, Zap, Shield } from 'lucide-react';

interface SystemStatus {
  id: string;
  name: string;
  status: 'optimal' | 'warning' | 'critical';
  value: string;
  description: string;
  lastCheck: Date;
  icon: React.ComponentType<any>;
}

const TrafficLightPanel: React.FC = () => {
  const systemStatuses: SystemStatus[] = [
    {
      id: 'structural',
      name: 'Integridad Estructural',
      status: 'optimal',
      value: '98%',
      description: 'Todos los componentes estructurales en condiciones óptimas',
      lastCheck: new Date('2024-01-15T10:30:00'),
      icon: Shield
    },
    {
      id: 'maintenance',
      name: 'Ciclo de Mantenimiento',
      status: 'warning',
      value: '67%',
      description: '3 componentes requieren mantenimiento preventivo',
      lastCheck: new Date('2024-01-15T09:15:00'),
      icon: Wrench
    },
    {
      id: 'sensors',
      name: 'Sistemas de Monitoreo',
      status: 'optimal',
      value: '100%',
      description: 'Todos los sensores operativos y transmitiendo datos',
      lastCheck: new Date('2024-01-15T11:00:00'),
      icon: Zap
    },
    {
      id: 'anchoring',
      name: 'Sistema de Anclaje',
      status: 'critical',
      value: '45%',
      description: 'Tensión excesiva detectada en ancla norte',
      lastCheck: new Date('2024-01-15T08:45:00'),
      icon: AlertTriangle
    },
    {
      id: 'nets',
      name: 'Redes de Contención',
      status: 'warning',
      value: '72%',
      description: 'Desgaste moderado en sector sur-este',
      lastCheck: new Date('2024-01-15T07:20:00'),
      icon: Shield
    },
    {
      id: 'buoys',
      name: 'Boyas de Flotación',
      status: 'optimal',
      value: '94%',
      description: 'Sistema de flotación funcionando correctamente',
      lastCheck: new Date('2024-01-15T10:45:00'),
      icon: CheckCircle
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'critical':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'ÓPTIMO';
      case 'warning':
        return 'ATENCIÓN';
      case 'critical':
        return 'CRÍTICO';
      default:
        return 'DESCONOCIDO';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Contar estados
  const statusCounts = systemStatuses.reduce((acc, system) => {
    acc[system.status] = (acc[system.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Panel de Estado - Componentes Críticos</h3>
        
        {/* Resumen de estados */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{statusCounts.optimal || 0} Óptimos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{statusCounts.warning || 0} Atención</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{statusCounts.critical || 0} Críticos</span>
          </div>
        </div>
      </div>

      {/* Panel tipo semáforo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemStatuses.map((system) => {
          const Icon = system.icon;
          return (
            <div
              key={system.id}
              className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusBgColor(system.status)}`}
            >
              {/* Header con semáforo */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">{system.name}</h4>
                </div>
                
                {/* Indicador tipo semáforo */}
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(system.status)} animate-pulse`}></div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    system.status === 'optimal' ? 'bg-green-100 text-green-800' :
                    system.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(system.status)}
                  </span>
                </div>
              </div>

              {/* Valor principal */}
              <div className="mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(system.status)}
                  <span className="text-2xl font-bold text-gray-900">{system.value}</span>
                </div>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-3">{system.description}</p>

              {/* Última verificación */}
              <div className="text-xs text-gray-500 border-t pt-2">
                Última verificación: {system.lastCheck.toLocaleString('es-ES')}
              </div>

              {/* Barra de progreso visual */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      system.status === 'optimal' ? 'bg-green-500' :
                      system.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: system.value }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Estado general del sistema:</span>
            {statusCounts.critical > 0 ? (
              <span className="ml-2 text-red-600 font-medium">Requiere atención inmediata</span>
            ) : statusCounts.warning > 0 ? (
              <span className="ml-2 text-yellow-600 font-medium">Monitoreo requerido</span>
            ) : (
              <span className="ml-2 text-green-600 font-medium">Operación normal</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Ver Detalles Técnicos
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Programar Mantenimiento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficLightPanel;
