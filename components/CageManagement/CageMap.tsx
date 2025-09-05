import React from 'react';
import { MapPin, Fish } from 'lucide-react';
import { CageData, ConcessionData } from './CageManagement';

interface CageMapProps {
  cages: CageData[];
  selectedCage: string | null;
  onCageSelect: (cageId: string) => void;
  concessionData: ConcessionData;
}

const CageMap: React.FC<CageMapProps> = ({ cages, selectedCage, onCageSelect, concessionData }) => {
  // Placeholder image for the map, as the geospatial viewer is deferred
  const mapImageUrl = 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'; // Example Pexels image of water/ocean

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-6 relative overflow-hidden" style={{ height: '600px' }}>
      <h3 className="text-lg font-semibold text-text mb-4">Vista de Mapa de la Concesión</h3>
      <div className="absolute inset-0 z-0">
        <img 
          src={mapImageUrl} 
          alt="Mapa de la concesión acuícola" 
          className="w-full h-full object-cover rounded-xl opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="relative w-[800px] h-[500px] bg-transparent" style={{ transform: 'scale(0.8)' }}> {/* Scaled down for better fit */}
          {/* Concession Center Marker */}
          <div 
            className="absolute flex flex-col items-center cursor-pointer"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            title={concessionData.name}
          >
            <MapPin className="h-10 w-10 text-primary drop-shadow-lg" />
            <span className="text-sm font-bold text-white bg-primary/80 px-2 py-1 rounded-md mt-1 whitespace-nowrap">
              {concessionData.name}
            </span>
          </div>

          {/* Cage Markers */}
          {cages.map((cage) => (
            <div
              key={cage.id}
              className={`absolute flex flex-col items-center cursor-pointer transition-all duration-200 ${
                selectedCage === cage.id ? 'scale-125 z-20' : 'hover:scale-110'
              }`}
              style={{ left: cage.position.x, top: cage.position.y, transform: 'translate(-50%, -50%)' }}
              onClick={() => onCageSelect(cage.id)}
              title={cage.name}
            >
              <div 
                className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${selectedCage === cage.id ? 'bg-accent border-white shadow-lg' : 'bg-primary/80 border-primary/50 hover:bg-primary'}
                  ${cage.status === 'active' ? 'bg-green-500/80 border-green-300' : 
                    cage.status === 'maintenance' ? 'bg-yellow-500/80 border-yellow-300' : 
                    cage.status === 'preparation' ? 'bg-blue-500/80 border-blue-300' : 
                    'bg-gray-500/80 border-gray-300'
                  }
                `}
              >
                <Fish className="h-4 w-4 text-white" />
              </div>
              <span 
                className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-md whitespace-nowrap 
                  ${selectedCage === cage.id ? 'bg-white text-gray-900 shadow-md' : 'bg-background/70 text-textSecondary'}
                `}
              >
                {cage.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg z-20">
        <h4 className="font-semibold text-text mb-2">Leyenda</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-textSecondary">Activa</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-textSecondary">Mantenimiento</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-textSecondary">Preparación</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-textSecondary">Inactiva</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CageMap;
