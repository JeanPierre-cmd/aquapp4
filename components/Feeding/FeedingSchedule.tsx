import React, { useState } from 'react';
import { Clock, Plus, Edit, Trash2, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import { FeedingRecord } from './Feeding';

const FeedingSchedule: React.FC = () => {
  const [selectedCage, setSelectedCage] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [schedules, setSchedules] = useState<FeedingRecord[]>([
    {
      id: '1',
      cageId: 'A-1',
      feedType: 'Pellets Premium 6mm',
      plannedAmount: 45,
      actualAmount: 43,
      scheduledTime: new Date('2024-01-25T06:00:00'),
      actualTime: new Date('2024-01-25T06:05:00'),
      status: 'completed',
      operator: 'Juan Pérez',
      observations: 'Consumo normal, peces activos',
      fishBehavior: 'active',
      efficiency: 96
    },
    {
      id: '2',
      cageId: 'A-1',
      feedType: 'Pellets Estándar 4mm',
      plannedAmount: 50,
      scheduledTime: new Date('2024-01-25T12:00:00'),
      status: 'scheduled',
      operator: 'Ana García'
    },
    {
      id: '3',
      cageId: 'A-2',
      feedType: 'Pellets Premium 6mm',
      plannedAmount: 48,
      actualAmount: 45,
      scheduledTime: new Date('2024-01-25T06:30:00'),
      actualTime: new Date('2024-01-25T06:35:00'),
      status: 'completed',
      operator: 'Carlos Ruiz',
      fishBehavior: 'normal',
      efficiency: 94
    },
    {
      id: '4',
      cageId: 'B-1',
      feedType: 'Pellets Juvenil 3mm',
      plannedAmount: 35,
      scheduledTime: new Date('2024-01-25T18:00:00'),
      status: 'scheduled',
      operator: 'María Torres'
    },
    {
      id: '5',
      cageId: 'A-1',
      feedType: 'Suplemento Vitamínico',
      plannedAmount: 15,
      scheduledTime: new Date('2024-01-25T09:15:00'),
      status: 'missed',
      operator: 'Juan Pérez',
      observations: 'Sistema automático falló, requiere mantenimiento'
    }
  ]);

  const cages = ['all', 'A-1', 'A-2', 'A-3', 'B-1', 'B-2', 'C-1'];

  const filteredSchedules = schedules.filter(schedule => {
    const matchesCage = selectedCage === 'all' || schedule.cageId === selectedCage;
    const scheduleDate = schedule.scheduledTime.toISOString().split('T')[0];
    const matchesDate = scheduleDate === selectedDate;
    return matchesCage && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'scheduled':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'missed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <Pause className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-gray-100 text-gray-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'in-progress':
        return 'En Progreso';
      case 'scheduled':
        return 'Programada';
      case 'missed':
        return 'Perdida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const getBehaviorColor = (behavior?: string) => {
    switch (behavior) {
      case 'active':
        return 'text-green-600';
      case 'normal':
        return 'text-blue-600';
      case 'lethargic':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleAddSchedule = () => {
    setShowAddModal(true);
  };

  const handleExecuteNow = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule && confirm(`¿Ejecutar alimentación ahora para ${schedule.cageId}?\n\nTipo: ${schedule.feedType}\nCantidad: ${schedule.plannedAmount} kg`)) {
      setSchedules(prev => prev.map(s => 
        s.id === scheduleId 
          ? { ...s, status: 'in-progress' as const, actualTime: new Date() }
          : s
      ));
      
      // Simular completado después de 30 segundos
      setTimeout(() => {
        setSchedules(prev => prev.map(s => 
          s.id === scheduleId 
            ? { 
                ...s, 
                status: 'completed' as const, 
                actualAmount: schedule.plannedAmount * (0.9 + Math.random() * 0.1),
                efficiency: 90 + Math.random() * 10,
                fishBehavior: 'active' as const
              }
            : s
        ));
        alert(`✅ Alimentación completada para ${schedule.cageId}`);
      }, 3000);
      
      alert(`🐟 Iniciando alimentación para ${schedule.cageId}...\n\n⏱️ Tiempo estimado: 3 minutos\n📊 Monitoreo automático activado`);
    }
  };

  const handleEditSchedule = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      const newAmount = prompt(`Editar cantidad para ${schedule.cageId}:`, schedule.plannedAmount.toString());
      if (newAmount && !isNaN(Number(newAmount))) {
        setSchedules(prev => prev.map(s => 
          s.id === scheduleId 
            ? { ...s, plannedAmount: Number(newAmount) }
            : s
        ));
      }
    }
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta programación?')) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    }
  };

  const todayStats = {
    total: filteredSchedules.length,
    completed: filteredSchedules.filter(s => s.status === 'completed').length,
    scheduled: filteredSchedules.filter(s => s.status === 'scheduled').length,
    missed: filteredSchedules.filter(s => s.status === 'missed').length
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jaula</label>
            <select
              value={selectedCage}
              onChange={(e) => setSelectedCage(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Todas las jaulas</option>
              {cages.slice(1).map((cage) => (
                <option key={cage} value={cage}>{cage}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        
        <button
          onClick={handleAddSchedule}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Programación</span>
        </button>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total del Día</p>
              <p className="text-2xl font-bold text-blue-900">{todayStats.total}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completadas</p>
              <p className="text-2xl font-bold text-green-900">{todayStats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Programadas</p>
              <p className="text-2xl font-bold text-gray-900">{todayStats.scheduled}</p>
            </div>
            <Clock className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Perdidas</p>
              <p className="text-2xl font-bold text-red-900">{todayStats.missed}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Programación de Alimentación - {new Date(selectedDate).toLocaleDateString('es-ES')}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora / Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jaula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Alimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(schedule.status)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {schedule.scheduledTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                          {getStatusLabel(schedule.status)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{schedule.cageId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{schedule.feedType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.actualAmount ? (
                        <div>
                          <div className="font-medium">{schedule.actualAmount} kg</div>
                          <div className="text-xs text-gray-500">Planeado: {schedule.plannedAmount} kg</div>
                        </div>
                      ) : (
                        <div className="font-medium">{schedule.plannedAmount} kg</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{schedule.operator}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {schedule.efficiency ? (
                        <div>
                          <div className="font-medium text-gray-900">{schedule.efficiency.toFixed(0)}%</div>
                          {schedule.fishBehavior && (
                            <div className={`text-xs ${getBehaviorColor(schedule.fishBehavior)}`}>
                              {schedule.fishBehavior === 'active' ? 'Activos' :
                               schedule.fishBehavior === 'normal' ? 'Normal' :
                               schedule.fishBehavior === 'lethargic' ? 'Letárgicos' : 'No observado'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {schedule.status === 'scheduled' && (
                        <button
                          onClick={() => handleExecuteNow(schedule.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Ejecutar Ahora
                        </button>
                      )}
                      <button
                        onClick={() => handleEditSchedule(schedule.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSchedules.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No hay alimentaciones programadas para esta fecha y jaula</p>
            <button
              onClick={handleAddSchedule}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Programar Primera Alimentación
            </button>
          </div>
        )}
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
          <div className="absolute inset-x-4 top-4 bottom-4 bg-white rounded-lg shadow-xl overflow-hidden md:inset-x-auto md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nueva Programación de Alimentación</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jaula</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    {cages.slice(1).map((cage) => (
                      <option key={cage} value={cage}>{cage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    defaultValue="06:00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Alimento</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Pellets Premium 6mm</option>
                  <option>Pellets Estándar 4mm</option>
                  <option>Pellets Juvenil 3mm</option>
                  <option>Suplemento Vitamínico</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad (kg)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operador</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Juan Pérez</option>
                    <option>Ana García</option>
                    <option>Carlos Ruiz</option>
                    <option>María Torres</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  alert('✅ Nueva programación de alimentación creada exitosamente');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Programar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedingSchedule;
