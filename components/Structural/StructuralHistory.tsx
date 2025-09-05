import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface StructuralRecord {
  id: string;
  component: string;
  inspectionDate: Date;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  wearLevel: number;
  inspector: string;
  observations: string;
  nextInspection: Date;
  maintenanceRequired: boolean;
  replacementRecommended: boolean;
  cost?: number;
}

const StructuralHistory: React.FC = () => {
  const [records, setRecords] = useState<StructuralRecord[]>([
    {
      id: '1',
      component: 'Redes de Contención - Sector Norte',
      inspectionDate: new Date('2024-01-15'),
      condition: 'good',
      wearLevel: 25,
      inspector: 'Ing. Carlos Mendoza',
      observations: 'Desgaste normal, sin roturas detectadas',
      nextInspection: new Date('2024-04-15'),
      maintenanceRequired: false,
      replacementRecommended: false,
      cost: 0
    },
    {
      id: '2',
      component: 'Sistema de Anclaje - Ancla Principal',
      inspectionDate: new Date('2024-01-10'),
      condition: 'excellent',
      wearLevel: 10,
      inspector: 'Ing. María Torres',
      observations: 'Estado óptimo, sin signos de corrosión',
      nextInspection: new Date('2024-07-10'),
      maintenanceRequired: false,
      replacementRecommended: false,
      cost: 0
    },
    {
      id: '3',
      component: 'Boyas de Flotación - Conjunto A',
      inspectionDate: new Date('2024-01-08'),
      condition: 'fair',
      wearLevel: 65,
      inspector: 'Téc. Luis Ramírez',
      observations: 'Desgaste moderado, requiere monitoreo frecuente',
      nextInspection: new Date('2024-02-08'),
      maintenanceRequired: true,
      replacementRecommended: false,
      cost: 150000
    },
    {
      id: '4',
      component: 'Grilletes de Conexión - Set Principal',
      inspectionDate: new Date('2024-01-12'),
      condition: 'poor',
      wearLevel: 80,
      inspector: 'Ing. Carlos Mendoza',
      observations: 'Desgaste avanzado, programar reemplazo',
      nextInspection: new Date('2024-02-12'),
      maintenanceRequired: true,
      replacementRecommended: true,
      cost: 350000
    }
  ]);

  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const components = ['all', ...Array.from(new Set(records.map(r => r.component)))];

  const filteredRecords = selectedComponent === 'all' 
    ? records 
    : records.filter(r => r.component === selectedComponent);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('Procesando archivo...');

    // Simular procesamiento de archivo CSV/Excel
    setTimeout(() => {
      // Datos simulados que se cargarían del archivo
      const newRecords: StructuralRecord[] = [
        {
          id: Date.now().toString(),
          component: 'Cadenas de Amarre - Sector Sur',
          inspectionDate: new Date('2024-01-20'),
          condition: 'good',
          wearLevel: 30,
          inspector: 'Ing. Ana Soto',
          observations: 'Cargado desde archivo CSV - Estado satisfactorio',
          nextInspection: new Date('2024-04-20'),
          maintenanceRequired: false,
          replacementRecommended: false,
          cost: 0
        },
        {
          id: (Date.now() + 1).toString(),
          component: 'Sensores IoT - Monitoreo Ambiental',
          inspectionDate: new Date('2024-01-18'),
          condition: 'excellent',
          wearLevel: 5,
          inspector: 'Téc. Roberto Silva',
          observations: 'Cargado desde archivo CSV - Funcionamiento óptimo',
          nextInspection: new Date('2024-03-18'),
          maintenanceRequired: false,
          replacementRecommended: false,
          cost: 0
        }
      ];

      setRecords(prev => [...prev, ...newRecords]);
      setUploadStatus(`Archivo procesado exitosamente. ${newRecords.length} registros agregados.`);
      
      setTimeout(() => setUploadStatus(''), 3000);
    }, 2000);
  };

  const handleExportData = () => {
    // Generar CSV con los datos
    const csvHeaders = [
      'Componente',
      'Fecha Inspección',
      'Condición',
      'Nivel Desgaste (%)',
      'Inspector',
      'Observaciones',
      'Próxima Inspección',
      'Mantenimiento Requerido',
      'Reemplazo Recomendado',
      'Costo Estimado'
    ];

    const csvData = filteredRecords.map(record => [
      record.component,
      record.inspectionDate.toLocaleDateString('es-ES'),
      record.condition,
      record.wearLevel,
      record.inspector,
      record.observations,
      record.nextInspection.toLocaleDateString('es-ES'),
      record.maintenanceRequired ? 'Sí' : 'No',
      record.replacementRecommended ? 'Sí' : 'No',
      record.cost ? `$${record.cost.toLocaleString()}` : '$0'
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historial-estructural-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Buena';
      case 'fair':
        return 'Regular';
      case 'poor':
        return 'Mala';
      case 'critical':
        return 'Crítica';
      default:
        return 'Desconocida';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fair':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'poor':
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Estadísticas del historial
  const totalComponents = new Set(records.map(r => r.component)).size;
  const averageWearLevel = records.reduce((sum, r) => sum + r.wearLevel, 0) / records.length;
  const componentsNeedingMaintenance = records.filter(r => r.maintenanceRequired).length;
  const componentsNeedingReplacement = records.filter(r => r.replacementRecommended).length;
  const totalMaintenanceCost = records.reduce((sum, r) => sum + (r.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Historial Estructural por Componente</h1>
          <p className="text-gray-600">Gestión y seguimiento del estado de componentes estructurales</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Subir CSV/Excel</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Datos</span>
          </button>
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800">{uploadStatus}</span>
          </div>
        </div>
      )}

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Componentes</p>
              <p className="text-2xl font-bold text-gray-900">{totalComponents}</p>
            </div>
            <FileSpreadsheet className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Desgaste Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{averageWearLevel.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Requieren Mantenimiento</p>
              <p className="text-2xl font-bold text-orange-600">{componentsNeedingMaintenance}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Requieren Reemplazo</p>
              <p className="text-2xl font-bold text-red-600">{componentsNeedingReplacement}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Costo Total Estimado</p>
              <p className="text-2xl font-bold text-gray-900">${totalMaintenanceCost.toLocaleString()}</p>
            </div>
            <Download className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por componente:</label>
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos los componentes</option>
            {components.slice(1).map((component) => (
              <option key={component} value={component}>
                {component}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            Mostrando {filteredRecords.length} de {records.length} registros
          </span>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Inspecciones</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Componente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inspección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condición
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desgaste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Inspección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getConditionIcon(record.condition)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.component}</div>
                        <div className="text-sm text-gray-500">{record.observations}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.inspectionDate.toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(record.condition)}`}>
                      {getConditionLabel(record.condition)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            record.wearLevel > 75 ? 'bg-red-500' :
                            record.wearLevel > 50 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${record.wearLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{record.wearLevel}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.inspector}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{record.nextInspection.toLocaleDateString('es-ES')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {record.maintenanceRequired && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                          Mantenimiento
                        </span>
                      )}
                      {record.replacementRecommended && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Reemplazo
                        </span>
                      )}
                      {record.cost && record.cost > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          ${record.cost.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instrucciones de Carga */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">Instrucciones para Carga de Archivos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Formato CSV/Excel requerido:</h5>
            <ul className="space-y-1">
              <li>• Componente (texto)</li>
              <li>• Fecha Inspección (DD/MM/AAAA)</li>
              <li>• Condición (excellent/good/fair/poor/critical)</li>
              <li>• Nivel Desgaste (0-100)</li>
              <li>• Inspector (texto)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Campos opcionales:</h5>
            <ul className="space-y-1">
              <li>• Observaciones (texto)</li>
              <li>• Próxima Inspección (DD/MM/AAAA)</li>
              <li>• Mantenimiento Requerido (Sí/No)</li>
              <li>• Reemplazo Recomendado (Sí/No)</li>
              <li>• Costo Estimado (número)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructuralHistory;
