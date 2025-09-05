import React, { useState } from 'react';
import { Upload, FolderOpen, File, Download, Trash2, Search } from 'lucide-react';
import { TechnicalFile } from '../../types';

const FileManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const mockFiles: TechnicalFile[] = [
    {
      id: '1',
      name: 'jaula_principal.dwg',
      type: 'dwg',
      size: 2.5 * 1024 * 1024,
      uploadDate: new Date('2024-01-10'),
      description: 'Diseño estructural de jaula principal',
      category: 'structural',
      associatedCage: 'A-1'
    },
    {
      id: '2',
      name: 'grilletes_sistema.ipt',
      type: 'ipt',
      size: 1.8 * 1024 * 1024,
      uploadDate: new Date('2024-01-12'),
      description: 'Modelo 3D de grilletes del sistema de anclaje',
      category: 'design'
    },
    {
      id: '3',
      name: 'manual_mantenimiento.pdf',
      type: 'pdf',
      size: 3.2 * 1024 * 1024,
      uploadDate: new Date('2024-01-08'),
      description: 'Manual de procedimientos de mantenimiento',
      category: 'maintenance'
    },
    {
      id: '4',
      name: 'inspeccion_enero.pdf',
      type: 'pdf',
      size: 1.5 * 1024 * 1024,
      uploadDate: new Date('2024-01-15'),
      description: 'Reporte de inspección mensual',
      category: 'inspection',
      associatedCage: 'A-2'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos los archivos' },
    { id: 'structural', name: 'Estructural' },
    { id: 'design', name: 'Diseño' },
    { id: 'maintenance', name: 'Mantenimiento' },
    { id: 'inspection', name: 'Inspección' }
  ];

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'dwg': return 'bg-blue-100 text-blue-800';
      case 'ipt': return 'bg-green-100 text-green-800';
      case 'aquasim': return 'bg-cyan-100 text-cyan-800';
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'image': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.name : category;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Subir Archivo</span>
          </button>
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(file.type)}`}>
                    {file.type.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                  <Trash2 className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{file.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(file.size)}</span>
                <span>{file.uploadDate.toLocaleDateString('es-ES')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {getCategoryLabel(file.category)}
                </span>
                {file.associatedCage && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {file.associatedCage}
                  </span>
                )}
              </div>
            </div>
            
            <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Ver Archivo
            </button>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron archivos que coincidan con los criterios de búsqueda</p>
        </div>
      )}

      {/* Storage Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Almacenamiento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600">Total de archivos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">2.8 GB</p>
            <p className="text-sm text-gray-600">Espacio utilizado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">7.2 GB</p>
            <p className="text-sm text-gray-600">Espacio disponible</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">28% del espacio utilizado</p>
        </div>
      </div>
    </div>
  );
};

export default FileManager;
