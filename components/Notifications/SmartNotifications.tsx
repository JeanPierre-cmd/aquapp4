import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Zap,
  X,
  CheckCircle,
  Clock,
  MapPin,
  Settings,
  Filter
} from 'lucide-react';

interface SmartNotification {
  id: string;
  type: 'operational' | 'preventive' | 'normative' | 'engagement';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  component?: string;
  center?: string;
  dueDate?: Date;
  overdueDays?: number;
  data?: any;
}

interface NotificationSettings {
  role: 'supervisor' | 'maintenance' | 'management';
  frequency: 'immediate' | 'daily' | 'weekly';
  categories: {
    operational: boolean;
    preventive: boolean;
    normative: boolean;
    engagement: boolean;
  };
}

const SmartNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    role: 'management',
    frequency: 'immediate',
    categories: {
      operational: true,
      preventive: true,
      normative: true,
      engagement: true
    }
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [showSettings, setShowSettings] = useState(false);

  // Generar notificaciones inteligentes
  useEffect(() => {
    const smartNotifications: SmartNotification[] = [
      // Operacionales
      {
        id: 'op-1',
        type: 'operational',
        priority: 'critical',
        title: 'Componente Crítico Detectado',
        message: 'Grillete Principal en Centro Norte tiene <30 días de vida útil estimada. Programar reemplazo inmediato.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        actionable: true,
        component: 'Grillete Principal',
        center: 'Centro Norte'
      },
      {
        id: 'op-2',
        type: 'operational',
        priority: 'high',
        title: 'Inspección Vencida RES EX 1821',
        message: 'Inspección veterinaria trimestral vencida hace 5 días en Centro Sur.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionable: true,
        center: 'Centro Sur',
        overdueDays: 5,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'op-3',
        type: 'operational',
        priority: 'medium',
        title: 'Tensión Fuera de Rango',
        message: 'Tensión acumulada en Línea Sur fuera del rango registrado. Revisar anclajes.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: false,
        actionable: true,
        component: 'Línea Sur',
        center: 'Centro Este'
      },
      
      // Preventivas/Predictivas
      {
        id: 'prev-1',
        type: 'preventive',
        priority: 'medium',
        title: 'Inspección Acelerada Recomendada',
        message: 'Basado en eventos extremos recientes (oleaje >6m), recomendamos inspección acelerada de la Línea Sur.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: false,
        actionable: true,
        component: 'Línea Sur',
        data: { waveHeight: 6.2, recommendation: 'accelerated_inspection' }
      },
      {
        id: 'prev-2',
        type: 'preventive',
        priority: 'low',
        title: 'Análisis Comparativo',
        message: 'Centro A presenta 2× tasa de recambio de grilletes vs promedio sectorial. Revisar protocolo.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        read: true,
        actionable: true,
        center: 'Centro A',
        data: { replacementRate: 2.1, sectorAverage: 1.05 }
      },
      
      // Normativas
      {
        id: 'norm-1',
        type: 'normative',
        priority: 'high',
        title: 'Reporte Mensual Listo',
        message: 'Reporte mensual RES EX 1821 listo para descarga y envío a SERNAPESCA.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        actionable: true,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'norm-2',
        type: 'normative',
        priority: 'medium',
        title: 'Checklist de Fiscalización',
        message: '5 campos faltantes antes del cierre de trimestre. Completar información.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        read: false,
        actionable: true,
        data: { missingFields: 5, deadline: '31 Marzo 2024' }
      },
      
      // Engagement
      {
        id: 'eng-1',
        type: 'engagement',
        priority: 'low',
        title: 'Nuevo Módulo Disponible',
        message: 'Módulo de visualización 3D mejorado disponible. Migra tus archivos STEP para mejor experiencia.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
        actionable: true,
        data: { module: '3d_visualization', version: '2.1' }
      },
      {
        id: 'eng-2',
        type: 'engagement',
        priority: 'low',
        title: 'Benchmark Nacional',
        message: 'Felicitaciones! Estás en el percentil 75 en cumplimiento de mantenimiento a nivel nacional.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        read: true,
        actionable: false,
        data: { percentile: 75, category: 'maintenance_compliance' }
      }
    ];

    setNotifications(smartNotifications);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'critical' && notification.priority !== 'critical') return false;
    return settings.categories[notification.type];
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleTakeAction = (notification: SmartNotification) => {
    switch (notification.type) {
      case 'operational':
        if (notification.component) {
          alert(`Abriendo gestión de componente: ${notification.component}`);
        } else if (notification.overdueDays) {
          alert(`Programando inspección para ${notification.center}`);
        }
        break;
      case 'preventive':
        alert(`Iniciando inspección preventiva recomendada`);
        break;
      case 'normative':
        if (notification.title.includes('Reporte')) {
          alert('Descargando reporte RES EX 1821...');
        } else {
          alert('Abriendo checklist de cumplimiento...');
        }
        break;
      case 'engagement':
        alert('Redirigiendo al nuevo módulo...');
        break;
    }
    handleMarkAsRead(notification.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'operational':
        return <AlertTriangle className="h-4 w-4" />;
      case 'preventive':
        return <Shield className="h-4 w-4" />;
      case 'normative':
        return <Calendar className="h-4 w-4" />;
      case 'engagement':
        return <Zap className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `hace ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return `hace ${Math.floor(diffInMinutes / 1440)} días`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notificaciones Inteligentes</h1>
          <p className="text-gray-600">Sistema proactivo de alertas y recomendaciones</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {criticalCount > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {criticalCount} críticas
              </span>
            )}
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {unreadCount} sin leer
            </span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={settings.role}
                onChange={(e) => setSettings(prev => ({ ...prev, role: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="supervisor">Supervisor</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="management">Gerencia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
              <select
                value={settings.frequency}
                onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="immediate">Inmediata</option>
                <option value="daily">Resumen Diario</option>
                <option value="weekly">Consolidado Semanal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
              <div className="space-y-2">
                {Object.entries(settings.categories).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        categories: { ...prev.categories, [key]: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Todas las notificaciones</option>
                <option value="unread">Sin leer</option>
                <option value="critical">Solo críticas</option>
              </select>
            </div>
            <span className="text-sm text-gray-600">
              Mostrando {filteredNotifications.length} de {notifications.length}
            </span>
          </div>
          
          <button
            onClick={handleMarkAllAsRead}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`border-l-4 rounded-lg p-4 transition-all ${getPriorityColor(notification.priority)} ${
              notification.read ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex items-center space-x-2 mt-1">
                  {getPriorityIcon(notification.priority)}
                  {getTypeIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatTimeAgo(notification.timestamp)}</span>
                    {notification.center && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{notification.center}</span>
                      </div>
                    )}
                    {notification.component && (
                      <span>Componente: {notification.component}</span>
                    )}
                    {notification.overdueDays && (
                      <span className="text-red-600 font-medium">
                        Vencida hace {notification.overdueDays} días
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {notification.actionable && (
                  <button
                    onClick={() => handleTakeAction(notification)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Acción
                  </button>
                )}
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay notificaciones que coincidan con los filtros</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {notifications.filter(n => n.priority === 'critical').length}
            </p>
            <p className="text-sm text-gray-600">Críticas</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {notifications.filter(n => n.priority === 'high').length}
            </p>
            <p className="text-sm text-gray-600">Alta Prioridad</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {notifications.filter(n => n.type === 'preventive').length}
            </p>
            <p className="text-sm text-gray-600">Preventivas</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => n.actionable && !n.read).length}
            </p>
            <p className="text-sm text-gray-600">Requieren Acción</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartNotifications
