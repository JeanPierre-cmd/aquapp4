import React, { useState } from 'react';
import { FileText, Download, Calendar, Building2 } from 'lucide-react';
import { PDFReportGenerator, generateSampleHealthReport, HealthReportData } from '../../utils/pdfGenerator';

const HealthReportGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<HealthReportData>(generateSampleHealthReport());

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const generator = new PDFReportGenerator();
      generator.generateHealthReport(reportData);
      alert('Reporte PDF generado exitosamente según D.S. N° 319 (RESA)');
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateReportData = (section: keyof HealthReportData, field: string, value: any) => {
    setReportData(prev => ({
      ...prev,
      [section]: {
        // @ts-ignore
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6 border-b pb-4">
        <FileText className="h-7 w-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Generador de Reportes de Salud
        </h2>
      </div>
      <p className="text-gray-600 mb-8 -mt-2">
        Complete los campos para generar el informe sanitario conforme al <strong>D.S. N° 319 (RESA)</strong> de SERNAPESCA.
      </p>

      <div className="space-y-8">
        {/* Información del Reporte y Concesión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>Información del Reporte</span>
            </h3>
            <InputField label="Número de Reporte" value={reportData.reportInfo.reportNumber} onChange={e => handleUpdateReportData('reportInfo', 'reportNumber', e.target.value)} />
            <InputField label="Certificador" value={reportData.reportInfo.certifier} onChange={e => handleUpdateReportData('reportInfo', 'certifier', e.target.value)} />
            <InputField label="Médico Veterinario" value={reportData.reportInfo.veterinarian} onChange={e => handleUpdateReportData('reportInfo', 'veterinarian', e.target.value)} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span>Información de la Concesión</span>
            </h3>
            <InputField label="Razón Social" value={reportData.concessionInfo.name} onChange={e => handleUpdateReportData('concessionInfo', 'name', e.target.value)} />
            <InputField label="RUT" value={reportData.concessionInfo.rut} onChange={e => handleUpdateReportData('concessionInfo', 'rut', e.target.value)} />
            <InputField label="Cuerpo de Agua" value={reportData.concessionInfo.waterBody} onChange={e => handleUpdateReportData('concessionInfo', 'waterBody', e.target.value)} />
          </div>
        </div>

        {/* Análisis Sanitario */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis Sanitario General</h3>
          <div className="space-y-4">
            <TextareaField label="Estado Sanitario General" value={reportData.healthAnalysis.overallStatus} onChange={e => handleUpdateReportData('healthAnalysis', 'overallStatus', e.target.value)} rows={3} />
            <TextareaField label="Observaciones y Recomendaciones" value={reportData.healthAnalysis.observations} onChange={e => handleUpdateReportData('healthAnalysis', 'observations', e.target.value)} rows={4} />
          </div>
        </div>

        {/* Botón de Generación */}
        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5" />
            <span>
              {isGenerating ? 'Generando Reporte...' : 'Generar y Descargar PDF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper components for form fields
const InputField = ({ label, ...props }: { label: string, [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input type="text" {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 transition text-gray-900" />
  </div>
);

const TextareaField = ({ label, ...props }: { label: string, [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 transition text-gray-900" />
  </div>
);

export default HealthReportGenerator;
