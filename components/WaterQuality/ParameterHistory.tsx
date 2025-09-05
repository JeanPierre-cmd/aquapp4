import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ParameterHistoryProps {
  selectedParameter: string;
}

const ParameterHistory: React.FC<ParameterHistoryProps> = ({ selectedParameter }) => {
  // Mock data for different parameters
  const historyData = {
    temperatura: [
      { time: '00:00', value: 14.2 }, { time: '02:00', value: 13.9 },
      { time: '04:00', value: 13.8 }, { time: '06:00', value: 14.1 },
      { time: '08:00', value: 14.5 }, { time: '10:00', value: 14.8 },
      { time: '12:00', value: 15.1 }, { time: '14:00', value: 14.9 },
      { time: '16:00', value: 14.6 }, { time: '18:00', value: 14.3 },
      { time: '20:00', value: 14.1 }, { time: '22:00', value: 14.0 },
    ],
    'oxígeno disuelto': [
      { time: '00:00', value: 8.1 }, { time: '02:00', value: 8.3 },
      { time: '04:00', value: 8.2 }, { time: '06:00', value: 8.0 },
      { time: '08:00', value: 7.9 }, { time: '10:00', value: 8.1 },
      { time: '12:00', value: 7.8 }, { time: '14:00', value: 8.2 },
      { time: '16:00', value: 8.4 }, { time: '18:00', value: 8.3 },
      { time: '20:00', value: 8.2 }, { time: '22:00', value: 8.1 },
    ],
    'ph': [
      { time: '00:00', value: 8.0 }, { time: '02:00', value: 8.1 },
      { time: '04:00', value: 8.0 }, { time: '06:00', value: 8.2 },
      { time: '08:00', value: 8.1 }, { time: '10:00', value: 8.1 },
      { time: '12:00', value: 8.2 }, { time: '14:00', value: 8.0 },
      { time: '16:00', value: 8.1 }, { time: '18:00', value: 8.0 },
      { time: '20:00', value: 8.1 }, { time: '22:00', value: 8.2 },
    ],
    'salinidad': [
      { time: '00:00', value: 32.1 }, { time: '02:00', value: 32.3 },
      { time: '04:00', value: 32.2 }, { time: '06:00', value: 32.5 },
      { time: '08:00', value: 32.6 }, { time: '10:00', value: 32.4 },
      { time: '12:00', value: 32.5 }, { time: '14:00', value: 32.7 },
      { time: '16:00', value: 32.6 }, { time: '18:00', value: 32.5 },
      { time: '20:00', value: 32.4 }, { time: '22:00', value: 32.3 },
    ],
    'clorofila': [
      { time: '00:00', value: 15.1 }, { time: '02:00', value: 18.3 },
      { time: '04:00', value: 20.2 }, { time: '06:00', value: 22.0 },
      { time: '08:00', value: 25.9 }, { time: '10:00', value: 28.1 },
      { time: '12:00', value: 30.8 }, { time: '14:00', value: 26.2 },
      { time: '16:00', value: 24.4 }, { time: '18:00', value: 21.3 },
      { time: '20:00', value: 18.2 }, { time: '22:00', value: 16.1 },
    ]
  };

  const data = historyData[selectedParameter as keyof typeof historyData] || historyData.temperatura;
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          Historial de {selectedParameter.replace('-', ' ')} (Últimas 24h)
        </h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between space-x-1">
          {data.map((point, index) => {
            const height = range > 0 ? ((point.value - minValue) / range) * 100 : 50;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative group w-full h-full flex items-end">
                  <div 
                    className="bg-blue-500 rounded-t-sm w-full hover:bg-blue-600 transition-colors"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  ></div>
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {point.value.toFixed(1)}
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{point.time}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Periodo: Últimas 24 horas</span>
        <div className="flex items-center space-x-4">
          <span>Mín: {minValue.toFixed(1)}</span>
          <span>Máx: {maxValue.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default ParameterHistory;
