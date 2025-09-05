import React, { useState, Suspense } from 'react';
import LandingPage from './components/Landing/LandingPage';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import WaterQuality from './components/WaterQuality/WaterQuality';
import FishHealth from './components/FishHealth/FishHealth';
import Visualization3D from './components/Visualization3D/Visualization3D';
import Reports from './components/Reports/Reports';
import Maintenance from './components/Maintenance/Maintenance';
import AlertsModule from './components/Alerts/AlertsModule';
import CageManagement from './components/CageManagement/CageManagement';
import Infrastructure from './components/Infrastructure/Infrastructure';
import StructuralHistory from './components/Structural/StructuralHistory';
import ModelsPage from './components/ModelViewer/ModelsPage';
import CenterComparison from './components/Comparative/CenterComparison';
import LoginPage from './components/Auth/LoginPage';
import SupportCenter from './components/Support/SupportCenter';
import LoyaltyProgram from './components/Gamification/LoyaltyProgram';
import SmartNotifications from './components/Notifications/SmartNotifications';
import Feeding from './components/Feeding/Feeding';
import ConcessionsModule from './components/Concessions/ConcessionsModule'; // Importar nuevo módulo
import { config } from './shared/env';
import ToastContainer from './modules/notifications/components/ToastContainer';
import { MODULES, ModuleId } from './constants/modules';

// Lazy load del nuevo componente
const ImportarPage = React.lazy(() => import('./features/import/ImportarPage'));

function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>(MODULES.DASHBOARD);
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar sesión persistente al cargar la aplicación
  React.useEffect(() => {
    const savedSession = localStorage.getItem('aquapp_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData.rememberMe && sessionData.email === 'jean.toledo@pucv.cl') {
          const loginTime = new Date(sessionData.loginTime);
          const now = new Date();
          const daysDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysDiff < 30) {
            setIsAuthenticated(true);
            setShowLanding(false);
          } else {
            localStorage.removeItem('aquapp_session');
          }
        }
      } catch (error) {
        localStorage.removeItem('aquapp_session');
      }
    }
  }, []);

  const handleLogout = () => {
    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
      localStorage.removeItem('aquapp_session');
      setIsAuthenticated(false);
      setActiveModule(MODULES.DASHBOARD);
    }
  };

  const handleBackToHome = () => {
    localStorage.removeItem('aquapp_session');
    setShowLanding(true);
    setIsAuthenticated(false);
    setActiveModule(MODULES.DASHBOARD);
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={() => setIsAuthenticated(true)}
        onBackToLanding={handleBackToHome}
      />
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case MODULES.IMPORTAR:
        return (
          <Suspense fallback={<div className="p-4 text-center text-gray-500">Cargando módulo de importación...</div>}>
            <ImportarPage />
          </Suspense>
        );
      case MODULES.DASHBOARD:
        return <Dashboard onNavigateToReports={() => setActiveModule(MODULES.REPORTS)} />;
      case MODULES.CONCESIONES: // Nuevo caso para el módulo
        return <ConcessionsModule />;
      case MODULES.WATER_QUALITY:
        return <WaterQuality />;
      case MODULES.FISH_HEALTH:
        return <FishHealth />;
      case MODULES.VISUALIZATION_3D:
        return <Visualization3D />;
      case MODULES.REPORTS:
        return <Reports />;
      case MODULES.MAINTENANCE:
        return <Maintenance />;
      case MODULES.ALERTS:
        return <AlertsModule />;
      case MODULES.FEEDING:
        return <Feeding />;
      case MODULES.CAGES:
        return <Infrastructure />;
      case MODULES.STRUCTURAL_HISTORY:
        return <StructuralHistory />;
      case MODULES.MODELS:
        return <ModelsPage />;
      case MODULES.CENTER_COMPARISON:
        return <CenterComparison />;
      case MODULES.SUPPORT:
        return <SupportCenter />;
      case MODULES.LOYALTY:
        return <LoyaltyProgram />;
      case MODULES.NOTIFICATIONS:
        return <SmartNotifications />;
      default:
        return <Dashboard onNavigateToReports={() => setActiveModule(MODULES.REPORTS)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        onBackToHome={handleBackToHome}
        onLogout={handleLogout}
      />
      
      <div className="flex min-h-screen">
        <Sidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
        
        <main className="flex-1 p-8 ml-64 min-h-screen">
          {renderActiveModule()}
        </main>
      </div>

      {/* INSERCIÓN DEL CONTENEDOR DE TOASTS */}
      {config.notifications.enabled && config.notifications.toastsEnabled && <ToastContainer />}
    </div>
  );
}

export default App;
