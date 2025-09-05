import React, { useState } from 'react';
import { Download, Calendar, Filter, BarChart3 } from 'lucide-react';
import { PDFReportGenerator } from '../../utils/pdfGenerator';

const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState('operational');
  const [dateRange, setDateRange] = useState('week');
  const [selectedCages, setSelectedCages] = useState<string[]>(['all']);

  const reportTypes = [
    { id: 'operational', name: 'Reporte Operacional', description: 'Estado general de operaciones' },
    { id: 'water-quality', name: 'Calidad del Agua', description: 'Análisis de parámetros del agua' },
    { id: 'fish-health', name: 'Salud de Peces', description: 'Estado sanitario y poblacional' },
    { id: 'maintenance', name: 'Mantenimiento', description: 'Tareas y programación de mantenimiento' },
    { id: 'structural', name: 'Análisis Estructural', description: 'Evaluación de estructuras y equipos' }
  ];

  const cages = ['A-1', 'A-2', 'A-3', 'B-1', 'B-2', 'C-1', 'C-2'];

  const handleCageSelection = (cageId: string) => {
    if (cageId === 'all') {
      setSelectedCages(['all']);
    } else {
      setSelectedCages(prev => {
        const filtered = prev.filter(id => id !== 'all');
        if (filtered.includes(cageId)) {
          return filtered.filter(id => id !== cageId);
        } else {
          return [...filtered, cageId];
        }
      });
    }
  };

  const generateReport = () => {
    const reportName = reportTypes.find(t => t.id === reportType)?.name || 'Reporte';
    
    alert(`Generando ${reportName} en PDF...`);
    
    setTimeout(() => {
      // Generar reporte básico según el tipo
      const generator = new PDFReportGenerator();
      
      if (reportType === 'water-quality') {
        generator.generateWaterQualityReport({
          reportDate: new Date(),
          parameters: [
            { name: 'Temperatura', value: 14.5, unit: '°C', status: 'normal', minRange: 12, maxRange: 18 },
            { name: 'Oxígeno', value: 8.2, unit: 'mg/L', status: 'normal', minRange: 6, maxRange: 12 },
            { name: 'pH', value: 7.8, unit: '', status: 'warning', minRange: 7.0, maxRange: 8.5 }
          ],
          observations: `Reporte generado para ${selectedCages.includes('all') ? 'todas las jaulas' : selectedCages.join(', ')}`
        });
      } else if (reportType === 'maintenance') {
        generator.generateMaintenanceReport({
          reportDate: new Date(),
          period: { start: new Date(2024, 0, 1), end: new Date() },
          tasks: [
            { id: '1', date: '2024-01-15', task: 'Inspección de redes', status: 'completed', responsible: 'Juan Pérez', observations: 'Completada sin observaciones' },
            { id: '2', date: '2024-01-20', task: 'Mantenimiento de boyas', status: 'pending', responsible: 'Ana García', observations: 'Programada' }
          ],
          summary: { totalTasks: 2, completedTasks: 1, pendingTasks: 1, completionRate: 50 }
        });
      } else {
        // Reporte genérico
        const doc = new (window as any).jsPDF();
        doc.text(`${reportName}`, 20, 20);
        doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 40);
        doc.text(`Tipo: ${reportType}`, 20, 60);
        doc.text(`Período: ${dateRange}`, 20, 80);
        doc.text(`Jaulas: ${selectedCages.join(', ')}`, 20, 100);
        doc.save(`${reportType}-report-${new Date().toISOString().split('T')[0]}.pdf`);
      }
      
      alert('Reporte PDF generado y descargado exitosamente');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Reporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                reportType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-1">{type.name}</h4>
              <p className="text-sm text-gray-600">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Range */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Período de Tiempo</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { id: 'day', name: 'Último día' },
              { id: 'week', name: 'Última semana' },
              { id: 'month', name: 'Último mes' },
              { id: 'quarter', name: 'Último trimestre' },
              { id: 'custom', name: 'Rango personalizado' }
            ].map((range) => (
              <label key={range.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="dateRange"
                  value={range.id}
                  checked={dateRange === range.id}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{range.name}</span>
              </label>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cage Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Jaulas</h3>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedCages.includes('all')}
                onChange={() => handleCageSelection('all')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">Todas las jaulas</span>
            </label>
            
            <div className="border-t pt-3">
              <div className="grid grid-cols-2 gap-2">
                {cages.map((cage) => (
                  <label key={cage} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedCages.includes(cage)}
                      onChange={() => handleCageSelection(cage)}
                      disabled={selectedCages.includes('all')}
                      className="text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="text-gray-700">{cage}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa del Reporte</h3>
        
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Reporte: <span className="font-medium">{reportTypes.find(t => t.id === reportType)?.name}</span>
          </p>
          <p className="text-sm text-gray-500">
            Período: {dateRange === 'custom' ? 'Rango personalizado' : 
              dateRange === 'day' ? 'Último día' :
              dateRange === 'week' ? 'Última semana' :
              dateRange === 'month' ? 'Último mes' : 'Último trimestre'}
          </p>
          <p className="text-sm text-gray-500">
            Jaulas: {selectedCages.includes('all') ? 'Todas' : selectedCages.join(', ')}
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generateReport}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-lg font-medium"
        >
          <Download className="h-5 w-5" />
          <span>Generar Reporte</span>
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;
