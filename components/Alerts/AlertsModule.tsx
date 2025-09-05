import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Filter, Download, Bell } from 'lucide-react';
import { Alert, EnvironmentalParameter } from '../../types';
import { evaluateEnvironmentalParameter, environmentalRanges } from '../../utils/environmentalRanges';
import { PDFReportGenerator } from '../../utils/pdfGenerator';

const AlertsModule: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [filterType, setFilterType] = useState<'all' | 'environmental' | 'operational' | 'maintenance'>('all');

  // Datos simulados de parámetros ambientales
  const environmentalData = [
    { type: 'waveHeight' as const, value: 7.2, location: 'Jaula A-1' },
    { type: 'windSpeed' as const, value: 45, location: 'Centro Norte' },
    { type: 'currentSpeed' as const, value: 1.8, location: 'Jaula B-2' },
    { type: 'seaTemperature' as const, value: 17.5, location: 'Jaula C-1' },
    { type: 'chlorophyll' as const, value: 42, location: 'Zona Este' },
    { type: 'depth' as const, value: 850, location: 'Jaula A-3' }
  ];

  // Alertas operacionales existentes
  const operationalAlerts: Alert[] = [
    {
      id: '1',
      type: 'equipment',
      message: 'Sensor de oxígeno desconectado en Jaula A-1',
      severity: 'high',
      timestamp: new Date('2024-01-15T10:30:00'),
      resolved: false,
      cageId: 'A-1'
    },
    {
      id: '2',
      type: 'feeding',
      message: 'Alimentación retrasada en Jaula B-1',
      severity: 'medium',
      timestamp: new Date('2024-01-15T09:15:00'),
      resolved: false,
      cageId: 'B-1'
    }
  ];

  // Generar alertas ambientales
  const environmentalAlerts = environmentalData.map((param, index) => {
    const evaluation = evaluateEnvironmentalParameter(param.type, param.value);
    const parameterInfo = environmentalRanges[param.type];
    
    return {
      id: `env-${index}`,
      type: 'environmental' as const,
      parameter: param.type,
      parameterName: parameterInfo.name,
      value: param.value,
      unit: parameterInfo.unit,
      location: param.location,
      impact: evaluation.impact,
      alertLevel: evaluation.alertLevel,
      riskLevel: evaluation.riskLevel,
      condition: evaluation.condition,
      timestamp: new Date(),
      resolved: false
    };
  });

  // Combinar todas las alertas
  const allAlerts = [
    ...environmentalAlerts.map(alert => ({
      id: alert.id,
      type: 'environmental' as const,
      message: `${alert.parameterName}: ${alert.value} ${alert.unit} en ${alert.location}`,
      severity: alert.alertLevel === 'red' ? 'critical' as const : 
                alert.alertLevel === 'yellow' ? 'medium' as const : 'low' as const,
      timestamp: alert.timestamp,
      resolved: alert.resolved,
      environmentalData: alert
    })),
    ...operationalAlerts
  ];

  // Filtrar alertas
  const filteredAlerts = allAlerts.filter(alert => {
    const levelMatch = filterLevel === 'all' || 
      (alert.environmentalData && alert.environmentalData.alertLevel === filterLevel) ||
      (!alert.environmentalData && (
        (filterLevel === 'red' && alert.severity === 'critical') ||
        (filterLevel === 'yellow' && alert.severity === 'high') || // High severity maps to yellow/orange
        (filterLevel === 'yellow' && alert.severity === 'medium') ||
        (filterLevel === 'green' && alert.severity === 'low')
      ));
    
    const typeMatch = filterType === 'all' || alert.type === filterType;
    
    return levelMatch && typeMatch;
  });

  const getAlertIcon = (alertItem: any) => {
    if (alertItem.environmentalData) {
      switch (alertItem.environmentalData.alertLevel) {
        case 'green':
          return <CheckCircle className="h-6 w-6 text-success" />;
        case 'yellow':
          return <AlertTriangle className="h-6 w-6 text-warning" />;
        case 'red':
          return <XCircle className="h-6 w-6 text-error" />;
        default:
          return <AlertTriangle className="h-6 w-6 text-textSecondary" />;
      }
    } else {
      switch (alertItem.severity) {
        case 'critical':
          return <XCircle className="h-6 w-6 text-error" />;
        case 'high':
          return <AlertTriangle className="h-6 w-6 text-warning" />; // Orange for high
        case 'medium':
          return <AlertTriangle className="h-6 w-6 text-warning" />;
        case 'low':
          return <CheckCircle className="h-6 w-6 text-primary" />; // Blue for low/info
        default:
          return <AlertTriangle className="h-6 w-6 text-textSecondary" />;
      }
    }
  };

  const getAlertColorClasses = (alertItem: any) => {
    if (alertItem.environmentalData) {
      switch (alertItem.environmentalData.alertLevel) {
        case 'green':
          return 'border-l-success bg-success/10';
        case 'yellow':
          return 'border-l-warning bg-warning/10';
        case 'red':
          return 'border-l-error bg-error/10';
        default:
          return 'border-l-textSecondary bg-surface';
      }
    } else {
      switch (alertItem.severity) {
        case 'critical':
          return 'border-l-error bg-error/10';
        case 'high':
          return 'border-l-warning bg-warning/10'; // Orange for high
        case 'medium':
          return 'border-l-warning bg-warning/10';
        case 'low':
          return 'border-l-primary bg-primary/10'; // Blue for low/info
        default:
          return 'border-l-textSecondary bg-surface';
      }
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
        return '';
    }
  };

  // Contar alertas por nivel
  const alertCounts = allAlerts.reduce((acc, alert) => {
    if (alert.environmentalData) {
      acc[alert.environmentalData.alertLevel] = (acc[alert.environmentalData.alertLevel] || 0) + 1;
    } else {
      const level = alert.severity === 'critical' ? 'red' : 
                   (alert.severity === 'medium' || alert.severity === 'high') ? 'yellow' : 'green'; // Map low to green for counts
      acc[level] = (acc[level] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleExportReport = () => {
    const generator = new PDFReportGenerator();
    generator.generateAlertsReport(filteredAlerts);
  };

  return (
    <div className="space-y-8 p-6 bg-background min-h-screen text-text">
      <div className="animate-scale-in">
        <h1 className="text-4xl font-extrabold text-text mb-2 tracking-tight">Sistema de Alertas</h1>
        <p className="text-lg text-textSecondary">Monitoreo integral de condiciones ambientales y operacionales para una acuicultura sostenible.</p>
      </div>

      {/* Resumen de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-scale-in delay-100">
        <div className="bg-surface rounded-xl shadow-lg border border-border p-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <div>
            <p className="text-sm font-medium text-textSecondary mb-1">Total Alertas</p>
            <p className="text-3xl font-bold text-text">{allAlerts.length}</p>
          </div>
          <Bell className="h-10 w-10 text-primary/50" />
        </div>
        
        <div className="bg-surface rounded-xl shadow-lg border border-border p-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <div>
            <p className="text-sm font-medium text-textSecondary mb-1">Condiciones Óptimas</p>
            <p className="text-3xl font-bold text-success">{alertCounts.green || 0}</p>
          </div>
          <CheckCircle className="h-10 w-10 text-success/50" />
        </div>
        
        <div className="bg-surface rounded-xl shadow-lg border border-border p-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <div>
            <p className="text-sm font-medium text-textSecondary mb-1">Precaución</p>
            <p className="text-3xl font-bold text-warning">{alertCounts.yellow || 0}</p>
          </div>
          <AlertTriangle className="h-10 w-10 text-warning/50" />
        </div>
        
        <div className="bg-surface rounded-xl shadow-lg border border-border p-6 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <div>
            <p className="text-sm font-medium text-textSecondary mb-1">Riesgo Alto</p>
            <p className="text-3xl font-bold text-error">{alertCounts.red || 0}</p>
          </div>
          <XCircle className="h-10 w-10 text-error/50" />
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface rounded-xl shadow-lg border border-border p-6 animate-scale-in delay-200">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-textSecondary" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="bg-background border border-border rounded-lg px-4 py-2 text-sm text-text focus:ring-primary focus:border-primary transition-all duration-200"
              >
                <option value="all">Todos los niveles</option>
                <option value="green">Condiciones óptimas</option>
                <option value="yellow">Precaución</option>
                <option value="red">Riesgo alto</option>
              </select>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-background border border-border rounded-lg px-4 py-2 text-sm text-text focus:ring-primary focus:border-primary transition-all duration-200"
            >
              <option value="all">Todos los tipos</option>
              <option value="environmental">Ambientales</option>
              <option value="equipment">Equipos</option>
              <option value="feeding">Alimentación</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>
          
          <button 
            onClick={handleExportReport}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Download className="h-5 w-5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="bg-surface rounded-xl shadow-lg border border-border animate-scale-in delay-300">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-xl font-semibold text-text">
            Alertas Activas ({filteredAlerts.length})
          </h3>
        </div>
        
        <div className="divide-y divide-border">
          {filteredAlerts.map((alertItem) => (
            <div key={alertItem.id} className={`p-6 border-l-4 ${getAlertColorClasses(alertItem)} transition-all duration-300 hover:bg-surface/70`}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-start space-x-4 flex-grow">
                  {getAlertIcon(alertItem)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-text mb-1">{alertItem.message}</h4>
                    
                    {alertItem.environmentalData && (
                      <div className="mt-2 space-y-1 text-textSecondary">
                        <p className="text-sm">
                          Rango: <span className="font-medium text-text">{alertItem.environmentalData.condition}</span> | 
                          Riesgo: <span className="font-medium text-text">{alertItem.environmentalData.riskLevel}</span>
                        </p>
                        <p className="text-sm font-medium text-text">
                          {getImpactText(alertItem.environmentalData.impact)}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center mt-2 space-x-4 text-sm text-textSecondary">
                      <span>{alertItem.timestamp.toLocaleString('es-ES')}</span>
                      {alertItem.cageId && <span>Jaula: <span className="font-medium text-text">{alertItem.cageId}</span></span>}
                      {alertItem.environmentalData?.location && <span>Ubicación: <span className="font-medium text-text">{alertItem.environmentalData.location}</span></span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      window.alert(`Mostrando detalles completos de: ${alertItem.message}\n\nTipo: ${alertItem.type}\nSeveridad: ${alertItem.severity}\nFecha: ${alertItem.timestamp.toLocaleString('es-ES')}`);
                    }}
                    className="text-sm bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-all duration-200 shadow-sm">
                    Ver Detalles
                  </button>
                  {!alertItem.resolved && (
                    <button 
                      onClick={() => {
                        if (window.confirm(`¿Confirma que desea resolver esta alerta?\n\n${alertItem.message}`)) {
                          window.alert('Alerta marcada como resuelta. Se ha notificado al equipo correspondiente.');
                        }
                      }}
                      className="text-sm border border-border text-text px-4 py-2 rounded-lg hover:bg-border/50 transition-all duration-200 shadow-sm">
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredAlerts.length === 0 && (
            <div className="p-8 text-center text-textSecondary">
              <AlertTriangle className="h-16 w-16 text-border mx-auto mb-6" />
              <p className="text-lg font-medium">No hay alertas que coincidan con los filtros seleccionados.</p>
              <p className="text-sm mt-2">Ajusta tus filtros o verifica el estado de tus sistemas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsModule;
