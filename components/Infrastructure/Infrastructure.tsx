import React, { useState } from 'react';
import { NotificationBell } from '../../modules/notifications/components/Bell';
import CageManagement from '../CageManagement/CageManagement';
import ModelDataManager from './ModelDataManager';
import Visualization3D from '../Visualization3D/Visualization3D';
import Maintenance from '../Maintenance/Maintenance';
import NetsModule from '@/features/nets/components/NetsModule'; // Import the new Nets module
import { useNotifications } from '../../modules/notifications/useNotifications';
import { 
  Building2, 
  MapPin, 
  FileText,
  Eye,
  Settings,
  Zap,
  Network // Import the Network icon
} from 'lucide-react';

const Infrastructure: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cages' | 'redes' | 'model' | 'visualization' | 'maintenance'>('cages');
  const { add } = useNotifications();

  const tabs = [
    { 
      id: 'cages', 
      name: 'Balsas Jaulas', 
      icon: MapPin,
      description: 'Gestión de infraestructura y concesión'
    },
    { 
      id: 'redes', 
      name: 'Redes', 
      icon: Network,
      description: 'Trazabilidad y ciclo de vida'
    },
    { 
      id: 'model', 
      name: 'Modelo', 
      icon: FileText,
      description: 'Datos XML y componentes'
    },
    { 
      id: 'visualization', 
      name: 'Visor 3D/2D', 
      icon: Eye,
      description: 'Planos de fondeo y modelos digitales'
    },
    { 
      id: 'maintenance', 
      name: 'Mantenimiento', 
      icon: Settings,
      description: 'Programación y seguimiento'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-xl p-6 text-white relative">
        <div className="absolute top-6 right-6">
          <NotificationBell theme="dark" />
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Infraestructura</h1>
        </div>
        <p className="text-blue-100 text-lg">Gestión integral de infraestructura acuícola, modelos digitales y análisis normativo</p>
      </div>

      {/* Notification Test Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">Panel de Pruebas de Notificaciones</h3>
              <p className="text-sm text-gray-500">Usa este botón para generar una notificación de prueba y verificar el flujo.</p>
            </div>
          </div>
          <button 
            onClick={() => add({ 
              title: 'Tarea completada', 
              message: 'La revisión de la balsa-jaula #3 ha finalizado.',
              kind: 'success', 
              data: { route: '/infra/maintenance' } 
            })}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Probar notificación
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.name}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'cages' && <CageManagement />}
          {activeTab === 'redes' && <NetsModule />}
          {activeTab === 'model' && <ModelDataManager />}
          {activeTab === 'visualization' && <Visualization3D />}
          {activeTab === 'maintenance' && <Maintenance />}
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
