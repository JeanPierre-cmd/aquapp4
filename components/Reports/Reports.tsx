import React, { useState } from 'react';
import ReportGenerator from './ReportGenerator';
import ReportViewer from './ReportViewer';
import FileManager from './FileManager';
import ExecutiveDashboard from './ExecutiveDashboard';
import { BarChart3, FileText, FolderOpen, Target } from 'lucide-react';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'executive' | 'generator' | 'viewer' | 'files'>('executive');

  const tabs = [
    { id: 'executive', name: 'Panel Ejecutivo', icon: Target },
    { id: 'generator', name: 'Generar Reportes', icon: BarChart3 },
    { id: 'viewer', name: 'Ver Reportes', icon: FileText },
    { id: 'files', name: 'Gestión de Archivos', icon: FolderOpen }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reportes</h1>
        <p className="text-gray-600">Generación y gestión de reportes técnicos y operacionales</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'executive' && <ExecutiveDashboard />}
        {activeTab === 'generator' && <ReportGenerator />}
        {activeTab === 'viewer' && <ReportViewer />}
        {activeTab === 'files' && <FileManager />}
      </div>
    </div>
  );
};

export default Reports;
