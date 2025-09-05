import React from 'react';
import { CageData } from './CageManagement';
import { 
  Fish, MapPin, Calendar, Waves, Thermometer, Activity, 
  Ruler, Scale, Droplets, HeartPulse, Wrench, Camera, Wifi, Edit, Trash2
} from 'lucide-react';

interface CageDetailsProps {
  cage: CageData;
  onEdit: (cage: CageData) => void;
  onDelete: (cageId: string) => void; // Add onDelete prop
}

const CageDetails: React.FC<CageDetailsProps> = ({ cage, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'maintenance':
        return 'bg-yellow-500 text-white';
      case 'inactive':
        return 'bg-gray-500 text-white';
      case 'preparation':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'maintenance':
        return 'Mantenimiento';
      case 'inactive':
        return 'Inactiva';
      case 'preparation':
        return 'Preparación';
      default:
        return 'Desconocido';
    }
  };

  const getNetConditionLabel = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'fair': return 'Regular';
      case 'poor': return 'Mala';
      default: return 'Desconocida';
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-text">{cage.name}</h2>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(cage.status)}`}>
          {getStatusLabel(cage.status)}
        </span>
      </div>

      {/* General Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-textSecondary flex items-center">
          <Fish className="h-5 w-5 mr-2 text-primary" /> Información General
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-textSecondary">
          <p><strong>ID:</strong> {cage.id}</p>
          <p><strong>Especie:</strong> {cage.species}</p>
          <p><strong>Población Actual:</strong> {cage.currentPopulation.toLocaleString()} peces</p>
          <p><strong>Capacidad Máxima:</strong> {cage.capacity.toLocaleString()} peces</p>
          <p><strong>Instalación:</strong> {cage.installDate.toLocaleDateString('es-ES')}</p>
          <p><strong>Última Inspección:</strong> {cage.lastInspection.toLocaleDateString('es-ES')}</p>
        </div>
      </div>

      {/* Location & Dimensions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-textSecondary flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" /> Ubicación y Dimensiones
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-textSecondary">
          <p><strong>Coordenadas:</strong> {cage.coordinates.lat.toFixed(4)}°S, {Math.abs(cage.coordinates.lng).toFixed(4)}°W</p>
          <p><strong>Profundidad Agua:</strong> {cage.waterDepth} m</p>
          <p><strong>Tamaño Jaula:</strong> {cage.cageSize.length}x{cage.cageSize.width}x{cage.cageSize.height} m</p>
          <p><strong>Condición Red:</strong> {getNetConditionLabel(cage.netCondition)}</p>
          <p className="col-span-2"><strong>Sistema Fondeo:</strong> {cage.anchoringSystem}</p>
        </div>
      </div>

      {/* Water Quality */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-textSecondary flex items-center">
          <Waves className="h-5 w-5 mr-2 text-primary" /> Calidad del Agua
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-textSecondary">
          <p><strong>Temperatura:</strong> {cage.waterQuality.temperature}°C</p>
          <p><strong>Oxígeno:</strong> {cage.waterQuality.oxygen} mg/L</p>
          <p><strong>pH:</strong> {cage.waterQuality.ph}</p>
          <p><strong>Salinidad:</strong> {cage.waterQuality.salinity} PSU</p>
        </div>
      </div>

      {/* Production Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-textSecondary flex items-center">
          <Scale className="h-5 w-5 mr-2 text-primary" /> Métricas de Producción
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-textSecondary">
          <p><strong>Peso Promedio:</strong> {cage.production.averageWeight} kg</p>
          <p><strong>Tasa Crecimiento:</strong> {cage.production.growthRate}%/día</p>
          <p><strong>Conversión Alimento:</strong> {cage.production.feedConversion}</p>
          <p><strong>Mortalidad:</strong> {cage.production.mortality}%</p>
        </div>
      </div>

      {/* Equipment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-textSecondary flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-primary" /> Equipamiento
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-textSecondary">
          <p><strong>Sistemas Alimentación:</strong> {cage.equipment.feedingSystems}</p>
          <p><strong>Sensores:</strong> {cage.equipment.sensors}</p>
          <p><strong>Cámaras:</strong> {cage.equipment.cameras}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t border-border flex justify-end space-x-3">
        <button 
          onClick={() => onEdit(cage)}
          className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors text-sm font-medium flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Editar Jaula</span>
        </button>
        <button 
          onClick={() => onDelete(cage.id)} // Call onDelete prop
          className="bg-error text-white px-4 py-2 rounded-lg hover:bg-error/90 transition-colors text-sm font-medium flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Eliminar Jaula</span>
        </button>
      </div>
    </div>
  );
};

export default CageDetails;
