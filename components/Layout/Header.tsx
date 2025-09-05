import React, { useState } from 'react';
import { Waves, Settings, User, Home, LogOut } from 'lucide-react';
import { NotificationBell } from '../../modules/notifications/components/Bell';
import SettingsPanel from '../../modules/topbar/SettingsPanel';
import UserMenu from '../../modules/topbar/UserMenu';
import { useAuth } from '../../hooks/useAuth'; // Importar useAuth

interface HeaderProps {
  onBackToHome?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onBackToHome, 
  onLogout
}) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const { user } = useAuth(); // Obtener el usuario del contexto de autenticación

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Waves className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">AquApp</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                title="Volver al inicio"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Inicio</span>
              </button>
            )}
            
            <NotificationBell />

            <div className="relative">
              <button 
                onClick={() => { setOpenUser(false); setOpenSettings(v => !v); }}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                title="Configuración"
                aria-label="Herramientas"
              >
                <Settings className="h-5 w-5" />
              </button>
              {openSettings && <SettingsPanel onClose={() => setOpenSettings(false)} />}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => { setOpenSettings(false); setOpenUser(v => !v); }}
                className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                title="Perfil de Usuario"
                aria-label="Usuario"
              >
                <User className="h-6 w-6" />
              </button>
              {openUser && (
                <UserMenu
                  user={user} // Pasar el objeto user real
                  onClose={() => setOpenUser(false)}
                  onAction={(a) => {
                    if (a === 'profile') { /* Navegar a página de perfil */ }
                    if (a === 'logout') { onLogout?.(); }
                    setOpenUser(false);
                  }}
                />
              )}
            </div>
            
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
