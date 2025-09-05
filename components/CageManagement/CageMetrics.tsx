import React from 'react';
import { CageData } from './CageManagement';
import { Fish, BarChart3, TrendingUp, Droplets, Wrench, AlertTriangle, Activity } from 'lucide-react'; // Added Activity

interface CageMetricsProps {
  cages: CageData[];
}

const CageMetrics: React.FC<CageMetricsProps> = ({ cages }) => {
  // Calculate aggregated metrics
  const totalPopulation = cages.reduce((sum, cage) => sum + cage.currentPopulation, 0);
  const totalCapacity = cages.reduce((sum, cage) => sum + cage.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? (totalPopulation / totalCapacity) * 100 : 0;
  const activeCages = cages.filter(c => c.status === 'active').length;
  const maintenanceCages = cages.filter(c => c.status === 'maintenance').length;
  const inactiveCages = cages.filter(c => c.status === 'inactive').length;
  const preparationCages = cages.filter(c => c.status === 'preparation').length;

  const averageTemperature = cages.reduce((sum, cage) => sum + cage.waterQuality.temperature, 0) / cages.length;
  const averageOxygen = cages.reduce((sum, cage) => sum + cage.waterQuality.oxygen, 0) / cages.length;
  const averagePH = cages.reduce((sum, cage) => sum + cage.waterQuality.ph, 0) / cages.length;

  const averageGrowthRate = cages.filter(c => c.status === 'active').reduce((sum, cage) => sum + cage.production.growthRate, 0) / activeCages;
  const averageMortality = cages.filter(c => c.status === 'active').reduce((sum, cage) => sum + cage.production.mortality, 0) / activeCages;

  const uniqueSpecies = [...new Set(cages.map(c => c.species).filter(s => s !== 'N/A'))];

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6 space-y-8">
      <h2 className="text-2xl font-bold text-text flex items-center">
        <BarChart3 className="h-6 w-6 mr-3 text-primary" /> Métricas Generales de la Concesión
      </h2>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background rounded-lg p-4 border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-textSecondary">Población Total</p>
            <p className="text-2xl font-bold text-primary">{totalPopulation.toLocaleString()}</p>
          </div>
          <Fish className="h-8 w-8 text-primary" />
        </div>
        <div className="bg-background rounded-lg p-4 border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-textSecondary">Tasa de Ocupación</p>
            <p className="text-2xl font-bold text-accent">{occupancyRate.toFixed(1)}%</p>
          </div>
          <TrendingUp className="h-8 w-8 text-accent" />
        </div>
        <div className="bg-background rounded-lg p-4 border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-textSecondary">Balsas Activas</p>
            <p className="text-2xl font-bold text-success">{activeCages}</p>
          </div>
          <Activity className="h-8 w-8 text-success" />
        </div>
        <div className="bg-background rounded-lg p-4 border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-textSecondary">En Mantenimiento</p>
            <p className="text-2xl font-bold text-warning">{maintenanceCages}</p>
          </div>
          <Wrench className="h-8 w-8 text-warning" />
        </div>
      </div>

      {/* Water Quality Metrics */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-text flex items-center">
          <Droplets className="h-5 w-5 mr-2 text-secondary" /> Calidad del Agua Promedio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-textSecondary">Temperatura</p>
            <p className="text-xl font-bold text-secondary">{averageTemperature.toFixed(1)}°C</p>
          </div>
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-textSecondary">Oxígeno Disuelto</p>
            <p className="text-xl font-bold text-secondary">{averageOxygen.toFixed(1)} mg/L</p>
          </div>
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-textSecondary">pH</p>
            <p className="text-xl font-bold text-secondary">{averagePH.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Production Performance */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-text flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-success" /> Rendimiento de Producción
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-textSecondary">Tasa de Crecimiento Promedio</p>
            <p className="text-xl font-bold text-success">{averageGrowthRate.toFixed(2)}% / día</p>
          </div>
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm text-textSecondary">Tasa de Mortalidad Promedio</p>
            <p className="text-xl font-bold text-error">{averageMortality.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Cage Status Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-text flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-warning" /> Estado de Balsas Jaulas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-100/20 rounded-lg p-4 border border-green-500/50">
            <p className="text-sm text-textSecondary">Activas</p>
            <p className="text-xl font-bold text-success">{activeCages}</p>
          </div>
          <div className="bg-yellow-100/20 rounded-lg p-4 border border-yellow-500/50">
            <p className="text-sm text-textSecondary">Mantenimiento</p>
            <p className="text-xl font-bold text-warning">{maintenanceCages}</p>
          </div>
          <div className="bg-blue-100/20 rounded-lg p-4 border border-blue-500/50">
            <p className="text-sm text-textSecondary">Preparación</p>
            <p className="text-xl font-bold text-primary">{preparationCages}</p>
          </div>
          <div className="bg-gray-100/20 rounded-lg p-4 border border-gray-500/50">
            <p className="text-sm text-textSecondary">Inactivas</p>
            <p className="text-xl font-bold text-textSecondary">{inactiveCages}</p>
          </div>
        </div>
      </div>

      {/* Species Overview */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-text flex items-center">
          <Fish className="h-5 w-5 mr-2 text-primary" /> Especies en Cultivo
        </h3>
        <div className="bg-background rounded-lg p-4 border border-border">
          <ul className="list-disc list-inside text-textSecondary">
            {uniqueSpecies.length > 0 ? (
              uniqueSpecies.map((species, index) => (
                <li key={index} className="text-lg">{species}</li>
              ))
            ) : (
              <li className="text-lg">No hay especies registradas actualmente.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CageMetrics;
