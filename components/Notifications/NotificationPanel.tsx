import React from 'react';
import { X, Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert } from '../../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, alerts }) => {
  if (!isOpen) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay notificaciones nuevas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(notification.severity)} ${
                    notification.resolved ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.resolved ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        getSeverityIcon(notification.severity)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        notification.resolved ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center mt-2 space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.cageId && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{notification.cageId}</span>
                          </>
                        )}
                      </div>
                      
                      {!notification.resolved && (
                        <div className="mt-3 flex space-x-2">
                          <button 
                            onClick={() => {
                              window.alert(`Resolviendo alerta: ${notification.message}`);
                            }}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                          >
                            Resolver
                          </button>
                          <button 
                            onClick={() => {
                              window.alert(`Mostrando detalles de: ${notification.message}`);
                            }}
                            className="text-xs border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                          >
                            Ver detalles
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
