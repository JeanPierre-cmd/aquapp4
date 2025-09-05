import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
// PDFReportGenerator import is no longer needed here as generation is moved to ReportsModule
// import { PDFReportGenerator } from '../../utils/pdfGenerator'; 

interface FeedingMetrics {
  period: string;
  totalFeed: number;
  averageFCR: number;
  feedingEfficiency: number;
  costPerKg: number;
  growthRate: number;
  mortality: number;
  feedingEvents: number;
}

const FeedingReports: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('weekly');
  const [selectedCage, setSelectedCage] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const feedingMetrics: FeedingMetrics[] = [
    {
      period: 'Semana 1',
      totalFeed: 8750,
      averageFCR: 1.15,
      feedingEfficiency: 94.2,
      costPerKg: 1.68,
      growthRate: 2.3,
      mortality: 0.8,
      feedingEvents: 42
    },
    {
      period: 'Semana 2',
      totalFeed: 9200,
      averageFCR: 1.18,
      feedingEfficiency: 92.8,
      costPerKg: 1.72,
      growthRate: 2.1,
      mortality: 0.6,
      feedingEvents: 44
    },
    {
      period: 'Semana 3',
      totalFeed: 8950,
      averageFCR: 1.12,
      feedingEfficiency: 96.1,
      costPerKg: 1.65,
      growthRate: 2.5,
      mortality: 0.7,
      feedingEvents: 43
    },
    {
      period: 'Semana 4',
      totalFeed: 9100,
      averageFCR: 1.16,
      feedingEfficiency: 93.5,
      costPerKg: 1.70,
      growthRate: 2.2,
      mortality: 0.9,
      feedingEvents: 45
    }
  ];

  const cagePerformance = [
    { cageId: 'A-1', fcr: 1.12, efficiency: 96.2, growth: 2.4, cost: 1.65 },
    { cageId: 'A-2', fcr: 1.18, efficiency: 93.8, growth: 2.1, cost: 1.72 },
    { cageId: 'A-3', fcr: 1.15, efficiency: 94.5, growth: 2.3, cost: 1.68 },
    { cageId: 'B-1', fcr: 1.22, efficiency: 91.2, growth: 1.9, cost: 1.78 },
    { cageId: 'B-2', fcr: 1.14, efficiency: 95.1, growth: 2.2, cost: 1.67 }
  ];

  const feedTypeUsage = [
    { type: 'Pellets Premium 6mm', usage: 45, cost: 83250, percentage: 45 },
    { type: 'Pellets Estándar 4mm', usage: 30, cost: 43500, percentage: 30 },
    { type: 'Pellets Juvenil 3mm', usage: 20, cost: 42000, percentage: 20 },
    { type: 'Suplemento Vitamínico', usage: 5, cost: 17500, percentage: 5 }
  ];

  // Removed handleGenerateReport as PDF generation is now handled by ReportsModule
  // const handleGenerateReport = () => {
  //   const reportData = {
  //     reportType,
  //     selectedCage,
  //     dateRange,
  //     metrics: feedingMetrics,
  //     cagePerformance,
  //     feedTypeUsage,
  //     generatedAt: new Date().toISOString()
  //   };

  //   // Generar reporte PDF
  //   const doc = new (window as any).jsPDF();
  //   doc.text('REPORTE DE ALIMENTACIÓN', 20, 20);
  //   doc.text(`Período: ${reportType}`, 20, 40);
  //   doc.text(`Jaula: ${selectedCage === 'all' ? 'Todas' : selectedCage}`, 20, 60);
  //   doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 20, 80);
    
  //   let yPos = 100;
  //   doc.text('MÉTRICAS PRINCIPALES:', 20, yPos);
  //   yPos += 20;
    
  //   const avgFCR = feedingMetrics.reduce((sum, m) => sum + m.averageFCR, 0) / feedingMetrics.length;
  //   const avgEfficiency = feedingMetrics.reduce((sum, m) => sum + m.feedingEfficiency, 0) / feedingMetrics.length;
  //   const totalFeed = feedingMetrics.reduce((sum, m) => sum + m.totalFeed, 0);
    
  //   doc.text(`FCR Promedio: ${avgFCR.toFixed(2)}`, 30, yPos);
  //   yPos += 15;
  //   doc.text(`Eficiencia Promedio: ${avgEfficiency.toFixed(1)}%`, 30, yPos);
  //   yPos += 15;
  //   doc.text(`Total Alimento: ${totalFeed.toLocaleString()} kg`, 30, yPos);
  //   yPos += 15;
    
  //   yPos += 20;
  //   doc.text('RENDIMIENTO POR JAULA:', 20, yPos);
  //   yPos += 15;
    
  //   cagePerformance.forEach((cage) => {
  //     doc.text(`${cage.cageId}: FCR ${cage.fcr} | Eficiencia ${cage.efficiency}% | Crecimiento ${cage.growth}%`, 30, yPos);
  //     yPos += 15;
  //   });
    
  //   doc.save(`reporte-alimentacion-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
  //   alert('📊 Reporte PDF generado exitosamente');
  // };

  const handleExportData = () => {
    const csvData = feedingMetrics.map(metric => [
      metric.period,
      metric.totalFeed,
      metric.averageFCR,
      metric.feedingEfficiency,
      metric.costPerKg,
      metric.growthRate,
      metric.mortality,
      metric.feedingEvents
    ]);

    const csvHeaders = [
      'Período',
      'Total Alimento (kg)',
      'FCR Promedio',
      'Eficiencia (%)',
      'Costo/kg ($)',
      'Crecimiento (%)',
      'Mortalidad (%)',
      'Eventos Alimentación'
    ];

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `datos-alimentacion-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const averageFCR = feedingMetrics.reduce((sum, m) => sum + m.averageFCR, 0) / feedingMetrics.length;
  const averageEfficiency = feedingMetrics.reduce((sum, m) => sum + m.feedingEfficiency, 0) / feedingMetrics.length;
  const totalFeedConsumed = feedingMetrics.reduce((sum, m) => sum + m.totalFeed, 0);
  const totalCost = feedTypeUsage.reduce((sum, f) => sum + f.cost, 0);

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configuración de Reporte</h3>
          <div className="flex space-x-3">
            <button
              onClick={handleExportData}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar CSV</span>
            </button>
            {/* Removed PDF generation button as it's now handled by ReportsModule */}
            {/* <button
              onClick={handleGenerateReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generar PDF</span>
            </button> */}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jaula</label>
            <select
              value={selectedCage}
              onChange={(e) => setSelectedCage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Todas las jaulas</option>
              <option value="A-1">Jaula A-1</option>
              <option value="A-2">Jaula A-2</option>
              <option value="A-3">Jaula A-3</option>
              <option value="B-1">Jaula B-1</option>
              <option value="B-2">Jaula B-2</option>
            </select>
          </div>
          
          {reportType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">FCR Promedio</p>
              <p className="text-2xl font-bold text-blue-600">{averageFCR.toFixed(2)}</p>
              <p className="text-sm text-green-600">-3.2% vs mes anterior</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eficiencia Alimentación</p>
              <p className="text-2xl font-bold text-green-600">{averageEfficiency.toFixed(1)}%</p>
              <p className="text-sm text-green-600">+1.8% vs mes anterior</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Consumido</p>
              <p className="text-2xl font-bold text-purple-600">{totalFeedConsumed.toLocaleString()} kg</p>
              <p className="text-sm text-gray-500">Último período</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Costo Total</p>
              <p className="text-2xl font-bold text-orange-600">${totalCost.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Período actual</p>
            </div>
            <PieChart className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FCR Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Tendencia FCR</span>
          </h3>
          
          <div className="space-y-4">
            {feedingMetrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700">{metric.period}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">FCR: {metric.averageFCR}</span>
                    <span className="text-sm text-gray-500">{metric.totalFeed.toLocaleString()} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        metric.averageFCR <= 1.15 ? 'bg-green-500' :
                        metric.averageFCR <= 1.20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (2.0 - metric.averageFCR) / 0.8 * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className={`text-sm font-medium ${
                    metric.averageFCR <= 1.15 ? 'text-green-600' :
                    metric.averageFCR <= 1.20 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.averageFCR <= 1.15 ? 'Excelente' :
                     metric.averageFCR <= 1.20 ? 'Bueno' : 'Mejorar'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cage Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <span>Rendimiento por Jaula</span>
          </h3>
          
          <div className="space-y-4">
            {cagePerformance.map((cage, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Jaula {cage.cageId}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cage.fcr <= 1.15 ? 'bg-green-100 text-green-800' :
                    cage.fcr <= 1.20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    FCR {cage.fcr}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-blue-600">{cage.efficiency}%</p>
                    <p className="text-gray-600">Eficiencia</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-green-600">{cage.growth}%</p>
                    <p className="text-gray-600">Crecimiento</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-purple-600">${cage.cost}</p>
                    <p className="text-gray-600">Costo/kg</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Type Usage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <PieChart className="h-5 w-5 text-orange-600" />
          <span>Uso por Tipo de Alimento</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {feedTypeUsage.map((feed, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">{feed.type}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{feed.usage}% uso</span>
                    <span className="text-sm text-gray-500">${feed.cost.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all"
                      style={{ width: `${feed.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {feedTypeUsage.map((feed, index) => {
                  const offset = feedTypeUsage.slice(0, index).reduce((sum, f) => sum + f.percentage, 0);
                  return (
                    <path
                      key={index}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={['#f97316', '#3b82f6', '#10b981', '#8b5cf6'][index]}
                      strokeWidth="3"
                      strokeDasharray={`${feed.percentage}, 100`}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-sm text-gray-600">Distribución</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Métricas Detalladas</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alimento Total (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FCR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eficiencia (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo/kg ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crecimiento (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eventos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedingMetrics.map((metric, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {metric.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.totalFeed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-medium ${
                      metric.averageFCR <= 1.15 ? 'text-green-600' :
                      metric.averageFCR <= 1.20 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {metric.averageFCR}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.feedingEfficiency}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${metric.costPerKg}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.growthRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.feedingEvents}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedingReports;
