import React, { useState } from 'react';
import { BarChart3, Download, AlertTriangle, CheckCircle, TrendingUp, Calculator, FileText } from 'lucide-react';
import { TechnicalFile } from '../../types';

interface StructuralAnalysisProps {
  files: TechnicalFile[];
}

const StructuralAnalysis: React.FC<StructuralAnalysisProps> = ({ files }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('planning');
  const [selectedFile, setSelectedFile] = useState<TechnicalFile | null>(files[0] || null);

  const analysisTypes = [
    { id: 'planning', name: 'Reporte de Planificación', icon: '📊', description: 'Análisis de cronograma y progreso' },
    { id: 'costs', name: 'Análisis de Costos', icon: '💰', description: 'Desglose de costos operacionales' },
    { id: 'maintenance', name: 'Alertas de Mantenimiento', icon: '🔧', description: 'Estado y programación de mantenimiento' },
    { id: 'structural', name: 'Análisis Estructural', icon: '🏗️', description: 'Evaluación de resistencia y fatiga' }
  ];

  const planningData = [
    { week: 'Semana 1', value: 65, tasks: 'Instalación de anclajes' },
    { week: 'Semana 2', value: 75, tasks: 'Montaje de estructura principal' },
    { week: 'Semana 3', value: 85, tasks: 'Instalación de redes' },
    { week: 'Semana 4', value: 95, tasks: 'Pruebas y calibración' }
  ];

  const costAnalysis = {
    labor: 54,
    materials: 20,
    equipment: 26
  };

  const structuralData = {
    maxStress: '450 MPa',
    safetyFactor: '2.5',
    fatigueLife: '25 años',
    criticalPoints: 3
  };

  const maintenanceAlerts = [
    { 
      id: 1, 
      task: 'Programa operacional', 
      status: 'A tiempo', 
      priority: 'normal',
      icon: CheckCircle,
      color: 'text-green-600',
      nextDate: '15/03/2024'
    },
    { 
      id: 2, 
      task: 'Revisión redes', 
      status: 'Pronto', 
      priority: 'medium',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      nextDate: '20/02/2024'
    },
    { 
      id: 3, 
      task: 'Cambio anclajes', 
      status: 'Retrasada', 
      priority: 'high',
      icon: AlertTriangle,
      color: 'text-red-600',
      nextDate: '10/02/2024'
    }
  ];

  const generateReport = () => {
    const reportData = {
      analysisType: selectedAnalysis,
      fileName: selectedFile?.name,
      generatedAt: new Date().toISOString()
    };
    
    alert(`Generando reporte de ${selectedAnalysis}...`);
    
    setTimeout(() => {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedAnalysis}-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Reporte de análisis generado exitosamente');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* File Selection for Analysis */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Archivo para Análisis</h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedFile?.id || ''}
              onChange={(e) => setSelectedFile(files.find(f => f.id === e.target.value) || null)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Seleccionar archivo...</option>
              {files.map((file) => (
                <option key={file.id} value={file.id}>
                  {file.name} ({file.type.toUpperCase()})
                </option>
              ))}
            </select>
            {selectedFile && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{selectedFile.metadata?.software || 'Software desconocido'}</span>
          {/* Gráfico de Barras - Ciclos de Mantenimiento */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ciclos de Mantenimiento por Componente</h3>
            
            <div className="space-y-3">
              {[
                { component: 'Redes', completed: 8, total: 12, nextDate: '15 Feb' },
                { component: 'Anclajes', completed: 3, total: 24, nextDate: '20 Jun' },
                { component: 'Boyas', completed: 15, total: 18, nextDate: '30 Ene' },
                { component: 'Sensores', completed: 6, total: 8, nextDate: '05 Feb' },
                { component: 'Alimentadores', completed: 4, total: 6, nextDate: '10 Mar' }
              ].map((item, index) => {
                const percentage = (item.completed / item.total) * 100;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700">{item.component}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">{item.completed}/{item.total}</span>
                        <span className="text-xs text-gray-500">Próximo: {item.nextDate}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full transition-all ${
                            percentage > 85 ? 'bg-red-500' :
                            percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right">
                      <span className={`text-sm font-medium ${
                        percentage > 85 ? 'text-red-600' :
                        percentage > 70 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
              </div>
            )}
          </div>

          {/* Gráfico de Desgaste Acumulado */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Desgaste Acumulado de Componentes</h3>
            
            <div className="space-y-4">
              {[
                { name: 'Redes de Contención', wear: 67, cycles: 8, maxCycles: 12, trend: 'increasing' },
                { name: 'Sistema de Anclaje', wear: 23, cycles: 3, maxCycles: 24, trend: 'stable' },
                { name: 'Boyas de Flotación', wear: 89, cycles: 15, maxCycles: 18, trend: 'critical' },
                { name: 'Sensores IoT', wear: 45, cycles: 6, maxCycles: 8, trend: 'increasing' }
              ].map((component, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{component.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        component.trend === 'critical' ? 'bg-red-100 text-red-800' :
                        component.trend === 'increasing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {component.trend === 'critical' ? 'Crítico' :
                         component.trend === 'increasing' ? 'Creciente' : 'Estable'}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{component.wear}%</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          component.wear > 80 ? 'bg-red-500' :
                          component.wear > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${component.wear}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ciclo: {component.cycles}/{component.maxCycles}</span>
                    <span>Vida útil restante: {Math.max(0, component.maxCycles - component.cycles)} ciclos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analysisTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedAnalysis(type.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedAnalysis === type.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center mb-2">
              <span className="text-3xl mb-2 block">{type.icon}</span>
            </div>
            <p className="font-medium text-gray-900 mb-1">{type.name}</p>
            <p className="text-sm text-gray-600">{type.description}</p>
          </button>
        ))}
      </div>

      {/* Analysis Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planning Report */}
        {selectedAnalysis === 'planning' && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reporte de Planificación</h3>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {planningData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.week}</span>
                      <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{item.tasks}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={generateReport}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Reporte</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso General</h3>
              
              <div className="text-center mb-4">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="80, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">80%</p>
                      <p className="text-sm text-gray-600">Completado</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiempo restante:</span>
                  <span className="font-medium">1 semana</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tareas completadas:</span>
                  <span className="font-medium">12/15</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Tareas</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Instalación de sensores</p>
                    <p className="text-sm text-yellow-600">Vence en 2 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pruebas de sistema</p>
                    <p className="text-sm text-blue-600">Programada para la próxima semana</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Structural Analysis */}
        {selectedAnalysis === 'structural' && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Análisis Estructural</h3>
                <Calculator className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{structuralData.maxStress}</p>
                  <p className="text-sm text-gray-600">Estrés Máximo</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{structuralData.safetyFactor}</p>
                    <p className="text-xs text-gray-600">Factor de Seguridad</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{structuralData.fatigueLife}</p>
                    <p className="text-xs text-gray-600">Vida Útil</p>
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {structuralData.criticalPoints} puntos críticos detectados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Cargas</h3>
              
              <div className="relative h-48 bg-gray-100 rounded-lg mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Diagrama de cargas estructurales</p>
                    <p className="text-xs text-gray-500">Basado en {selectedFile?.name || 'archivo seleccionado'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Carga máxima:</span>
                  <span className="font-medium">2,500 kN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carga operacional:</span>
                  <span className="font-medium">1,800 kN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen de seguridad:</span>
                  <span className="font-medium text-green-600">28%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Estructura estable</p>
                    <p className="text-xs text-green-600">Todos los parámetros dentro del rango</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Revisar anclaje norte</p>
                    <p className="text-xs text-yellow-600">Concentración de estrés elevada</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Cost Analysis */}
        {selectedAnalysis === 'costs' && (
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Análisis Detallado de Costos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$125,000</p>
                  <p className="text-sm text-gray-600">Costo Total Estimado</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$67,500</p>
                  <p className="text-sm text-gray-600">Costos de Labor (54%)</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$25,000</p>
                  <p className="text-sm text-gray-600">Materiales (20%)</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">$32,500</p>
                  <p className="text-sm text-gray-600">Equipos (26%)</p>
                </div>
              </div>

              {/* Cost Breakdown Chart */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Distribución de Costos</h4>
                  <div className="relative h-48 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray={`${costAnalysis.labor}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xl font-bold text-gray-900">{costAnalysis.labor}%</p>
                          <p className="text-xs text-gray-600">Labor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Desglose por Categoría</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Labor</span>
                      </div>
                      <span className="text-sm font-bold">${(125000 * 0.54).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Materiales</span>
                      </div>
                      <span className="text-sm font-bold">${(125000 * 0.20).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Equipos</span>
                      </div>
                      <span className="text-sm font-bold">${(125000 * 0.26).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Alerts */}
        {selectedAnalysis === 'maintenance' && (
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sistema de Alertas de Mantenimiento</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {maintenanceAlerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div key={alert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className={`h-6 w-6 ${alert.color}`} />
                        <h4 className="font-medium text-gray-900">{alert.task}</h4>
                      </div>
                      <p className={`text-sm ${alert.color} mb-2`}>{alert.status}</p>
                      <p className="text-xs text-gray-500 mb-3">Próxima fecha: {alert.nextDate}</p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                          Ver Detalles
                        </button>
                        {alert.priority === 'high' && (
                          <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm">
                            Urgente
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Maintenance Calendar Preview */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Calendario de Mantenimiento - Febrero 2024</h4>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="p-2 text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <div key={day} className="p-2 text-sm border rounded hover:bg-white transition-colors">
                      <div className="font-medium">{day}</div>
                      {[10, 15, 20].includes(day) && (
                        <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Exportar Análisis</h3>
            <p className="text-gray-600">Genera reportes detallados en diferentes formatos</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={generateReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar PDF</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar Excel</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Reporte Técnico</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructuralAnalysis;
