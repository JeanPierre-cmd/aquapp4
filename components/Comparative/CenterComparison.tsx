import React, { useState } from 'react';
import { BarChart3, TrendingUp, MapPin, Award, AlertTriangle, Download, Filter } from 'lucide-react';

interface CenterData {
  id: string;
  name: string;
  location: string;
  region: string;
  manager: string;
  established: Date;
  metrics: {
    efficiency: number;
    productivity: number;
    compliance: number;
    safety: number;
    sustainability: number;
    profitability: number;
  };
  kpis: {
    totalProduction: number; // toneladas
    mortalityRate: number; // porcentaje
    feedConversionRatio: number;
    averageWeight: number; // kg
    cycleTime: number; // meses
    costPerKg: number; // USD
  };
  status: 'excellent' | 'good' | 'average' | 'needs-improvement';
  ranking: number;
  trends: {
    efficiency: 'up' | 'down' | 'stable';
    productivity: 'up' | 'down' | 'stable';
    compliance: 'up' | 'down' | 'stable';
  };
}

const CenterComparison: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<keyof CenterData['metrics']>('efficiency');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'radar' | 'ranking'>('table');

  const centersData: CenterData[] = [
    {
      id: 'center-1',
      name: 'Centro MultiX Norte',
      location: 'Puerto Montt',
      region: 'Los Lagos',
      manager: 'Carlos Mendoza',
      established: new Date('2018-03-15'),
      metrics: { efficiency: 92, productivity: 88, compliance: 98, safety: 95, sustainability: 85, profitability: 90 },
      kpis: { totalProduction: 2850, mortalityRate: 0.8, feedConversionRatio: 1.15, averageWeight: 4.2, cycleTime: 18, costPerKg: 3.2 },
      status: 'excellent',
      ranking: 1,
      trends: { efficiency: 'up', productivity: 'up', compliance: 'stable' }
    },
    {
      id: 'center-2',
      name: 'Centro MultiX Sur',
      location: 'Castro',
      region: 'Los Lagos',
      manager: 'María Torres',
      established: new Date('2019-07-20'),
      metrics: { efficiency: 78, productivity: 82, compliance: 90, safety: 88, sustainability: 75, profitability: 85 },
      kpis: { totalProduction: 2200, mortalityRate: 1.2, feedConversionRatio: 1.25, averageWeight: 3.8, cycleTime: 20, costPerKg: 3.8 },
      status: 'good',
      ranking: 3,
      trends: { efficiency: 'up', productivity: 'stable', compliance: 'up' }
    },
    {
      id: 'center-3',
      name: 'Centro MultiX Este',
      location: 'Quellón',
      region: 'Los Lagos',
      manager: 'Luis Ramírez',
      established: new Date('2020-01-10'),
      metrics: { efficiency: 85, productivity: 90, compliance: 94, safety: 92, sustainability: 88, profitability: 87 },
      kpis: { totalProduction: 2650, mortalityRate: 0.9, feedConversionRatio: 1.18, averageWeight: 4.0, cycleTime: 19, costPerKg: 3.4 },
      status: 'excellent',
      ranking: 2,
      trends: { efficiency: 'stable', productivity: 'up', compliance: 'stable' }
    },
    {
      id: 'center-4',
      name: 'Centro AquaSur Aysén',
      location: 'Puerto Aysén',
      region: 'Aysén',
      manager: 'Ana Silva',
      established: new Date('2017-11-05'),
      metrics: { efficiency: 72, productivity: 75, compliance: 85, safety: 80, sustainability: 70, profitability: 78 },
      kpis: { totalProduction: 1950, mortalityRate: 1.8, feedConversionRatio: 1.35, averageWeight: 3.5, cycleTime: 22, costPerKg: 4.2 },
      status: 'average',
      ranking: 4,
      trends: { efficiency: 'down', productivity: 'stable', compliance: 'up' }
    },
    {
      id: 'center-5',
      name: 'Centro Patagonia',
      location: 'Punta Arenas',
      region: 'Magallanes',
      manager: 'Roberto González',
      established: new Date('2021-05-12'),
      metrics: { efficiency: 65, productivity: 68, compliance: 82, safety: 75, sustainability: 65, profitability: 70 },
      kpis: { totalProduction: 1600, mortalityRate: 2.1, feedConversionRatio: 1.42, averageWeight: 3.2, cycleTime: 24, costPerKg: 4.8 },
      status: 'needs-improvement',
      ranking: 5,
      trends: { efficiency: 'up', productivity: 'up', compliance: 'stable' }
    }
  ];

  const regions = ['all', ...Array.from(new Set(centersData.map(c => c.region)))];
  
  const filteredCenters = selectedRegion === 'all' 
    ? centersData 
    : centersData.filter(c => c.region === selectedRegion);

  const sortedCenters = [...filteredCenters].sort((a, b) => a.ranking - b.ranking);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs-improvement':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bueno';
      case 'average':
        return 'Promedio';
      case 'needs-improvement':
        return 'Requiere Mejora';
      default:
        return 'Desconocido';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleExportComparison = () => {
    // Generar reporte comparativo en PDF
    const doc = new (window as any).jsPDF();
    doc.text('REPORTE COMPARATIVO ENTRE CENTROS', 20, 20);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 40);
    doc.text(`Región: ${selectedRegion === 'all' ? 'Todas' : selectedRegion}`, 20, 60);
    
    let yPos = 80;
    doc.text('RANKING DE CENTROS:', 20, yPos);
    yPos += 20;
    
    sortedCenters.forEach((center, index) => {
      doc.text(`${index + 1}. ${center.name} - ${center.location}`, 30, yPos);
      yPos += 10;
      doc.text(`   Eficiencia: ${center.metrics.efficiency}% | Productividad: ${center.metrics.productivity}%`, 30, yPos);
      yPos += 10;
      doc.text(`   Estado: ${getStatusLabel(center.status)} | Manager: ${center.manager}`, 30, yPos);
      yPos += 15;
      
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    doc.save(`comparativo-centros-${new Date().toISOString().split('T')[0]}.pdf`);
    alert('Reporte comparativo exportado exitosamente');
  };

  // Calcular promedios sectoriales
  const sectorAverages = {
    efficiency: filteredCenters.reduce((sum, c) => sum + c.metrics.efficiency, 0) / filteredCenters.length,
    productivity: filteredCenters.reduce((sum, c) => sum + c.metrics.productivity, 0) / filteredCenters.length,
    compliance: filteredCenters.reduce((sum, c) => sum + c.metrics.compliance, 0) / filteredCenters.length,
    mortalityRate: filteredCenters.reduce((sum, c) => sum + c.kpis.mortalityRate, 0) / filteredCenters.length,
    feedConversionRatio: filteredCenters.reduce((sum, c) => sum + c.kpis.feedConversionRatio, 0) / filteredCenters.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel Comparativo entre Centros</h1>
          <p className="text-gray-600">Análisis de rendimiento y benchmarking sectorial</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportComparison}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Comparativo</span>
          </button>
        </div>
      </div>

      {/* Filtros y Controles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Todas las regiones</option>
                {regions.slice(1).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Métrica:</span>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as keyof CenterData['metrics'])}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="efficiency">Eficiencia</option>
                <option value="productivity">Productividad</option>
                <option value="compliance">Cumplimiento</option>
                <option value="safety">Seguridad</option>
                <option value="sustainability">Sostenibilidad</option>
                <option value="profitability">Rentabilidad</option>
              </select>
            </div>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewMode('radar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'radar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Radar
            </button>
            <button
              onClick={() => setViewMode('ranking')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'ranking'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ranking
            </button>
          </div>
        </div>
      </div>

      {/* Promedios Sectoriales */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Benchmarks Sectoriales</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{sectorAverages.efficiency.toFixed(1)}%</p>
            <p className="text-purple-100 text-sm">Eficiencia Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{sectorAverages.productivity.toFixed(1)}%</p>
            <p className="text-purple-100 text-sm">Productividad Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{sectorAverages.compliance.toFixed(1)}%</p>
            <p className="text-purple-100 text-sm">Cumplimiento Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{sectorAverages.mortalityRate.toFixed(1)}%</p>
            <p className="text-purple-100 text-sm">Mortalidad Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{sectorAverages.feedConversionRatio.toFixed(2)}</p>
            <p className="text-purple-100 text-sm">FCR Promedio</p>
          </div>
        </div>
      </div>

      {/* Vista de Tabla */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Comparación Detallada de Centros</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Centro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eficiencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cumplimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCenters.map((center) => (
                  <tr key={center.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{center.name}</div>
                          <div className="text-sm text-gray-500">{center.location}, {center.region}</div>
                          <div className="text-xs text-gray-400">Manager: {center.manager}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">#{center.ranking}</span>
                        {center.ranking <= 2 && <Award className="h-5 w-5 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${center.metrics.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{center.metrics.efficiency}%</span>
                        <span className={`text-sm ${getTrendColor(center.trends.efficiency)}`}>
                          {getTrendIcon(center.trends.efficiency)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${center.metrics.productivity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{center.metrics.productivity}%</span>
                        <span className={`text-sm ${getTrendColor(center.trends.productivity)}`}>
                          {getTrendIcon(center.trends.productivity)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${center.metrics.compliance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{center.metrics.compliance}%</span>
                        <span className={`text-sm ${getTrendColor(center.trends.compliance)}`}>
                          {getTrendIcon(center.trends.compliance)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{center.kpis.totalProduction} ton</div>
                        <div className="text-gray-500">FCR: {center.kpis.feedConversionRatio}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(center.status)}`}>
                        {getStatusLabel(center.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vista Radar */}
      {viewMode === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedCenters.slice(0, 4).map((center) => (
            <div key={center.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{center.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(center.status)}`}>
                  #{center.ranking} - {getStatusLabel(center.status)}
                </span>
              </div>
              
              <div className="relative h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Gráfico Radar</p>
                  <p className="text-sm text-gray-500">Visualización de métricas</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-blue-600">{center.metrics.efficiency}%</div>
                  <div className="text-gray-500">Eficiencia</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">{center.metrics.productivity}%</div>
                  <div className="text-gray-500">Productividad</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-purple-600">{center.metrics.compliance}%</div>
                  <div className="text-gray-500">Cumplimiento</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Ranking */}
      {viewMode === 'ranking' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ranking de Centros por {selectedMetric}</h3>
          
          <div className="space-y-4">
            {sortedCenters.map((center, index) => (
              <div key={center.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                  <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{center.name}</h4>
                      <p className="text-sm text-gray-600">{center.location}, {center.region}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {center.metrics[selectedMetric]}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${center.metrics[selectedMetric]}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {index < 3 && <Award className="h-6 w-6 text-yellow-500" />}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(center.status)}`}>
                    {getStatusLabel(center.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights y Recomendaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights Ejecutivos</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Mejores Prácticas</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Centro MultiX Norte lidera en eficiencia</p>
                  <p className="text-xs text-green-600">92% de eficiencia operacional con tendencia al alza</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Excelente cumplimiento normativo</p>
                  <p className="text-xs text-blue-600">Promedio sectorial de 94% en cumplimiento RES EX 1821</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Oportunidades de Mejora</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Centro Patagonia requiere atención</p>
                  <p className="text-xs text-yellow-600">Eficiencia 27 puntos por debajo del líder</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Oportunidad en sostenibilidad</p>
                  <p className="text-xs text-orange-600">Promedio sectorial de 77% con potencial de mejora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterComparison;
