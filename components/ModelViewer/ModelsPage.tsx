import React, { useState } from 'react';
import { 
  Upload, 
  Eye, 
  Trash2, 
  Download, 
  Search,
  Filter,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import ModelUploader from './ModelUploader';
import ModelViewer from './ModelViewer';
import StepViewer from './StepViewer';
import AvzViewer from './AvzViewer';
import SketchUpViewer from './SketchUpViewer';
import { ModelData } from '../../utils/forgeViewer';

const ModelsPage: React.FC = () => {
  const [models, setModels] = useState<ModelData[]>([
    {
      urn: 'demo_urn_grillete_principal',
      name: 'grillete_principal.dwg',
      status: 'ready'
    },
    {
      urn: 'demo_urn_cadena_amarre',
      name: 'cadena_amarre.ipt',
      status: 'ready'
    },
    {
      urn: 'demo_urn_aquasim_structure',
      name: 'aquasim_structure.x_b',
      status: 'ready'
    },
    {
      urn: 'demo_urn_boya_flotacion',
      name: 'boya_flotacion.step',
      status: 'processing'
    }
  ]);
  
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'dwg' | 'ipt' | 'step' | 'x_b' | 'skp' | 'avz'>('all');
  const [showUploader, setShowUploader] = useState(false);

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const extension = model.name.split('.').pop()?.toLowerCase();
    const matchesFilter = filterType === 'all' || extension === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleUploadComplete = (modelData: ModelData) => {
    setModels(prev => [...prev, modelData]);
    setShowUploader(false);
  };

  const handleDeleteModel = (urn: string) => {
    if (confirm('¿Está seguro de que desea eliminar este modelo?')) {
      setModels(prev => prev.filter(model => model.urn !== urn));
      if (selectedModel?.urn === urn) {
        setSelectedModel(null);
      }
    }
  };

  const handleDownloadModel = (model: ModelData) => {
    alert(`Descargando modelo original: ${model.name}`);
  };

  const handleRefreshModels = () => {
    alert('Actualizando lista de modelos...');
    // Simulate refresh
    setModels(prev => prev.map(model => ({
      ...model,
      status: model.status === 'processing' ? 'ready' : model.status
    })));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'dwg':
        return '📐';
      case 'ipt':
        return '🔧';
      case 'skp':
        return '🏗️';
      case 'step':
      case 'stp':
        return '📦';
      case 'x_b':
        return '🌊';
      case 'avz':
        return '📦';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isStepFile = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['step', 'stp', 'x_b', 'iges', 'igs'].includes(extension || '');
  };

  const isAvzFile = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'avz';
  };

  const isSketchUpFile = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'skp';
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Visor de Modelos 3D</h1>
          <p className="text-gray-600">Gestión y visualización de archivos CAD y modelos estructurales</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Subir Modelo</span>
          </button>
          <button
            onClick={handleRefreshModels}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Upload Section */}
      {showUploader && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subir Nuevo Modelo</h3>
            <button
              onClick={() => setShowUploader(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <ModelUploader 
            onUploadComplete={handleUploadComplete}
            onError={(error) => console.error('Upload error:', error)}
          />
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar modelos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">Todos los formatos</option>
                <option value="dwg">DWG (AutoCAD)</option>
                <option value="ipt">IPT (Inventor)</option>
                <option value="step">STEP</option>
                <option value="x_b">X_B (Aquasim)</option>
                <option value="skp">SKP (SketchUp)</option>
                <option value="avz">AVZ (AquaSim)</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredModels.length} de {models.length} modelos
            </span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <div key={model.urn} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{getFileIcon(model.name)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{model.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                      {model.status === 'ready' ? 'Listo' :
                       model.status === 'processing' ? 'Procesando' : 'Error'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedModel(model)}
                    disabled={model.status !== 'ready'}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => handleDownloadModel(model)}
                    className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteModel(model.urn)}
                    className="p-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Modelos</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredModels.map((model) => (
              <div key={model.urn} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getFileIcon(model.name)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{model.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                          {model.status === 'ready' ? 'Listo' :
                           model.status === 'processing' ? 'Procesando' : 'Error'}
                        </span>
                        <span className="text-sm text-gray-500">
                          URN: {model.urn.substring(0, 20)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedModel(model)}
                      disabled={model.status !== 'ready'}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Visualizar</span>
                    </button>
                    <button
                      onClick={() => handleDownloadModel(model)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descargar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteModel(model.urn)}
                      className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay modelos</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'No se encontraron modelos que coincidan con los filtros'
              : 'Sube tu primer modelo CAD para comenzar'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button
              onClick={() => setShowUploader(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subir Primer Modelo
            </button>
          )}
        </div>
      )}

      {/* Model Viewer Modal */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedModel(null)} />
          <div className="absolute inset-4 bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Visor 3D - {selectedModel.name}</h2>
              <button
                onClick={() => setSelectedModel(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="h-full pb-16">
              {isAvzFile(selectedModel.name) ? (
                <AvzViewer
                  urls={selectedModel.avzData?.modelURLs || []}
                  metadata={selectedModel.avzData?.metadata}
                  onError={(error) => console.error('AVZ Viewer error:', error)}
                />
              ) : isSketchUpFile(selectedModel.name) ? (
                <SketchUpViewer
                  modelUrl={`/models/${selectedModel.name}`}
                  fileName={selectedModel.name}
                  onError={(error) => console.error('SketchUp Viewer error:', error)}
                />
              ) : isStepFile(selectedModel.name) ? (
                <StepViewer
                  modelUrl={`/models/${selectedModel.name}`}
                  fileName={selectedModel.name}
                  onError={(error) => console.error('Viewer error:', error)}
                />
              ) : (
                <ModelViewer
                  modelData={selectedModel}
                  onError={(error) => console.error('Viewer error:', error)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelsPage;
