import React from 'react';
import { BarChart3 } from 'lucide-react';

const WaterQualityChart: React.FC = () => {
  const data = [
    { time: '00:00', temp: 14.2, oxygen: 8.1, ph: 7.8 },
    { time: '04:00', temp: 13.8, oxygen: 8.3, ph: 7.7 },
    { time: '08:00', temp: 14.5, oxygen: 8.0, ph: 7.9 },
    { time: '12:00', temp: 15.1, oxygen: 7.8, ph: 8.0 },
    { time: '16:00', temp: 14.8, oxygen: 8.2, ph: 7.8 },
    { time: '20:00', temp: 14.3, oxygen: 8.4, ph: 7.6 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Parámetros del Agua (24h)</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Temperatura (°C)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Oxígeno (mg/L)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>pH</span>
          </div>
        </div>
        
        <div className="relative h-48 bg-gray-50 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-around p-4 space-x-2">
            {data.map((point, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                <div className="flex flex-col space-y-1 w-full">
                  <div 
                    className="bg-blue-500 rounded-sm w-full opacity-80"
                    style={{ height: `${(point.temp / 20) * 100}px` }}
                  ></div>
                  <div 
                    className="bg-green-500 rounded-sm w-full opacity-80"
                    style={{ height: `${(point.oxygen / 10) * 100}px` }}
                  ></div>
                  <div 
                    className="bg-purple-500 rounded-sm w-full opacity-80"
                    style={{ height: `${(point.ph / 10) * 100}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{point.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterQualityChart;
