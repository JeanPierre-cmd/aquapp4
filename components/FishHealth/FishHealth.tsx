import React, { useState } from 'react';
import HealthOverview from './HealthOverview';
import CageStatus from './CageStatus';
import FeedingSchedule from './FeedingSchedule';
import HealthReportGenerator from './HealthReportGenerator';
import { Cage } from '../../types';
import { RefreshCw, Plus, AlertTriangle, FileText, Fish } from 'lucide-react';

const FishHealth: React.FC = () => {
  const [selectedCage, setSelectedCage] = useState<string>('A-1');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');

  const mockCages: Cage[] = [
    {
      id: 'A-1',
      name: 'Jaula A-1',
      capacity: 5000,
      currentPopulation: 4850,
      location: { lat: -42.7, lng: -73.2 },
      waterParameters: [],
      lastInspection: new Date('2024-07-14'),
      status: 'active'
    },
    {
      id: 'A-2',
      name: 'Jaula A-2',
      capacity: 5000,
      currentPopulation: 4920,
      location: { lat: -42.7, lng: -73.2 },
      waterParameters: [],
      lastInspection: new Date('2024-07-13'),
      status: 'warning'
    },
    {
      id: 'B-1',
      name: 'Jaula B-1',
      capacity: 4500,
      currentPopulation: 4200,
      location: { lat: -42.7, lng: -73.2 },
      waterParameters: [],
      lastInspection: new Date('2024-07-15'),
      status: 'maintenance'
    }
  ];

  const handleRefreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleAddNewCage = () => {
    const cageName = prompt('Ingrese el nombre de la nueva jaula:');
    if (cageName) {
      alert(`Nueva jaula "${cageName}" agregada al sistema`);
    }
  };

  const handleEmergencyAlert = () => {
    if (confirm('¿Desea activar una alerta de emergencia para salud de peces?\n\nEsta acción simula la notificación inmediata al equipo veterinario y a SERNAPESCA, según lo exige el D.S. N° 319 (RESA).')) {
      alert('Alerta de emergencia activada. Se ha notificado al equipo veterinario y registrado para auditoría de SERNAPESCA.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Comando: Salud de Peces</h1>
          <p className="text-gray-500 mt-1">Monitoreo y gestión sanitaria según D.S. N° 319 y PSEVC.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshData}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
          <button
            onClick={handleAddNewCage}
            className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Jaula</span>
          </button>
          <button
            onClick={handleEmergencyAlert}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Emergencia</span>
          </button>
        </div>
      </header>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Fish className="h-5 w-5" />
            <span>Monitoreo General</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'reports'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Reportes (D.S. N° 319)</span>
          </button>
        </div>
      </div>

      <main>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <HealthOverview cages={mockCages} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CageStatus 
                  cages={mockCages}
                  selectedCage={selectedCage}
                  onCageSelect={setSelectedCage}
                />
              </div>
              <FeedingSchedule selectedCage={selectedCage} />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <HealthReportGenerator />
        )}
      </main>
    </div>
  );
};

export default FishHealth;
