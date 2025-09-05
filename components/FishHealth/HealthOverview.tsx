import React from 'react';
import { Fish, AlertCircle, Activity, Users } from 'lucide-react';
import { Cage } from '../../types';
import RadialProgress from '../ui/RadialProgress';

interface HealthOverviewProps {
  cages: Cage[];
}

const HealthOverview: React.FC<HealthOverviewProps> = ({ cages }) => {
  const totalPopulation = cages.reduce((sum, cage) => sum + cage.currentPopulation, 0);
  const totalCapacity = cages.reduce((sum, cage) => sum + cage.capacity, 0);
  const utilizationRate = totalCapacity > 0 ? (totalPopulation / totalCapacity) * 100 : 0;
  const cagesInAlert = cages.filter(c => c.status === 'warning' || c.status === 'maintenance').length;

  const healthStats = [
    {
      title: 'Población Total',
      value: totalPopulation.toLocaleString(),
      icon: Users,
      color: 'blue',
      description: 'Peces activos en el centro'
    },
    {
      title: 'Mortalidad (7d)',
      value: '0.18%',
      icon: Activity,
      color: 'green',
      description: 'Dentro de los límites aceptables'
    },
    {
      title: 'Jaulas en Alerta',
      value: cagesInAlert.toString(),
      icon: AlertCircle,
      color: 'yellow',
      description: 'Requieren atención inmediata'
    }
  ];

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'yellow': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-6">
        <RadialProgress 
          progress={utilizationRate} 
          colorClass="text-blue-600"
          label="Ocupación"
        />
        <div>
          <h3 className="text-sm font-medium text-gray-500">Tasa de Ocupación</h3>
          <p className="text-3xl font-bold text-gray-900">{utilizationRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-1">Capacidad total utilizada</p>
        </div>
      </div>
      {healthStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
              <Icon className={`h-6 w-6 ${getStatusColor(stat.color)}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HealthOverview;
