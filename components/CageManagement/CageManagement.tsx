import React, { useState, useCallback } from 'react';
import CageMap from './CageMap';
import CageDetails from './CageDetails';
import CageList from './CageList';
import CageMetrics from './CageMetrics';
import CageForm from './CageForm'; // Import the new CageForm component
import ConcessionForm from '../ConcessionManagement/ConcessionForm'; // Import the new ConcessionForm component
import { MapPin, Fish, Waves, Thermometer, Activity, Download, Plus, Settings, Building2, BarChart3, Info } from 'lucide-react'; // Added Info icon for ConcessionForm
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure this is imported for autotable functionality

export interface CageData {
  id: string;
  name: string;
  position: { x: number; y: number };
  status: 'active' | 'maintenance' | 'inactive' | 'preparation';
  capacity: number;
  currentPopulation: number;
  species: string;
  installDate: Date;
  lastInspection: Date;
  nextMaintenance: Date;
  waterDepth: number;
  cageSize: { length: number; width: number; height: number };
  netCondition: 'excellent' | 'good' | 'fair' | 'poor';
  anchoringSystem: string;
  coordinates: { lat: number; lng: number }; // This will be updated later to link to concession_id
  waterQuality: {
    temperature: number;
    oxygen: number;
    ph: number;
    salinity: number;
  };
  production: {
    averageWeight: number;
    growthRate: number;
    feedConversion: number;
    mortality: number;
  };
  equipment: {
    feedingSystems: number;
    sensors: number;
    cameras: number;
  };
}

export interface ConcessionData {
  id: string; // Added to match Supabase schema
  user_id: string; // Added to match Supabase schema
  name: string;
  rut: string;
  location: string;
  latitude: number; // Changed from coordinates object
  longitude: number; // Changed from coordinates object
  waterBody: string;
  totalArea: string;
  maxDepth: string;
  established: string;
  license: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  operationalStatus: string;
  certifications: string[];
  environmentalPermits: string[];
}

const initialCagesData: CageData[] = [
  {
    id: 'MX-A1',
    name: 'Balsa A1',
    position: { x: 200, y: 150 },
    status: 'active',
    capacity: 180000,
    currentPopulation: 165000,
    species: 'Salmón Atlántico (Salmo salar)',
    installDate: new Date('2023-03-15'),
    lastInspection: new Date('2024-01-10'),
    nextMaintenance: new Date('2024-02-15'),
    waterDepth: 42,
    cageSize: { length: 25, width: 25, height: 15 },
    netCondition: 'excellent',
    anchoringSystem: 'Sistema de 8 puntos con anclas Danforth',
    coordinates: { lat: -42.7845, lng: -73.2435 },
    waterQuality: { temperature: 14.2, oxygen: 8.5, ph: 7.8, salinity: 32.8 },
    production: { averageWeight: 3.2, growthRate: 2.1, feedConversion: 1.15, mortality: 0.8 },
    equipment: { feedingSystems: 2, sensors: 8, cameras: 4 }
  },
  {
    id: 'MX-A2',
    name: 'Balsa A2',
    position: { x: 300, y: 150 },
    status: 'active',
    capacity: 180000,
    currentPopulation: 172000,
    species: 'Salmón Atlántico (Salmo salar)',
    installDate: new Date('2023-03-20'),
    lastInspection: new Date('2024-01-12'),
    nextMaintenance: new Date('2024-02-20'),
    waterDepth: 38,
    cageSize: { length: 25, width: 25, height: 15 },
    netCondition: 'good',
    anchoringSystem: 'Sistema de 8 puntos con anclas Danforth',
    coordinates: { lat: -42.7850, lng: -73.2420 },
    waterQuality: { temperature: 14.0, oxygen: 8.3, ph: 7.9, salinity: 32.9 },
    production: { averageWeight: 3.4, growthRate: 2.3, feedConversion: 1.12, mortality: 0.6 },
    equipment: { feedingSystems: 2, sensors: 8, cameras: 4 }
  },
  {
    id: 'MX-B1',
    name: 'Balsa B1',
    position: { x: 200, y: 250 },
    status: 'maintenance',
    capacity: 180000,
    currentPopulation: 0,
    species: 'Salmón Atlántico (Salmo salar)',
    installDate: new Date('2023-04-10'),
    lastInspection: new Date('2024-01-08'),
    nextMaintenance: new Date('2024-01-25'),
    waterDepth: 40,
    cageSize: { length: 25, width: 25, height: 15 },
    netCondition: 'fair',
    anchoringSystem: 'Sistema de 8 puntos con anclas Danforth',
    coordinates: { lat: -42.7865, lng: -73.2440 },
    waterQuality: { temperature: 13.8, oxygen: 8.7, ph: 7.7, salinity: 33.1 },
    production: { averageWeight: 0, growthRate: 0, feedConversion: 0, mortality: 0 },
    equipment: { feedingSystems: 2, sensors: 6, cameras: 2 }
  },
  {
    id: 'MX-B2',
    name: 'Balsa B2',
    position: { x: 300, y: 250 },
    status: 'active',
    capacity: 180000,
    currentPopulation: 158000,
    species: 'Salmón Coho (Oncorhynchus kisutch)',
    installDate: new Date('2023-04-15'),
    lastInspection: new Date('2024-01-14'),
    nextMaintenance: new Date('2024-03-01'),
    waterDepth: 43,
    cageSize: { length: 25, width: 25, height: 15 },
    netCondition: 'good',
    anchoringSystem: 'Sistema de 8 puntos con anclas Danforth',
    coordinates: { lat: -42.7870, lng: -73.2425 },
    waterQuality: { temperature: 13.9, oxygen: 8.4, ph: 7.8, salinity: 33.0 },
    production: { averageWeight: 2.8, growthRate: 1.9, feedConversion: 1.18, mortality: 1.2 },
    equipment: { feedingSystems: 2, sensors: 8, cameras: 4 }
  },
  {
    id: 'MX-C1',
    name: 'Balsa C1',
    position: { x: 400, y: 200 },
    status: 'preparation',
    capacity: 180000,
    currentPopulation: 0,
    species: 'Salmón Atlántico (Salmo salar)',
    installDate: new Date('2024-01-05'),
    lastInspection: new Date('2024-01-15'),
    nextMaintenance: new Date('2024-02-05'),
    waterDepth: 41,
    cageSize: { length: 25, width: 25, height: 15 },
    netCondition: 'excellent',
    anchoringSystem: 'Sistema de 8 puntos con anclas Danforth',
    coordinates: { lat: -42.7855, lng: -73.2405 },
    waterQuality: { temperature: 14.1, oxygen: 8.6, ph: 7.9, salinity: 32.7 },
    production: { averageWeight: 0, growthRate: 0, feedConversion: 0, mortality: 0 },
    equipment: { feedingSystems: 2, sensors: 8, cameras: 4 }
  },
  {
    id: 'MX-D1',
    name: 'Balsa D1',
    position: { x: 150, y: 350 },
    status: 'inactive',
    capacity: 180000,
    currentPopulation: 0,
    species: 'N/A',
    installDate: new Date('2023-02-20'),
    lastInspection: new Date('2023-12-15'),
    nextMaintenance: new Date('2024-03-15'),
    waterDepth: 35,
    cageSize: { length: 25, width: 25, height: 15 },
    netCondition: 'poor',
    anchoringSystem: 'Sistema de 8 puntos con anclas Danforth',
    coordinates: { lat: -42.7880, lng: -73.2450 },
    waterQuality: { temperature: 13.5, oxygen: 8.8, ph: 7.6, salinity: 33.2 },
    production: { averageWeight: 0, growthRate: 0, feedConversion: 0, mortality: 0 },
    equipment: { feedingSystems: 1, sensors: 4, cameras: 1 }
  }
];

const initialConcessionData: ConcessionData = {
  id: 'placeholder-concession-id', // Placeholder, will be replaced by Supabase ID
  user_id: 'placeholder-user-id', // Placeholder, will be replaced by authenticated user ID
  name: "Concesión Acuícola MultiX S.A.",
  rut: "96.123.456-7",
  location: "Región de Los Lagos, Chile",
  latitude: -42.7858, // Updated from coordinates object
  longitude: -73.2442, // Updated from coordinates object
  waterBody: "Seno de Reloncaví",
  totalArea: "150 hectáreas",
  maxDepth: "45 metros",
  established: "2018",
  license: "AQ-2018-MultiX-001",
  manager: "Carlos Mendoza",
  phone: "+56 9 8765 4321",
  email: "carlos.mendoza@multix.cl",
  address: "Camino Costero Km 15, Puerto Montt",
  operationalStatus: "Activa",
  certifications: ["ASC", "BAP", "GlobalGAP"],
  environmentalPermits: ["RCA-2018-001", "PAS-2018-002"]
};

const CageManagement: React.FC = () => {
  const [cagesData, setCagesData] = useState<CageData[]>(initialCagesData); // Make cagesData stateful
  const [concessionData, setConcessionData] = useState<ConcessionData>(initialConcessionData); // Make concessionData stateful
  const [selectedCage, setSelectedCage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'metrics'>('map');
  const [showCageForm, setShowCageForm] = useState<boolean>(false); // State for showing the cage form
  const [editingCage, setEditingCage] = useState<CageData | null>(null); // State for cage being edited
  const [showConcessionForm, setShowConcessionForm] = useState<boolean>(false); // State for showing the concession form

  const selectedCageData = cagesData.find(cage => cage.id === selectedCage);

  const handleAddNewCage = useCallback(() => {
    setEditingCage(null); // Clear any previous editing state
    setShowCageForm(true);
  }, []);

  const handleEditCage = useCallback((cage: CageData) => {
    setEditingCage(cage);
    setShowCageForm(true);
  }, []);

  const handleSaveCage = useCallback((newOrUpdatedCage: CageData) => {
    if (editingCage) {
      // Update existing cage
      setCagesData(cagesData.map(cage => 
        cage.id === newOrUpdatedCage.id ? newOrUpdatedCage : cage
      ));
      alert(`Balsa Jaula "${newOrUpdatedCage.name}" actualizada exitosamente.`);
    } else {
      // Add new cage
      setCagesData([...cagesData, newOrUpdatedCage]);
      alert(`Nueva Balsa Jaula "${newOrUpdatedCage.name}" añadida exitosamente.`);
    }
    setShowCageForm(false);
    setEditingCage(null);
  }, [cagesData, editingCage]); // Dependencies for handleSaveCage

  const handleDeleteCage = useCallback((cageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta balsa jaula? Esta acción no se puede deshacer.')) {
      setCagesData(cagesData.filter(cage => cage.id !== cageId));
      setSelectedCage(null); // Deselect the cage after deletion
      alert('Balsa Jaula eliminada exitosamente.');
    }
  }, [cagesData]);

  const handleCloseForm = useCallback(() => {
    setShowCageForm(false);
    setEditingCage(null);
  }, []);

  const handleExportData = useCallback(() => {
    const doc = new jsPDF();
    doc.text('REPORTE DE GESTIÓN DE BALSAS JAULAS', 20, 20);
    doc.text(`${concessionData.name}`, 20, 40);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 60);
    
    let yPos = 80;
    doc.text('INFORMACIÓN DE LA CONCESIÓN:', 20, yPos);
    yPos += 15;
    doc.text(`RUT: ${concessionData.rut}`, 30, yPos);
    yPos += 15;
    doc.text(`Ubicación: ${concessionData.location}`, 30, yPos);
    yPos += 15;
    doc.text(`Cuerpo de agua: ${concessionData.waterBody}`, 30, yPos);
    yPos += 15;
    doc.text(`Área total: ${concessionData.totalArea}`, 30, yPos);
    yPos += 15;
    doc.text(`Manager: ${concessionData.manager}`, 30, yPos);
    
    yPos += 30;
    doc.text('RESUMEN DE MÓDULOS:', 20, yPos);
    yPos += 15;
    doc.text(`Total de balsas: ${cagesData.length}`, 30, yPos);
    yPos += 15;
    doc.text(`Balsas activas: ${cagesData.filter(c => c.status === 'active').length}`, 30, yPos);
    yPos += 15;
    doc.text(`En mantenimiento: ${cagesData.filter(c => c.status === 'maintenance').length}`, 30, yPos);
    
    doc.save(`concesion-multix-${new Date().toISOString().split('T')[0]}.pdf`);
    alert('Reporte PDF de la concesión generado exitosamente');
  }, [cagesData, concessionData]); // Dependencies for handleExportData

  const handleManageConcession = useCallback(() => {
    setShowConcessionForm(true);
  }, []);

  const handleSaveConcession = useCallback((updatedConcession: ConcessionData) => {
    setConcessionData(updatedConcession);
    setShowConcessionForm(false);
    alert('Datos de la concesión actualizados exitosamente.');
  }, []);

  const handleCloseConcessionForm = useCallback(() => {
    setShowConcessionForm(false);
  }, []);

  // Calcular estadísticas de la concesión
  const totalModules = cagesData.length;
  const totalCages = cagesData.length; // En este caso, 1 módulo = 1 jaula
  const activeCages = cagesData.filter(c => c.status === 'active').length;
  const totalPopulation = cagesData.reduce((sum, cage) => sum + cage.currentPopulation, 0);
  const totalCapacity = cagesData.reduce((sum, cage) => sum + cage.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? (totalPopulation / totalCapacity) * 100 : 0;

  // Especies únicas
  const uniqueSpecies = [...new Set(cagesData.map(c => c.species).filter(s => s !== 'N/A'))];

  return (
    <div className="space-y-6">
      {/* Header con información de la concesión */}
      <div className="bg-gradient-to-r from-primary via-blue-800 to-blue-700 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{concessionData.name}</h1>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>RUT: {concessionData.rut}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>{concessionData.waterBody}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Estado: {concessionData.operationalStatus}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddNewCage}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Balsa</span>
            </button>
            <button
              onClick={handleExportData}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={handleManageConcession}
              className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2 font-medium"
            >
              <Settings className="h-4 w-4" />
              <span>Gestionar</span>
            </button>
          </div>
        </div>

        {/* Información detallada de la concesión */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-blue-100 mb-2">Información Legal</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Licencia:</strong> {concessionData.license}</p>
              <p><strong>Manager:</strong> {concessionData.manager}</p>
              <p><strong>Establecida:</strong> {concessionData.established}</p>
              <p><strong>Teléfono:</strong> {concessionData.phone}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-blue-100 mb-2">Ubicación y Área</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Región:</strong> {concessionData.location}</p>
              <p><strong>Área Total:</strong> {concessionData.totalArea}</p>
              <p><strong>Profundidad:</strong> {concessionData.maxDepth}</p>
              <p><strong>Coordenadas:</strong> {concessionData.latitude.toFixed(4)}°S, {Math.abs(concessionData.longitude).toFixed(4)}°W</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-blue-100 mb-2">Módulos y Jaulas</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Total Módulos:</strong> {totalModules}</p>
              <p><strong>Total Jaulas:</strong> {totalCages}</p>
              <p><strong>Jaulas Activas:</strong> {activeCages}</p>
              <p><strong>Tamaño Estándar:</strong> 25m × 25m × 15m</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-blue-100 mb-2">Especies y Producción</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Especies:</strong></p>
              {uniqueSpecies.map((species, index) => (
                <p key={index} className="ml-2">• {species}</p>
              ))}
              <p><strong>Ocupación:</strong> {occupancyRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Certificaciones y permisos */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-blue-100 text-sm">Certificaciones:</span>
            {concessionData.certifications.map((cert, index) => (
              <span key={index} className="bg-green-500/20 text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                {cert}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-100 text-sm">Permisos Ambientales:</span>
            {concessionData.environmentalPermits.map((permit, index) => (
              <span key={index} className="bg-blue-500/20 text-blue-100 px-2 py-1 rounded-full text-xs font-medium">
                {permit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Población Total</p>
              <p className="text-3xl font-bold text-primary">{totalPopulation.toLocaleString()}</p>
              <p className="text-sm text-textSecondary">peces en cultivo</p>
            </div>
            <Fish className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Capacidad Total</p>
              <p className="text-3xl font-bold text-success">{totalCapacity.toLocaleString()}</p>
              <p className="text-sm text-textSecondary">peces máximo</p>
            </div>
            <Building2 className="h-12 w-12 text-success" />
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Tasa de Ocupación</p>
              <p className="text-3xl font-bold text-accent">{occupancyRate.toFixed(1)}%</p>
              <p className="text-sm text-textSecondary">capacidad utilizada</p>
            </div>
            <BarChart3 className="h-12 w-12 text-accent" />
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textSecondary">Balsas Operativas</p>
              <p className="text-3xl font-bold text-warning">{activeCages}/{totalCages}</p>
              <p className="text-sm text-textSecondary">en producción</p>
            </div>
            <Activity className="h-12 w-12 text-warning" />
          </div>
        </div>
      </div>

      {/* Selector de vista */}
      <div className="bg-surface rounded-xl shadow-sm border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-background rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-textSecondary hover:text-text'
              }`}
            >
              <MapPin className="h-4 w-4 inline mr-2" />
              Vista de Mapa
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-textSecondary hover:text-text'
              }`}
            >
              <Fish className="h-4 w-4 inline mr-2" />
              Vista de Lista
            </button>
            <button
              onClick={() => setViewMode('metrics')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                viewMode === 'metrics'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-textSecondary hover:text-text'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Métricas
            </button>
          </div>
          
          <div className="text-sm text-textSecondary">
            <span className="font-medium">Última actualización:</span> {new Date().toLocaleString('es-ES')}
          </div>
        </div>
      </div>

      {/* Contenido según vista seleccionada */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CageMap 
              cages={cagesData}
              selectedCage={selectedCage}
              onCageSelect={setSelectedCage}
              concessionData={concessionData}
            />
          </div>
          <div>
            {selectedCageData ? (
              <CageDetails cage={selectedCageData} onEdit={handleEditCage} onDelete={handleDeleteCage} />
            ) : (
              <div className="bg-surface rounded-xl shadow-sm border border-border p-8 text-center">
                <Fish className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text mb-2">Selecciona una Balsa Jaula</h3>
                <p className="text-textSecondary">Haz clic en cualquier balsa del mapa para ver sus detalles completos</p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <CageList 
          cages={cagesData}
          selectedCage={selectedCage}
          onCageSelect={setSelectedCage}
        />
      )}

      {viewMode === 'metrics' && (
        <CageMetrics cages={cagesData} />
      )}

      {/* Cage Add/Edit Form */}
      {showCageForm && (
        <CageForm
          initialData={editingCage}
          onSave={handleSaveCage}
          onCancel={handleCloseForm}
        />
      )}

      {/* Concession Management Form */}
      {showConcessionForm && (
        <ConcessionForm
          initialData={concessionData}
          onSave={handleSaveConcession}
          onCancel={handleCloseConcessionForm}
        />
      )}
    </div>
  );
};

export default CageManagement;
