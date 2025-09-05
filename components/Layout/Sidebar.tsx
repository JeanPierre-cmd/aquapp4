import React from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Fish, 
  Package, 
  BarChart3, 
  AlertTriangle,
  MapPin,
  Building2,
  Factory,
  FileText,
  Wrench,
  Bell,
  Target,
  ClipboardList,
  Ship
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { MODULES, ModuleId } from '../../src/constants/modules';
import { useConcessionStore } from '../../stores/concessionStore';

interface SidebarProps {
  activeModule: ModuleId;
  onModuleChange: (module: ModuleId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  onModuleChange, 
}) => {
  const { user } = useAuth();
  const { selectedConcession } = useConcessionStore();

  const handleModuleChange = (module: ModuleId) => {
    onModuleChange(module);
  };

  const menuSections = [
    {
      title: 'General',
      items: [
        { id: MODULES.DASHBOARD, name: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Gestión de Centros',
      icon: Building2,
      items: [
        { id: MODULES.CONCESIONES, name: 'Concesiones', icon: MapPin },
      ]
    },
    {
      title: 'Operaciones',
      icon: Factory,
      items: [
        { id: MODULES.CAGES, name: 'Infraestructura', icon: Ship },
        { id: MODULES.MODELS, name: 'Visor 3D/2D', icon: BarChart3 },
        { id: MODULES.WATER_QUALITY, name: 'Calidad del Agua', icon: Droplets },
        { id: MODULES.FISH_HEALTH, name: 'Salud de Peces', icon: Fish },
        { id: MODULES.FEEDING, name: 'Alimentación', icon: Package },
        { id: MODULES.MAINTENANCE, name: 'Mantenimiento', icon: ClipboardList }
      ]
    },
    {
      title: 'Análisis',
      icon: FileText,
      items: [
        { id: MODULES.REPORTS, name: 'Reportes', icon: BarChart3 },
        { id: MODULES.ALERTS, name: 'Alertas', icon: AlertTriangle }
      ]
    },
    {
      title: 'Soporte',
      icon: Target,
      items: [
        { id: MODULES.SUPPORT, name: 'Centro de Soporte', icon: Target },
        { id: MODULES.NOTIFICATIONS, name: 'Notificaciones', icon: Bell },
      ]
    }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 min-h-screen h-screen flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">AquaApp</h1>
      </div>

      <div className="p-4 border-b border-gray-800">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Concesión Activa</h4>
        {selectedConcession ? (
          <div className="bg-surface/50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-md">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text truncate">{selectedConcession.name}</p>
                <p className="text-xs text-textSecondary flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  {selectedConcession.location}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500 bg-surface/50 p-4 rounded-lg">
            <p>Ninguna seleccionada</p>
          </div>
        )}
      </div>

      <nav className="mt-6 flex-grow overflow-y-auto pb-16">
        <div className="px-4">
          <div className="space-y-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="flex items-center mb-3 px-3">
                  {section.icon && <section.icon className="mr-2 h-4 w-4 text-gray-400" />}
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleModuleChange(item.id)}
                          className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 ${
                            isActive
                              ? 'bg-primary text-white shadow-lg'
                              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                          }`}
                        >
                          <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
