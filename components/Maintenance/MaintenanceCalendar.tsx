import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MaintenanceTask } from '../../types';
import { parseDateString } from '../../utils/dateHelpers'; // Import date helper

interface MaintenanceCalendarProps {
  tasks: MaintenanceTask[];
  selectedYear: number; // Prop to receive the selected year from parent
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ tasks, selectedYear }) => {
  const currentDate = new Date();
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState(selectedYear); // Initialize with selectedYear

  useEffect(() => {
    // When selectedYear from parent changes, update displayYear
    setDisplayYear(selectedYear);
    // Optionally, reset month to current month or first month of the quarter
    // For now, let's keep it simple and just update the year.
  }, [selectedYear]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay(); // 0 for Sunday, 1 for Monday

  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const taskDate = parseDateString(task.date, displayYear); // Use displayYear for parsing
      return taskDate && taskDate.getDate() === day && taskDate.getMonth() === displayMonth;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'responsible':
        return 'bg-orange-500';
      case 'broken':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handlePrevMonth = () => {
    setDisplayMonth(prevMonth => {
      if (prevMonth === 0) { // If January, go to December of previous year
        setDisplayYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setDisplayMonth(prevMonth => {
      if (prevMonth === 11) { // If December, go to January of next year
        setDisplayYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[displayMonth]} {displayYear}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const dayTasks = day ? getTasksForDay(day) : [];
          
          return (
            <div
              key={index}
              className={`min-h-[80px] p-1 border border-gray-100 ${
                day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              }`}
            >
              {day && (
                <>
                  <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded text-white truncate ${getStatusColor(task.status)}`}
                        title={`${task.task} - ${task.responsible}`}
                      >
                        {task.task}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayTasks.length - 2} más
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Completada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Pendiente</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Responsable</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Rompletada</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCalendar;
