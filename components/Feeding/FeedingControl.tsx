import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Gauge, 
  Thermometer, 
  Activity,
  Camera,
  Wifi,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface FeedingSystem {
  id: string;
  cageId: string;
  name: string;
  status: 'idle' | 'feeding' | 'maintenance' | 'error';
  currentRate: number; // kg/min
  totalDispensed: number; // kg today
  lastMaintenance: Date;
  batteryLevel: number;
  connectivity: 'online' | 'offline' | 'weak';
  sensors: {
    temperature: number;
    humidity: number;
    feedLevel: number; // % remaining
  };
}

const FeedingControl: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [manualMode, setManualMode] = useState(false);

  const [systems, setSystems] = useState<FeedingSystem[]>([
    {
      id: 'FS-A1-01',
      cageId: 'A-1',
      name: 'Alimentador Norte A1',
      status: 'idle',
      currentRate: 0,
      totalDispensed: 125.5,
      lastMaintenance: new Date('2024-01-20'),
      batteryLevel: 87,
      connectivity: 'online',
      sensors: {
        temperature: 18.5,
        humidity: 65,
        feedLevel: 78
      }
    },
    {
      id: 'FS-A1-02',
      cageId: 'A-1',
      name: 'Alimentador Sur A1',
      status: 'feeding',
      currentRate: 2.3,
      totalDispensed: 98.2,
      lastMaintenance: new Date('2024-01-18'),
      batteryLevel: 92,
      connectivity: 'online',
      sensors: {
        temperature: 19.2,
        humidity: 62,
        feedLevel: 45
      }
    },
    {
      id: 'FS-A2-01',
      cageId: 'A-2',
      name: 'Alimentador Principal A2',
      status: 'idle',
      currentRate: 0,
      totalDispensed: 156.8,
      lastMaintenance: new Date('2024-01-22'),
      batteryLevel: 76,
      connectivity: 'weak',
      sensors: {
        temperature: 17.8,
        humidity: 68,
        feedLevel: 23
      }
    },
    {
      id: 'FS-B1-01',
      cageId: 'B-1',
      name: 'Alimentador B1',
      status: 'maintenance',
      currentRate: 0,
      totalDispensed: 0,
      lastMaintenance: new Date('2024-01-15'),
      batteryLevel: 45,
      connectivity: 'offline',
      sensors: {
        temperature: 16.5,
        humidity: 70,
        feedLevel: 0
      }
    }
  ]);

  const filteredSystems = selectedSystem === 'all' 
    ? systems 
    : systems.filter(s => s.cageId === selectedSystem);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-100 text-gray-800';
      case 'feeding':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle':
        return <Pause className="h-5 w-5 text-gray-500" />;
      case 'feeding':
        return <Play className="h-5 w-5 text-green-500" />;
      case 'maintenance':
        return <Settings className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Pause className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConnectivityColor = (connectivity: string) => {
    switch (connectivity) {
      case 'online':
        return 'text-green-600';
      case 'weak':
        return 'text-yellow-600';
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleStartFeeding = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (system) {
      const amount = prompt(`Iniciar alimentación en ${system.name}\n\nIngrese cantidad (kg):`, '25');
      if (amount && !isNaN(Number(amount))) {
        setSystems(prev => prev.map(s => 
          s.id === systemId 
            ? { ...s, status: 'feeding' as const, currentRate: 2.5 }
            : s
        ));
        alert(`🐟 Alimentación iniciada en ${system.name}\n\nCantidad: ${amount} kg\nVelocidad: 2.5 kg/min\nTiempo estimado: ${(Number(amount) / 2.5).toFixed(1)} minutos`);
      }
    }
  };

  const handleStopFeeding = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (system && confirm(`¿Detener alimentación en ${system.name}?`)) {
      setSystems(prev => prev.map(s => 
        s.id === systemId 
          ? { ...s, status: 'idle' as const, currentRate: 0 }
          : s
      ));
      alert(`⏹️ Alimentación detenida en ${system.name}`);
    }
  };

  const handleEmergencyStop = () => {
    if (confirm('¿PARADA DE EMERGENCIA de todos los sistemas?')) {
      setSystems(prev => prev.map(s => ({ 
        ...s, 
        status: 'idle' as const, 
        currentRate: 0 
      })));
      alert('🚨 PARADA DE EMERGENCIA EJECUTADA\n\nTodos los sistemas detenidos');
    }
  };

  const handleSystemMaintenance = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (system && confirm(`¿Poner ${system.name} en modo mantenimiento?`)) {
      setSystems(prev => prev.map(s => 
        s.id === systemId 
          ? { ...s, status: 'maintenance' as const, currentRate: 0 }
          : s
      ));
      alert(`🔧 ${system.name} en modo mantenimiento\n\nSistema bloqueado para operación`);
    }
  };

  const handleViewCamera = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    alert(`📹 Conectando con cámara de ${system?.name}...\n\n🔴 Transmisión en vivo\n📊 Monitoreo de comportamiento de peces\n⚙️ Vista del dispensador`);
  };

  const handleCalibrate = (systemId: string) => {
    const system = systems.find(s => s.id === systemId);
    if (system && confirm(`¿Iniciar calibración de ${system.name}?\n\nEsto tomará aproximadamente 5 minutos.`)) {
      alert(`⚙️ Calibración iniciada en ${system.name}\n\n🔧 Verificando sensores\n⚖️ Calibrando báscula\n🎯 Ajustando precisión de dispensado`);
    }
  };

  const activeSystems = systems.filter(s => s.status === 'feeding').length;
  const totalDispensedToday = systems.reduce((sum, s) => sum + s.totalDispensed, 0);
  const averageBattery = systems.reduce((sum, s) => sum + s.batteryLevel, 0) / systems.length;

  return (
    <div className="space-y-6">
      {/* Control Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sistemas Activos</p>
              <p className="text-2xl font-bold text-green-600">{activeSystems}</p>
              <p className="text-sm text-gray-500">de {systems.length} total</p>
            </div>
            <Play className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dispensado Hoy</p>
              <p className="text-2xl font-bold text-blue-600">{totalDispensedToday.toFixed(1)} kg</p>
              <p className="text-sm text-gray-500">Acumulado</p>
            </div>
            <Gauge className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Batería Promedio</p>
              <p className="text-2xl font-bold text-purple-600">{averageBattery.toFixed(0)}%</p>
              <p className="text-sm text-gray-500">Sistemas IoT</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conectividad</p>
              <p className="text-2xl font-bold text-green-600">
                {systems.filter(s => s.connectivity === 'online').length}/{systems.length}
              </p>
              <p className="text-sm text-gray-500">En línea</p>
            </div>
            <Wifi className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">Panel de Control</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filtrar por jaula:</label>
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Todos los sistemas</option>
                <option value="A-1">Jaula A-1</option>
                <option value="A-2">Jaula A-2</option>
                <option value="B-1">Jaula B-1</option>
                <option value="B-2">Jaula B-2</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="manual-mode"
                checked={manualMode}
                onChange={(e) => setManualMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="manual-mode" className="text-sm font-medium text-gray-700">
                Modo Manual
              </label>
            </div>
            <button
              onClick={handleEmergencyStop}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Square className="h-4 w-4" />
              <span>Parada Emergencia</span>
            </button>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSystems.map((system) => (
            <div key={system.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              {/* System Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(system.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{system.name}</h4>
                    <p className="text-sm text-gray-600">Jaula {system.cageId} • ID: {system.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                    {system.status === 'idle' ? 'Inactivo' :
                     system.status === 'feeding' ? 'Alimentando' :
                     system.status === 'maintenance' ? 'Mantenimiento' : 'Error'}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${
                    system.connectivity === 'online' ? 'bg-green-500' :
                    system.connectivity === 'weak' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>

              {/* System Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{system.currentRate}</p>
                  <p className="text-xs text-gray-600">kg/min</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{system.totalDispensed}</p>
                  <p className="text-xs text-gray-600">kg hoy</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{system.batteryLevel}%</p>
                  <p className="text-xs text-gray-600">batería</p>
                </div>
              </div>

              {/* Sensors */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-blue-500" />
                  <span>{system.sensors.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>{system.sensors.humidity}% HR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gauge className="h-4 w-4 text-purple-500" />
                  <span>{system.sensors.feedLevel}% alimento</span>
                </div>
              </div>

              {/* Feed Level Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Nivel de alimento</span>
                  <span className="font-medium">{system.sensors.feedLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      system.sensors.feedLevel > 50 ? 'bg-green-500' :
                      system.sensors.feedLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${system.sensors.feedLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {system.status === 'idle' && (
                  <button
                    onClick={() => handleStartFeeding(system.id)}
                    disabled={system.connectivity === 'offline'}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    <Play className="h-4 w-4" />
                    <span>Iniciar</span>
                  </button>
                )}
                
                {system.status === 'feeding' && (
                  <button
                    onClick={() => handleStopFeeding(system.id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Square className="h-4 w-4" />
                    <span>Detener</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleViewCamera(system.id)}
                  disabled={system.connectivity === 'offline'}
                  className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  <Camera className="h-4 w-4" />
                  <span>Cámara</span>
                </button>
                
                <button
                  onClick={() => handleCalibrate(system.id)}
                  disabled={system.status !== 'idle'}
                  className="border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Calibrar</span>
                </button>
                
                <button
                  onClick={() => handleSystemMaintenance(system.id)}
                  disabled={system.status === 'feeding'}
                  className="border border-yellow-300 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Mantención</span>
                </button>
              </div>

              {/* Alerts */}
              {system.sensors.feedLevel < 20 && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-800">Nivel de alimento bajo - Recargar pronto</span>
                  </div>
                </div>
              )}
              
              {system.connectivity === 'weak' && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-yellow-800">Señal débil - Verificar conectividad</span>
                  </div>
                </div>
              )}
              
              {system.connectivity === 'offline' && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-800">Sistema desconectado - Verificar comunicación</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedingControl;
