import React, { useState, useEffect, useCallback } from 'react';
import MaintenanceTable from './MaintenanceTable';
import MaintenanceCalendar from './MaintenanceCalendar';
import { MaintenanceTask } from '../../types';
import { Calendar, List, Download, Plus } from 'lucide-react';
import { PDFReportGenerator, MaintenanceReportData } from '../../utils/pdfGenerator';
import { parseDateString, isDateInQuarter } from '../../utils/dateHelpers'; // Import date helpers

const initialMaintenanceTasks: MaintenanceTask[] = [
  {
    id: '1',
    date: '2 febrero',
    task: 'Inspección de redes',
    status: 'pending',
    responsible: 'Juan Pérez',
    observations: 'Programada',
    cageId: 'A-1'
  },
  {
    id: '2',
    date: '6 febrero',
    task: 'Limpieza de boyas',
    status: 'completed',
    responsible: 'Ana Gómez',
    observations: 'Ninguna',
    cageId: 'A-2'
  },
  {
    id: '3',
    date: '15 febrero',
    task: 'Cambio de anclajes',
    status: 'responsible',
    responsible: 'Carlos Ruiz',
    observations: 'Requiere revisión',
    cageId: 'B-1'
  },
  {
    id: '4',
    date: '20 marzo',
    task: 'Revisión de jaulas',
    status: 'pending',
    responsible: 'Laura Torres',
    observations: 'Programada',
    cageId: 'A-3'
  },
  {
    id: '5',
    date: '5 marzo',
    task: 'Inspección de redes',
    status: 'broken',
    responsible: 'Juan Pérez',
    observations: 'Ninguna',
    cageId: 'C-1'
  },
  {
    id: '6',
    date: '10 marzo',
    task: 'Limpieza de boyas',
    status: 'completed',
    responsible: 'Ana Gómez',
    observations: 'Programada',
    cageId: 'B-2'
  },
  {
    id: '7',
    date: '18 marzo',
    task: 'Revisión de jaulas',
    status: 'completed',
    responsible: 'Laura Torres',
    observations: 'Requiere revisión',
    cageId: 'A-1'
  },
  {
    id: '8',
    date: '10 abril',
    task: 'Calibración de sensores',
    status: 'pending',
    responsible: 'Pedro Sánchez',
    observations: 'Programada para Q2',
    cageId: 'C-2'
  },
  {
    id: '9',
    date: '22 mayo',
    task: 'Mantenimiento de generadores',
    status: 'completed',
    responsible: 'Sofía Castro',
    observations: 'Realizado sin incidencias',
    cageId: 'B-3'
  },
  {
    id: '10',
    date: '5 junio',
    task: 'Reemplazo de luces subacuáticas',
    status: 'responsible',
    responsible: 'Miguel Torres',
    observations: 'Pendiente de material',
    cageId: 'A-4'
  }
];

const Maintenance: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [selectedQuarter, setSelectedQuarter] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [tasks, setTasks] = useState<MaintenanceTask[]>(initialMaintenanceTasks);
  const [filteredTasks, setFilteredTasks] = useState<MaintenanceTask[]>(initialMaintenanceTasks); // Initialize with all tasks

  const handleConsult = useCallback(() => {
    const year = parseInt(selectedYear, 10);
    const quarter = parseInt(selectedQuarter, 10);

    const newFilteredTasks = tasks.filter(task => {
      const taskDate = parseDateString(task.date, year);
      if (!taskDate) return false;

      return isDateInQuarter(taskDate, year, quarter);
    });

    setFilteredTasks(newFilteredTasks);
  }, [tasks, selectedQuarter, selectedYear]);

  // Re-filter tasks whenever the main tasks list, quarter, or year changes
  useEffect(() => {
    handleConsult();
  }, [handleConsult]);

  const handleAddNewTask = () => {
    const task = prompt('Descripción de la tarea:');
    const responsible = prompt('Responsable:');
    const date = prompt('Fecha (ej: 25 febrero):');
    const cageId = prompt('ID de jaula (opcional):');
    
    if (task && responsible && date) {
      const newTask: MaintenanceTask = {
        id: Date.now().toString(),
        date,
        task,
        status: 'pending',
        responsible,
        observations: 'Nueva tarea',
        cageId: cageId || undefined
      };
      
      setTasks(prev => [...prev, newTask]);
      alert('Nueva tarea de mantenimiento agregada');
    }
  };

  const handleExportPDF = useCallback(() => {
    const year = parseInt(selectedYear, 10);
    const quarter = parseInt(selectedQuarter, 10);
    const startMonth = (quarter - 1) * 3; // 0, 3, 6, 9
    const endMonth = startMonth + 2;     // 2, 5, 8, 11

    const reportData: MaintenanceReportData = {
      reportDate: new Date(),
      period: {
        start: new Date(year, startMonth, 1),
        end: new Date(year, endMonth + 1, 0) // Last day of the end month
      },
      tasks: filteredTasks, // Use filteredTasks for the report
      summary: {
        totalTasks: filteredTasks.length,
        completedTasks: filteredTasks.filter(t => t.status === 'completed').length,
        pendingTasks: filteredTasks.filter(t => t.status === 'pending').length,
        completionRate: filteredTasks.length > 0 ? (filteredTasks.filter(t => t.status === 'completed').length / filteredTasks.length) * 100 : 0
      }
    };
    
    const generator = new PDFReportGenerator();
    generator.generateMaintenanceReport(reportData);
  }, [filteredTasks, selectedQuarter, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mantenimiento</h1>
          <p className="text-gray-600">Gestión y seguimiento de tareas de mantenimiento</p>
        </div>
        
        <div className="flex items-center space-x-3">
            <button 
              onClick={handleAddNewTask}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
            <Plus className="h-4 w-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Trimestre</label>
              <select 
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Año</label>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4 inline mr-1" />
                Tabla
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-1" />
                Calendario
              </button>
            </div>
            
            <button 
              onClick={handleExportPDF}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <MaintenanceTable tasks={filteredTasks} onUpdateTask={setTasks} />
      ) : (
        <MaintenanceCalendar tasks={filteredTasks} selectedYear={parseInt(selectedYear, 10)} />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end">
        <button 
          onClick={handleConsult}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Consultar
        </button>
      </div>
    </div>
  );
};

export default Maintenance;
