import React from 'react';
import { MapPin } from 'lucide-react';
import { Cage } from '../../types';

interface CageStatusProps {
  cages: Cage[];
  selectedCage: string;
  onCageSelect: (cageId: string) => void;
}

const CageStatus: React.FC<CageStatusProps> = ({ cages, selectedCage, onCageSelect }) => {

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Activa', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100' };
      case 'warning':
        return { label: 'Alerta', color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100' };
      case 'maintenance':
        return { label: 'Mantenimiento', color: 'bg-orange-500', textColor: 'text-orange-800', bgColor: 'bg-orange-100' };
      default:
        return { label: 'Inactiva', color: 'bg-gray-400', textColor: 'text-gray-800', bgColor: 'bg-gray-100' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Jaulas</h3>
      
      <div className="space-y-2">
        {cages.map((cage) => {
          const statusInfo = getStatusInfo(cage.status);
          const isSelected = selectedCage === cage.id;
          const occupancy = (cage.currentPopulation / cage.capacity) * 100;

          return (
            <button
              key={cage.id}
              onClick={() => onCageSelect(cage.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-4 relative overflow-hidden ${
                isSelected
                  ? 'bg-blue-50 border border-blue-200 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusInfo.color}`}></div>
              <div className="pl-3 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{cage.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                    {statusInfo.label}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`${statusInfo.color} h-1.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
                  </div>
                  <span className="text-xs font-mono w-16 text-right">{occupancy.toFixed(1)}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CageStatus;
