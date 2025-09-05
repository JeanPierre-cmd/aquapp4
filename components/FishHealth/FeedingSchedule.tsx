import React from 'react';
import { Clock, Fish, CheckCircle, MoreHorizontal } from 'lucide-react';

interface FeedingScheduleProps {
  selectedCage: string;
}

const FeedingSchedule: React.FC<FeedingScheduleProps> = ({ selectedCage }) => {
  const schedule = [
    { time: '08:00', ration: '120 kg', type: 'Alimento Estándar 4mm', status: 'completed' },
    { time: '12:00', ration: '150 kg', type: 'Alimento Alta Energía 4mm', status: 'completed' },
    { time: '16:00', ration: '130 kg', type: 'Alimento Estándar 4mm', status: 'pending' },
    { time: '20:00', ration: '100 kg', type: 'Alimento Medicado', status: 'pending' },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Completado', textColor: 'text-gray-500' };
      case 'pending':
        return { icon: <Clock className="h-4 w-4 text-yellow-500" />, label: 'Pendiente', textColor: 'text-gray-800' };
      default:
        return { icon: <Clock className="h-4 w-4 text-gray-400" />, label: 'Programado', textColor: 'text-gray-800' };
    }
  };

  const handleRegisterFeeding = () => {
    const amount = prompt(`Registrar alimentación para Jaula ${selectedCage}:\n\nIngrese la cantidad de alimento (kg):`);
    if (amount && !isNaN(Number(amount))) {
      alert(`Se ha registrado una alimentación de ${amount} kg para la jaula ${selectedCage}.`);
    } else if (amount) {
      alert('Por favor, ingrese un valor numérico válido.');
    }
  };

  const handleMoreOptions = () => {
    alert('Funcionalidad de menú contextual (ej: ver historial, ajustar programa) se implementaría aquí.');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alimentación - Jaula {selectedCage}</h3>
        <button onClick={handleMoreOptions} className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {schedule.map((item, index) => {
          const statusInfo = getStatusInfo(item.status);
          return (
            <div key={index} className={`p-3 rounded-lg ${item.status === 'completed' ? 'bg-gray-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${item.status === 'completed' ? 'bg-gray-200' : 'bg-blue-100'}`}>
                    <Fish className={`h-5 w-5 ${item.status === 'completed' ? 'text-gray-500' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${statusInfo.textColor}`}>{item.time}</p>
                    <p className="text-sm text-gray-500">{item.ration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {statusInfo.icon}
                  <span>{statusInfo.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button 
        onClick={handleRegisterFeeding}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Registrar Alimentación
      </button>
    </div>
  );
};

export default FeedingSchedule;
