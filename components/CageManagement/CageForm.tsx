import React, { useState, useEffect } from 'react';
import { CageData } from './CageManagement';
import { X, Save, PlusCircle, Edit, MapPin, Fish, Waves, Scale, Wrench, Info } from 'lucide-react'; // Import new icons

interface CageFormProps {
  initialData: CageData | null;
  onSave: (cage: CageData) => void;
  onCancel: () => void;
}

const CageForm: React.FC<CageFormProps> = ({ initialData, onSave, onCancel }) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<CageData>(
    initialData || {
      id: '',
      name: '',
      position: { x: 0, y: 0 }, // Placeholder, will not be edited via form
      status: 'active',
      capacity: 0,
      currentPopulation: 0,
      species: '',
      installDate: new Date(),
      lastInspection: new Date(),
      nextMaintenance: new Date(),
      waterDepth: 0,
      cageSize: { length: 0, width: 0, height: 0 },
      netCondition: 'excellent',
      anchoringSystem: '',
      coordinates: { lat: 0, lng: 0 },
      waterQuality: { temperature: 0, oxygen: 0, ph: 0, salinity: 0 },
      production: { averageWeight: 0, growthRate: 0, feedConversion: 0, mortality: 0 },
      equipment: { feedingSystems: 0, sensors: 0, cameras: 0 },
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form for new cage
      setFormData({
        id: '',
        name: '',
        position: { x: 0, y: 0 },
        status: 'active',
        capacity: 0,
        currentPopulation: 0,
        species: '',
        installDate: new Date(),
        lastInspection: new Date(),
        nextMaintenance: new Date(),
        waterDepth: 0,
        cageSize: { length: 0, width: 0, height: 0 },
        netCondition: 'excellent',
        anchoringSystem: '',
        coordinates: { lat: 0, lng: 0 },
        waterQuality: { temperature: 0, oxygen: 0, ph: 0, salinity: 0 },
        production: { averageWeight: 0, growthRate: 0, feedConversion: 0, mortality: 0 },
        equipment: { feedingSystems: 0, sensors: 0, cameras: 0 },
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.includes('.')) {
      // Handle nested objects like waterQuality.temperature
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: type === 'number' ? parseFloat(value) : value,
        },
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else if (type === 'date') {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.species || formData.capacity <= 0) {
      alert('Por favor, complete los campos obligatorios (Nombre, Especie, Capacidad).');
      return;
    }

    // Generate a new ID if adding a new cage
    const cageToSave = { ...formData };
    if (!isEditing) {
      cageToSave.id = `MX-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      // Set initial position for new cages (can be adjusted later via map interaction)
      cageToSave.position = { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 };
      // If coordinates are not set by user, use a default or random near concession
      if (cageToSave.coordinates.lat === 0 && cageToSave.coordinates.lng === 0) {
        cageToSave.coordinates = { lat: -42.78 + (Math.random() * 0.02 - 0.01), lng: -73.24 + (Math.random() * 0.02 - 0.01) };
      }
    }
    
    onSave(cageToSave);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-2xl border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-2xl font-bold text-text flex items-center">
            {isEditing ? <Edit className="h-6 w-6 mr-3 text-primary" /> : <PlusCircle className="h-6 w-6 mr-3 text-primary" />}
            {isEditing ? `Editar Balsa Jaula: ${initialData?.name}` : 'Añadir Nueva Balsa Jaula'}
          </h2>
          <button onClick={onCancel} className="text-textSecondary hover:text-text transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" /> Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing && (
                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-textSecondary mb-1">ID de la Balsa</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    readOnly
                    className="w-full p-2 bg-background border border-border rounded-md text-text cursor-not-allowed"
                  />
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-textSecondary mb-1">Nombre de la Balsa</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="species" className="block text-sm font-medium text-textSecondary mb-1">Especie</label>
                <input
                  type="text"
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-textSecondary mb-1">Capacidad Máxima (peces)</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="currentPopulation" className="block text-sm font-medium text-textSecondary mb-1">Población Actual (peces)</label>
                <input
                  type="number"
                  id="currentPopulation"
                  name="currentPopulation"
                  value={formData.currentPopulation}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-textSecondary mb-1">Estado</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                >
                  <option value="active">Activa</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="inactive">Inactiva</option>
                  <option value="preparation">Preparación</option>
                </select>
              </div>
              <div>
                <label htmlFor="installDate" className="block text-sm font-medium text-textSecondary mb-1">Fecha de Instalación</label>
                <input
                  type="date"
                  id="installDate"
                  name="installDate"
                  value={formData.installDate.toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Location & Dimensions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" /> Ubicación y Dimensiones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="coordinates.lat" className="block text-sm font-medium text-textSecondary mb-1">Latitud</label>
                <input
                  type="number"
                  id="coordinates.lat"
                  name="coordinates.lat"
                  value={formData.coordinates.lat}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="coordinates.lng" className="block text-sm font-medium text-textSecondary mb-1">Longitud</label>
                <input
                  type="number"
                  id="coordinates.lng"
                  name="coordinates.lng"
                  value={formData.coordinates.lng}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="waterDepth" className="block text-sm font-medium text-textSecondary mb-1">Profundidad del Agua (m)</label>
                <input
                  type="number"
                  id="waterDepth"
                  name="waterDepth"
                  value={formData.waterDepth}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="cageSize.length" className="block text-sm font-medium text-textSecondary mb-1">Largo Jaula (m)</label>
                <input
                  type="number"
                  id="cageSize.length"
                  name="cageSize.length"
                  value={formData.cageSize.length}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="cageSize.width" className="block text-sm font-medium text-textSecondary mb-1">Ancho Jaula (m)</label>
                <input
                  type="number"
                  id="cageSize.width"
                  name="cageSize.width"
                  value={formData.cageSize.width}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="cageSize.height" className="block text-sm font-medium text-textSecondary mb-1">Alto Jaula (m)</label>
                <input
                  type="number"
                  id="cageSize.height"
                  name="cageSize.height"
                  value={formData.cageSize.height}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="netCondition" className="block text-sm font-medium text-textSecondary mb-1">Condición de la Red</label>
                <select
                  id="netCondition"
                  name="netCondition"
                  value={formData.netCondition}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                >
                  <option value="excellent">Excelente</option>
                  <option value="good">Buena</option>
                  <option value="fair">Regular</option>
                  <option value="poor">Mala</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="anchoringSystem" className="block text-sm font-medium text-textSecondary mb-1">Sistema de Fondeo</label>
                <textarea
                  id="anchoringSystem"
                  name="anchoringSystem"
                  value={formData.anchoringSystem}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Water Quality */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <Waves className="h-5 w-5 mr-2 text-primary" /> Calidad del Agua
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="waterQuality.temperature" className="block text-sm font-medium text-textSecondary mb-1">Temperatura (°C)</label>
                <input
                  type="number"
                  id="waterQuality.temperature"
                  name="waterQuality.temperature"
                  value={formData.waterQuality.temperature}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="waterQuality.oxygen" className="block text-sm font-medium text-textSecondary mb-1">Oxígeno (mg/L)</label>
                <input
                  type="number"
                  id="waterQuality.oxygen"
                  name="waterQuality.oxygen"
                  value={formData.waterQuality.oxygen}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="waterQuality.ph" className="block text-sm font-medium text-textSecondary mb-1">pH</label>
                <input
                  type="number"
                  id="waterQuality.ph"
                  name="waterQuality.ph"
                  value={formData.waterQuality.ph}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="waterQuality.salinity" className="block text-sm font-medium text-textSecondary mb-1">Salinidad (PSU)</label>
                <input
                  type="number"
                  id="waterQuality.salinity"
                  name="waterQuality.salinity"
                  value={formData.waterQuality.salinity}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Production Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <Scale className="h-5 w-5 mr-2 text-primary" /> Métricas de Producción
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="production.averageWeight" className="block text-sm font-medium text-textSecondary mb-1">Peso Promedio (kg)</label>
                <input
                  type="number"
                  id="production.averageWeight"
                  name="production.averageWeight"
                  value={formData.production.averageWeight}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="production.growthRate" className="block text-sm font-medium text-textSecondary mb-1">Tasa de Crecimiento (%/día)</label>
                <input
                  type="number"
                  id="production.growthRate"
                  name="production.growthRate"
                  value={formData.production.growthRate}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="production.feedConversion" className="block text-sm font-medium text-textSecondary mb-1">Conversión de Alimento</label>
                <input
                  type="number"
                  id="production.feedConversion"
                  name="production.feedConversion"
                  value={formData.production.feedConversion}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="production.mortality" className="block text-sm font-medium text-textSecondary mb-1">Mortalidad (%)</label>
                <input
                  type="number"
                  id="production.mortality"
                  name="production.mortality"
                  value={formData.production.mortality}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-primary" /> Equipamiento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="equipment.feedingSystems" className="block text-sm font-medium text-textSecondary mb-1">Sistemas de Alimentación</label>
                <input
                  type="number"
                  id="equipment.feedingSystems"
                  name="equipment.feedingSystems"
                  value={formData.equipment.feedingSystems}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="equipment.sensors" className="block text-sm font-medium text-textSecondary mb-1">Sensores</label>
                <input
                  type="number"
                  id="equipment.sensors"
                  name="equipment.sensors"
                  value={formData.equipment.sensors}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="equipment.cameras" className="block text-sm font-medium text-textSecondary mb-1">Cámaras</label>
                <input
                  type="number"
                  id="equipment.cameras"
                  name="equipment.cameras"
                  value={formData.equipment.cameras}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-lg border border-border text-textSecondary hover:bg-background transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{isEditing ? 'Guardar Cambios' : 'Añadir Balsa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CageForm;
