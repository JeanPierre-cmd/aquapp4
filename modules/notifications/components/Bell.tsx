import React, { useState, useRef, useEffect } from 'react';
import { Bell as BellIcon } from 'lucide-react';
import { useNotifications } from '../useNotifications';
import { List } from './List';
import { ToastHost } from './ToastHost';
import { config } from '../../../shared/env';

// En una app real, esto vendría de un router context (ej. useNavigate de react-router-dom)
const navigatePlaceholder = (path: string) => {
  alert(`Navegando (simulado) a: ${path}`);
  console.log(`Navigating to: ${path}`);
};

interface NotificationBellProps {
  theme?: 'light' | 'dark';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ theme = 'light' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useNotifications();
  const bellRef = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter(item => !item.read).length;

  const handleToggle = () => setIsOpen(prev => !prev);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!config.notifications.enabled) {
    return null;
  }

  const themeClasses = {
    light: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-blue-500',
    dark: 'text-blue-100 hover:text-white hover:bg-white/20 focus:ring-white'
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-full focus:outline-none focus:ring-2 transition-colors ${themeClasses[theme]}`}
        aria-label={`Notificaciones (${unreadCount} no leídas)`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <List 
        isOpen={isOpen} 
        onClose={handleClose}
        navigate={navigatePlaceholder}
      />
      <ToastHost />
    </div>
  );
};
