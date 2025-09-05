import React from 'react';
import { AlertTriangle, Info, CheckCircle, Settings } from 'lucide-react';
import { NotificationType } from '../types';

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
}

const iconMap: Record<NotificationType, React.ElementType> = {
  alert: AlertTriangle,
  info: Info,
  success: CheckCircle,
  system: Settings,
};

const colorMap: Record<NotificationType, string> = {
  alert: 'text-red-500',
  info: 'text-blue-500',
  success: 'text-green-500',
  system: 'text-gray-500',
};

const NotificationIcon: React.FC<NotificationIconProps> = ({ type, className = 'h-5 w-5' }) => {
  const IconComponent = iconMap[type];
  const iconColor = colorMap[type];

  return <IconComponent className={`${className} ${iconColor}`} />;
};

export default NotificationIcon;
