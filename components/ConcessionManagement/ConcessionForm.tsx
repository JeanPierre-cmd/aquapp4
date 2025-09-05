import React, { useState, useEffect } from 'react';
import { ConcessionData } from '../CageManagement/CageManagement'; // Import ConcessionData interface
import { X, Save, Building2, MapPin, Phone, Mail, User, Award, FileText, Globe, Info } from 'lucide-react'; // Added Info icon

interface ConcessionFormProps {
  initialData: ConcessionData;
  onSave: (concession: ConcessionData) => void;
  onCancel: () => void;
}

const ConcessionForm: React.FC<ConcessionFormProps> = ({ initialData, onSave, onCancel }) => {
  // Safely initialize form data, providing default values for nested structures
  // to prevent runtime errors if initialData is incomplete.
  const [formData, setFormData] = useState<ConcessionData>(() => {
    const safeData = initialData || ({} as ConcessionData);
    return {
      ...safeData,
      coordinates: safeData.coordinates || { lat: 0, lng: 0 },
      certifications: safeData.certifications || [],
      environmentalPermits: safeData.environmentalPermits || [],
    };
  });

  useEffect(() => {
    const safeData = initialData || ({} as ConcessionData);
    setFormData({
      ...safeData,
      coordinates: safeData.coordinates || { lat: 0, lng: 0 },
      certifications: safeData.certifications || [],
      environmentalPermits: safeData.environmentalPermits || [],
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.includes('.')) {
      // Handle nested objects like coordinates.lat
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          // Ensure parent object exists before spreading
          ...((prev as any)[parent] || {}),
          [child]: type === 'number' ? parseFloat(value) || 0 : value,
        },
      }));
    } else if (name === 'certifications' || name === 'environmentalPermits') {
      // Handle array fields, splitting by comma
      setFormData((prev) => ({ ...prev, [name]: value.split(',').map(item => item.trim()).filter(item => item !== '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.manager || !formData.location) {
      alert('Por favor, complete los campos obligatorios (Nombre, Manager, Ubicación).');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-2xl border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-2xl font-bold text-text flex items-center">
            <Building2 className="h-6 w-6 mr-3 text-primary" />
            Gestionar Concesión: {initialData?.name || ''}
          </h2>
          <button onClick={onCancel} className="text-textSecondary hover:text-text transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" /> Detalles Generales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-textSecondary mb-1">Nombre de la Concesión</label>
                <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" required />
              </div>
              <div>
                <label htmlFor="rut" className="block text-sm font-medium text-textSecondary mb-1">RUT</label>
                <input type="text" id="rut" name="rut" value={formData.rut || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="manager" className="block text-sm font-medium text-textSecondary mb-1">Manager</label>
                <input type="text" id="manager" name="manager" value={formData.manager || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-textSecondary mb-1">Teléfono</label>
                <input type="text" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-textSecondary mb-1">Email</label>
                <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="established" className="block text-sm font-medium text-textSecondary mb-1">Año de Establecimiento</label>
                <input type="text" id="established" name="established" value={formData.established || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-textSecondary mb-1">Dirección</label>
                <textarea id="address" name="address" value={formData.address || ''} onChange={handleChange} rows={2} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"></textarea>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" /> Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-textSecondary mb-1">Ubicación (Región/País)</label>
                <input type="text" id="location" name="location" value={formData.location || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" required />
              </div>
              <div>
                <label htmlFor="waterBody" className="block text-sm font-medium text-textSecondary mb-1">Cuerpo de Agua</label>
                <input type="text" id="waterBody" name="waterBody" value={formData.waterBody || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="totalArea" className="block text-sm font-medium text-textSecondary mb-1">Área Total</label>
                <input type="text" id="totalArea" name="totalArea" value={formData.totalArea || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="maxDepth" className="block text-sm font-medium text-textSecondary mb-1">Profundidad Máxima</label>
                <input type="text" id="maxDepth" name="maxDepth" value={formData.maxDepth || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="coordinates.lat" className="block text-sm font-medium text-textSecondary mb-1">Latitud</label>
                <input type="number" id="coordinates.lat" name="coordinates.lat" value={formData.coordinates.lat} onChange={handleChange} step="0.0001" className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="coordinates.lng" className="block text-sm font-medium text-textSecondary mb-1">Longitud</label>
                <input type="number" id="coordinates.lng" name="coordinates.lng" value={formData.coordinates.lng} onChange={handleChange} step="0.0001" className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>

          {/* Regulatory & Operational */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-textSecondary flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" /> Regulaciones y Operación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="license" className="block text-sm font-medium text-textSecondary mb-1">Licencia</label>
                <input type="text" id="license" name="license" value={formData.license || ''} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="operationalStatus" className="block text-sm font-medium text-textSecondary mb-1">Estado Operacional</label>
                <select id="operationalStatus" name="operationalStatus" value={formData.operationalStatus || 'Activa'} onChange={handleChange} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary">
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                  <option value="Suspendida">Suspendida</option>
                  <option value="En Revisión">En Revisión</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="certifications" className="block text-sm font-medium text-textSecondary mb-1">Certificaciones (separadas por coma)</label>
                <textarea id="certifications" name="certifications" value={formData.certifications.join(', ')} onChange={handleChange} rows={2} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="environmentalPermits" className="block text-sm font-medium text-textSecondary mb-1">Permisos Ambientales (separados por coma)</label>
                <textarea id="environmentalPermits" name="environmentalPermits" value={formData.environmentalPermits.join(', ')} onChange={handleChange} rows={2} className="w-full p-2 bg-background border border-border rounded-md text-text focus:ring-primary focus:border-primary"></textarea>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <button type="button" onClick={onCancel} className="px-6 py-3 rounded-lg border border-border text-textSecondary hover:bg-background transition-colors font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium flex items-center space-x-2">
              <Save className="h-5 w-5" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConcessionForm;
