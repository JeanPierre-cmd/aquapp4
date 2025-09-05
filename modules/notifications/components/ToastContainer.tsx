import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '../hooks/useNotificationStore';
import { Notification, NotificationSeverity } from '../types';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

const severityConfig: Record<NotificationSeverity, { icon: React.ElementType, color: string, barColor: string }> = {
  info: { icon: Info, color: 'text-blue-700', barColor: 'bg-blue-500' },
  success: { icon: CheckCircle, color: 'text-green-700', barColor: 'bg-green-500' },
  warning: { icon: AlertCircle, color: 'text-yellow-700', barColor: 'bg-yellow-500' },
  error: { icon: XCircle, color: 'text-red-700', barColor: 'bg-red-500' },
};

const Toast: React.FC<{ notification: Notification, onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { icon: Icon, color, barColor } = severityConfig[notification.severity];

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(notification.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div 
      className={`relative flex items-start w-full max-w-sm p-4 my-2 overflow-hidden bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor}`}></div>
      <div className="flex-shrink-0 ml-3">
        <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
      </div>
      <div className="ml-3 w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          className="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(notification.id), 300);
          }}
        >
          <span className="sr-only">Close</span>
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Notification[]>([]);
  const { addNotification } = useNotificationStore();

  // Simulación de notificaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      addNotification({
        title: 'Nueva Medición',
        message: `La temperatura en Jaula B-2 es de 14.5°C.`,
        severity: 'info',
      });
    }, 15000); // Cada 15 segundos

    return () => clearInterval(interval);
  }, [addNotification]);

  // Escuchar nuevas notificaciones del store
  useEffect(() => {
    return useNotificationStore.subscribe(
      (state, prevState) => {
        if (state.notifications.length > prevState.notifications.length) {
          const newNotification = state.notifications[0];
          setToasts(currentToasts => [newNotification, ...currentToasts]);
        }
      },
      state => state.notifications
    );
  }, []);

  const handleDismiss = (id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  return (
    <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map(toast => (
          <Toast key={toast.id} notification={toast} onDismiss={handleDismiss} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
