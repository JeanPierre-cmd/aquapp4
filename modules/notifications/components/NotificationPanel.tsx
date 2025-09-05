import React from 'react';
import { X, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../hooks/useNotificationStore';
import NotificationItem from './NotificationItem';

const NotificationPanel: React.FC = () => {
  const { notifications, isLoading, error, closePanel, markAllAsRead } = useNotificationStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={closePanel}>
      <div 
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
              title="Marcar todas como leídas"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Marcar todas</span>
            </button>
            <button 
              onClick={closePanel} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              title="Cerrar panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && <p className="p-4 text-center text-gray-500">Cargando...</p>}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
          {!isLoading && !error && notifications.length === 0 && (
            <p className="p-4 text-center text-gray-500">No tienes notificaciones.</p>
          )}
          {!isLoading && !error && notifications.length > 0 && (
            <div>
              {notifications.map(notif => (
                <NotificationItem key={notif.id} notification={notif} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
