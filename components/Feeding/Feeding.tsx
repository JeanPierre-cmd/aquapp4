import React, { useState } from 'react';
import FeedingSchedule from './FeedingSchedule';
import FeedingControl from './FeedingControl';
import FeedingReports from './FeedingReports';
import FeedingInventory from './FeedingInventory';
import AutomaticFeeding from './AutomaticFeeding';
import { 
  Package, 
  Clock, 
  BarChart3, 
  Settings, 
  Zap,
  Download,
  Plus,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export interface FeedingRecord {
  id: string;
  cageId: string;
  feedType: string;
  plannedAmount: number;
  actualAmount?: number;
  scheduledTime: Date;
  actualTime?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed' | 'cancelled';
  operator: string;
  observations?: string;
  waterConditions?: {
    temperature: number;
    oxygen: number;
    weather: string;
  };
  fishBehavior?: 'active' | 'normal' | 'lethargic' | 'not-observed';
  efficiency?: number; // % de alimento consumido
}

export interface FeedType {
  id: string;
  name: string;
  brand: string;
  pelletSize: string;
  protein: number;
  fat: number;
  fiber: number;
  moisture: number;
  costPerKg: number;
  stock: number;
  minStock: number;
  expiryDate: Date;
  supplier: string;
}

const Feeding: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'control' | 'automatic' | 'inventory' | 'reports'>('schedule');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleEmergencyStop = () => {
    if (confirm('¿Confirma la detención de emergencia de todos los sistemas de alimentación?')) {
      alert('🚨 PARADA DE EMERGENCIA ACTIVADA\n\n✅ Todos los sistemas de alimentación detenidos\n📞 Notificación enviada al equipo técnico\n⏰ Registro de evento guardado');
    }
  };

  const handleQuickFeed = () => {
    const cageId = prompt('ID de la jaula:') || 'A-1';
    const amount = prompt('Cantidad en kg:') || '25';
    
    if (cageId && amount) {
      alert(`🐟 ALIMENTACIÓN MANUAL INICIADA\n\nJaula: ${cageId}\nCantidad: ${amount} kg\nHora: ${new Date().toLocaleTimeString('es-ES')}\n\n✅ Sistema activado\n📊 Registro automático en curso`);
    }
  };

  const handleExportData = () => {
    alert('📊 Exportando datos de alimentación...\n\n📄 Generando reporte PDF\n📈 Incluyendo gráficos de consumo\n📋 Datos de eficiencia por jaula\n\n⏱️ Completado en 30 segundos');
  };

  const tabs = [
    { id: 'schedule', name: 'Programación', icon: Clock, description: 'Horarios y planificación' },
    { id: 'control', name: 'Control Manual', icon: Settings, description: 'Operación directa' },
    { id: 'automatic', name: 'Sistema Automático', icon: Zap, description: 'IA y sensores' },
    { id: 'inventory', name: 'Inventario', icon: Package, description: 'Stock y suministros' },
    { id: 'reports', name: 'Reportes', icon: BarChart3, description: 'Análisis y métricas' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Alimentación</h1>
          <p className="text-gray-600">Gestión integral de alimentación automatizada y manual</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleQuickFeed}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Alimentación Rápida</span>
          </button>
          
          <button
            onClick={handleRefreshData}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
          
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
          
          <button
            onClick={handleEmergencyStop}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Parada Emergencia</span>
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alimentaciones Hoy</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-green-600">+2 vs ayer</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alimento Consumido</p>
              <p className="text-2xl font-bold text-gray-900">1,250 kg</p>
              <p className="text-sm text-blue-600">Eficiencia 94%</p>
            </div>
            <Package className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sistemas Activos</p>
              <p className="text-2xl font-bold text-gray-900">8/8</p>
              <p className="text-sm text-green-600">Todos operativos</p>
            </div>
            <Zap className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">FCR Promedio</p>
              <p className="text-2xl font-bold text-gray-900">1.18</p>
              <p className="text-sm text-green-600">Óptimo</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <div className="text-left">
                    <div>{tab.name}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'schedule' && <FeedingSchedule />}
          {activeTab === 'control' && <FeedingControl />}
          {activeTab === 'automatic' && <AutomaticFeeding />}
          {activeTab === 'inventory' && <FeedingInventory />}
          {activeTab === 'reports' && <FeedingReports />}
        </div>
      </div>
    </div>
  );
};

export default Feeding;
