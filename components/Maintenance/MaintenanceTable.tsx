import React from 'react';
import { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { MaintenanceTask } from '../../types';

interface MaintenanceTableProps {
  tasks: MaintenanceTask[];
  onUpdateTask: (tasks: MaintenanceTask[]) => void;
}

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ tasks, onUpdateTask }) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const handleStatusChange = (taskId: string, newStatus: MaintenanceTask['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    onUpdateTask(updatedTasks);
  };

  const handleEditObservations = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newObservations = prompt('Editar observaciones:', task.observations);
      if (newObservations !== null) {
        const updatedTasks = tasks.map(t => 
          t.id === taskId ? { ...t, observations: newObservations } : t
        );
        onUpdateTask(updatedTasks);
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      onUpdateTask(updatedTasks);
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'responsible':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'broken':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      case 'responsible':
        return 'Responsable';
      case 'broken':
        return 'Rompletada';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'responsible':
        return 'bg-orange-100 text-orange-800';
      case 'broken':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarea
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observaciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jaula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.task}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as MaintenanceTask['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="completed">Completada</option>
                      <option value="responsible">Responsable</option>
                      <option value="broken">Rompletada</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.responsible}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEditObservations(task.id)}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {task.observations}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.cageId && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {task.cageId}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditObservations(task.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;
