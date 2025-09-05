import React from 'react';
import { CageData } from './CageManagement';
import { Fish, MapPin, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface CageListProps {
  cages: CageData[];
  selectedCage: string | null;
  onCageSelect: (cageId: string) => void;
}

const CageList: React.FC<CageListProps> = ({ cages, selectedCage, onCageSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'preparation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'inactive':
        return <div className="h-5 w-5 rounded-full bg-gray-400"></div>;
      case 'preparation':
        return <div className="h-5 w-5 rounded-full bg-blue-500"></div>;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-400"></div>;
    }
  };

  // Helper function to get net condition label - Changed to function declaration
  function getNetConditionLabel(condition: string) {
    switch (condition) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Buena';
      case 'fair':
        return 'Regular';
      case 'poor':
        return 'Mala';
      case 'damaged':
        return 'Dañada';
      default:
        return 'Desconocida';
    }
  }

  const handleViewDetails = (cageId: string) => {
    onCageSelect(cageId);
    // Solo seleccionar, no mostrar alert
  };

  const handleQuickAction = (cageId: string, action: string) => {
    const cage = cages.find(c => c.id === cageId);
    switch (action) {
      case 'inspect':
        if (confirm(`¿Iniciar inspección rápida de ${cage?.name}?\n\nEsto tomará aproximadamente 15 minutos.`)) {
          alert(`Inspección rápida iniciada para ${cage?.name}.\n\n✅ Checklist digital activado\n📋 Puntos de verificación: 12\n⏱️ Tiempo estimado: 15 min`);
        }
        break;
      case 'feed':
        const feedAmount = prompt(`Programar alimentación para ${cage?.name}\n\nIngrese cantidad en kg:`);
        if (feedAmount && !isNaN(Number(feedAmount))) {
          alert(`Alimentación programada para ${cage?.name}.\n\n🐟 Cantidad: ${feedAmount} kg\n⏰ Hora: ${new Date().toLocaleTimeString('es-ES')}\n✅ Sistema de alimentación activado`);
        }
        break;
      case 'maintenance':
        if (confirm(`¿Programar mantenimiento para ${cage?.name}?\n\nSe notificará al equipo técnico.`)) {
          alert(`Mantenimiento programado para ${cage?.name}.\n\n🔧 Tipo: Preventivo\n📅 Fecha: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}\n👨‍🔧 Técnico asignado: Juan Pérez`);
        }
        break;
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text">Lista de Balsas Jaulas</h3>
        <p className="text-sm text-textSecondary mt-1">
          {cages.length} balsas jaulas en total • {cages.filter(c => c.status === 'active').length} activas
        </p>
      </div>

      <div className="divide-y divide-border">
        {cages.map((cage) => {
          const occupancyPercentage = (cage.currentPopulation / cage.capacity) * 100;
          
          return (
            <div
              key={cage.id}
              className={`p-6 hover:bg-background transition-colors ${
                selectedCage === cage.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(cage.status)}
                    <div>
                      <h4 className="text-lg font-semibold text-text">{cage.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-textSecondary">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{cage.coordinates.lat.toFixed(4)}°, {cage.coordinates.lng.toFixed(4)}°</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Fish className="h-4 w-4" />
                          <span>{cage.species}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cage.status)}`}>
                      {getStatusLabel(cage.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Population */}
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Fish className="h-4 w-4 text-primary" />
                        <span className="text-sm text-textSecondary">Población</span>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        {cage.currentPopulation.toLocaleString()}
                      </p>
                      <div className="w-full bg-primary/30 rounded-full h-1 mt-2">
                        <div 
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${occupancyPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-textSecondary mt-1">{occupancyPercentage.toFixed(1)}% ocupación</p>
                    </div>

                    {/* Water Quality */}
                    <div className="bg-success/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm text-textSecondary">Calidad Agua</span>
                      </div>
                      <p className="text-lg font-semibold text-success">{cage.waterQuality.temperature}°C</p>
                      <p className="text-xs text-textSecondary mt-1">
                        O₂: {cage.waterQuality.oxygen} mg/L • pH: {cage.waterQuality.ph}
                      </p>
                    </div>

                    {/* Production */}
                    <div className="bg-accent/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span className="text-sm text-textSecondary">Producción</span>
                      </div>
                      <p className="text-lg font-semibold text-accent">{cage.production.averageWeight} kg</p>
                      <p className="text-xs text-textSecondary mt-1">
                        Crecimiento: {cage.production.growthRate}%/día
                      </p>
                    </div>

                    {/* Maintenance */}
                    <div className="bg-warning/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-warning" />
                        <span className="text-sm text-textSecondary">Mantenimiento</span>
                      </div>
                      <p className="text-sm font-semibold text-warning">
                        {cage.nextMaintenance.toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-xs text-textSecondary mt-1">
                        Próximo programado
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-textSecondary">
                    <div className="flex items-center space-x-4">
                      <span>Profundidad: {cage.waterDepth}m</span>
                      <span>Dimensiones: {cage.cageSize.length}×{cage.cageSize.width}×{cage.cageSize.height}m</span>
                      <span>Red: {getNetConditionLabel(cage.netCondition)}</span>
                    </div>
                    <span>Instalada: {cage.installDate.toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 mt-4">
                <button
                  onClick={() => handleViewDetails(cage.id)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Ver Detalles
                </button>
                
                {cage.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleQuickAction(cage.id, 'feed')}
                      className="border border-success/50 text-success px-4 py-2 rounded-lg hover:bg-success/10 transition-colors text-sm font-medium"
                    >
                      Alimentar
                    </button>
                    <button
                      onClick={() => handleQuickAction(cage.id, 'inspect')}
                      className="border border-border text-textSecondary px-4 py-2 rounded-lg hover:bg-background transition-colors text-sm font-medium"
                    >
                      Inspeccionar
                    </button>
                  </>
                )}
                
                {(cage.status === 'maintenance' || cage.status === 'inactive') && (
                  <button
                    onClick={() => handleQuickAction(cage.id, 'maintenance')}
                    className="border border-warning/50 text-warning px-4 py-2 rounded-lg hover:bg-warning/10 transition-colors text-sm font-medium"
                  >
                    Mantenimiento
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CageList;
