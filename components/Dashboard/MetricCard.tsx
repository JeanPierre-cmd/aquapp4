import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  subTitle?: string;
  subValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  status, 
  trend,
  subTitle,
  subValue
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {value}
              </p>
              {unit && (
                <span className="ml-1 text-sm text-gray-500">{unit}</span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full ${getStatusColor(status)}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        
        {subTitle && subValue && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500">{subTitle}</p>
            <p className="text-lg font-semibold text-gray-800">{subValue}</p>
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </span>
          <span className="ml-1 text-sm text-gray-600">
            vs. ayer
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
