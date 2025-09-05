import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Filter } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  generatedDate: Date;
  size: string;
  status: 'ready' | 'generating' | 'error';
  cages: string[];
}

const ReportViewer: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([

    {
      id: '1',
      name: 'Reporte Operacional - Enero 2024',
      type: 'Operacional',
      generatedDate: new Date('2024-01-15'),
      size: '2.3 MB',
      status: 'ready',
      cages: ['A-1', 'A-2', 'B-1']
    },
    {
      id: '2',
      name: 'Análisis Calidad del Agua - Semana 2',
      type: 'Calidad del Agua',
      generatedDate: new Date('2024-01-14'),
      size: '1.8 MB',
      status: 'ready',
      cages: ['Todas']
    },
    {
      id: '3',
      name: 'Reporte de Mantenimiento - Q1 2024',
      type: 'Mantenimiento',
      generatedDate: new Date('2024-01-13'),
      size: '3.1 MB',
      status: 'generating',
      cages: ['A-1', 'A-3', 'C-1']
    }
  ]);

  const handleViewReport = (report: Report) => {
    if (report.status === 'ready') {
      alert(`Abriendo reporte: ${report.name}`);
      // Aquí se abriría el visor de reportes
    } else {
      alert('El reporte aún no está listo');
    }
  };

  const handleDownloadReport = (report: Report) => {
    if (report.status === 'ready') {
      const data = {
        reportId: report.id,
        name: report.name,
        type: report.type,
        generatedDate: report.generatedDate,
        cages: report.cages,
        downloadedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Reporte descargado exitosamente');
    }
  };

  const handleRefreshReports = () => {
    alert('Actualizando lista de reportes...');
    // Simular actualización
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.status === 'generating' 
          ? { ...report, status: 'ready' as const }
          : report
      ));
      alert('Lista de reportes actualizada');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Listo';
      case 'generating':
        return 'Generando...';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Último mes</option>
                <option>Últimos 3 meses</option>
                <option>Último año</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Todos los tipos</option>
                <option>Operacional</option>
                <option>Calidad del Agua</option>
                <option>Mantenimiento</option>
              </select>
            </div>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            onClick={handleRefreshReports}
            Actualizar
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Reportes Disponibles</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedReport?.id === report.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-600">{report.type}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{report.generatedDate.toLocaleDateString('es-ES')}</span>
                        <span>{report.size}</span>
                        <span>Jaulas: {report.cages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {getStatusLabel(report.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
          </div>
          
          {selectedReport ? (
            <div className="p-6">
              <div className="text-center mb-6">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedReport.name}</h4>
                <p className="text-gray-600">{selectedReport.type}</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Fecha de generación:</span>
                    <p className="font-medium">{selectedReport.generatedDate.toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tamaño:</span>
                    <p className="font-medium">{selectedReport.size}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <p className="font-medium">{getStatusLabel(selectedReport.status)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Jaulas incluidas:</span>
                    <p className="font-medium">{selectedReport.cages.join(', ')}</p>
                  </div>
                </div>
                
                {selectedReport.status === 'ready' && (
                  <div className="flex space-x-3 pt-4">
                    <button 
                      onClick={() => handleViewReport(selectedReport)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver Reporte</span>
                    </button>
                    <button 
                      onClick={() => handleDownloadReport(selectedReport)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descargar</span>
                    </button>
                  </div>
                )}
                
                {selectedReport.status === 'generating' && (
                  <div className="pt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm">
                        El reporte se está generando. Esto puede tomar unos minutos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Selecciona un reporte para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
