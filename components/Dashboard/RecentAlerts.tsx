import React from 'react';
import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Undo2 } from 'lucide-react';
import { Alert } from '../../types';

const RecentAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'density',
      message: 'Alta densidad en Jaula C-5',
      severity: 'high',
      timestamp: new Date(new Date().getTime() - 15 * 60000), // 15 mins ago
      resolved: false,
      cageId: 'C-5'
    },
    {
      id: '2',
      type: 'equipment',
      message: 'Fallo en alimentador automático #7',
      severity: 'medium',
      timestamp: new Date(new Date().getTime() - 45 * 60000), // 45 mins ago
      resolved: false,
      cageId: 'B-2'
    },
    {
      id: '3',
      type: 'water-quality',
      message: 'Bajo nivel de oxígeno en Centro Norte',
      severity: 'high',
      timestamp: new Date(new Date().getTime() - 2 * 60 * 60000), // 2 hours ago
      resolved: true,
    },
    {
      id: '4',
      type: 'feeding',
      message: 'Dispensación de alimento incompleta',
      severity: 'low',
      timestamp: new Date(new Date().getTime() - 3 * 60 * 60000), // 3 hours ago
      resolved: false,
      cageId: 'A-1'
    }
  ]);
  const [lastResolved, setLastResolved] = useState<string | null>(null);

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: !alert.resolved } : alert
    ));
    setLastResolved(alertId);
    // Hide the undo button after a few seconds
    setTimeout(() => setLastResolved(null), 5000);
  };

  const handleUndoResolve = () => {
    if (lastResolved) {
      // This toggles the state back
      setAlerts(prev => prev.map(alert => 
        alert.id === lastResolved ? { ...alert, resolved: !alert.resolved } : alert
      ));
      setLastResolved(null);
    }
  };

  const handleViewAllAlerts = () => {
    alert('Navegando al módulo completo de alertas...');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertas Recientes</h3>
        <AlertTriangle className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${alert.resolved ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className={`p-1 rounded-full ${getSeverityColor(alert.severity)}`}>
              {alert.resolved ? (
                <CheckCircle className="h-4 w-4 text-green-700" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${alert.resolved ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {alert.message}
              </p>
              <div className="flex items-center mt-1 space-x-2">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {formatTime(alert.timestamp)}
                </span>
                {alert.cageId && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{alert.cageId}</span>
                  </>
                )}
              </div>
            </div>

            <button 
              onClick={() => handleResolveAlert(alert.id)}
              className={`text-xs font-medium px-2 py-1 rounded ${alert.resolved ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              {alert.resolved ? 'Reabrir' : 'Resolver'}
            </button>
          </div>
        ))}
      </div>
      
      {lastResolved && (
        <div className="mt-4 p-2 bg-gray-800 text-white rounded-lg flex items-center justify-between text-sm animate-fade-in">
          <span>Alerta actualizada.</span>
          <button onClick={handleUndoResolve} className="flex items-center space-x-1 font-semibold hover:underline">
            <Undo2 className="h-4 w-4" />
            <span>Deshacer</span>
          </button>
        </div>
      )}

      <button 
        onClick={handleViewAllAlerts}
        className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Ver todas las alertas →
      </button>
    </div>
  );
};

export default RecentAlerts;
