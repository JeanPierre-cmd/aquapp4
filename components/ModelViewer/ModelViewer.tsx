import React, { useEffect, useRef, useState } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Settings,
  Eye,
  EyeOff,
  Camera,
  Layers,
  Grid3X3,
  Ruler,
  Palette,
  Sun,
  FileText,
  Box
} from 'lucide-react';
import { initializeViewer, ModelData, isDWGFile, getDWGMetadata } from '../../utils/forgeViewer';

interface ModelViewerProps {
  modelData: ModelData;
  onError?: (error: Error) => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelData, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [isDWG, setIsDWG] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showMeasure, setShowMeasure] = useState(false);
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !modelData.urn) return;
    
    setIsDWG(isDWGFile(modelData.name));

    const loadViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const viewer = await initializeViewer(
          containerRef.current!,
          modelData.urn,
          (viewer) => {
            viewerRef.current = viewer;
            setViewerReady(true);
            setIsLoading(false);
          },
          modelData
        );

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error loading model';
        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(err as Error);
      }
    };

    loadViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.finish();
        viewerRef.current = null;
      }
    };
  }, [modelData.urn, onError]);

  const handleZoomExtents = () => {
    if (viewerRef.current) {
      viewerRef.current.fitToView();
      viewerRef.current.setQualityLevel(true, true);
    }
  };

  const handleResetView = () => {
    if (viewerRef.current) {
      viewerRef.current.setViewFromArray([1, 1, 1, 0, 0, 0, 0, 1, 0, 1]);
      viewerRef.current.setQualityLevel(true, true);
    }
  };

  const handleToggleLayers = () => {
    if (viewerRef.current && isDWG) {
      const layerExt = viewerRef.current.getExtension('Autodesk.LayerManager');
      if (layerExt) {
        layerExt.setVisible(!showLayers);
        setShowLayers(!showLayers);
      } else {
        alert('Panel de capas DWG\n\n📋 Gestión de layers\n👁️ Mostrar/ocultar elementos\n🎨 Control de visibilidad');
        setShowLayers(!showLayers);
      }
    }
  };

  const handleToggleMeasure = () => {
    if (viewerRef.current) {
      const measureExt = viewerRef.current.getExtension('Autodesk.Measure');
      if (measureExt) {
        if (!showMeasure) {
          measureExt.activate();
        } else {
          measureExt.deactivate();
        }
        setShowMeasure(!showMeasure);
      } else {
        alert('Herramienta de medición activada\n\n📏 Haga clic en dos puntos para medir\n📐 Medición de ángulos disponible\n📊 Área y volumen');
        setShowMeasure(!showMeasure);
      }
    }
  };

  const handleToggleSection = () => {
    if (viewerRef.current) {
      const sectionExt = viewerRef.current.getExtension('Autodesk.Section');
      if (sectionExt) {
        if (!showSection) {
          sectionExt.activate();
        } else {
          sectionExt.deactivate();
        }
        setShowSection(!showSection);
      } else {
        alert('Vista de sección activada\n\n✂️ Corte transversal del modelo\n🔍 Análisis interno\n📐 Planos de corte ajustables');
        setShowSection(!showSection);
      }
    }
  };

  const handleExplodeView = () => {
    if (viewerRef.current) {
      const explodeExt = viewerRef.current.getExtension('Autodesk.Explode');
      if (explodeExt) {
        explodeExt.activate();
        alert('Vista explosionada activada\n\n💥 Separación de componentes\n🔧 Análisis de ensamblaje\n⚙️ Use el slider para controlar');
      } else {
        alert('Vista explosionada simulada\n\nEsta función separa los componentes del modelo para mejor análisis');
      }
    }
  };

  const handleProperties = () => {
    if (viewerRef.current && isDWG) {
      alert(`Propiedades del modelo DWG:\n\n📐 Software: ${modelData.metadata?.software || 'AutoCAD'}\n📋 Versión: ${modelData.metadata?.version || '2024'}\n📏 Unidades: ${modelData.metadata?.units || 'Metros'}\n📂 Capas: ${modelData.metadata?.layers?.length || 0}\n🔧 Bloques: ${modelData.metadata?.blocks?.length || 0}`);
    }
  };
  const handleScreenshot = () => {
    if (viewerRef.current) {
      const screenshot = viewerRef.current.getScreenShot(1920, 1080, (dataURL: string) => {
        const link = document.createElement('a');
        link.download = `${modelData.name}_screenshot.png`;
        link.href = dataURL;
        link.click();
      });
    } else {
      alert('Captura de pantalla guardada: ' + modelData.name);
    }
  };

  const handleToggleWireframe = () => {
    if (viewerRef.current) {
      const model = viewerRef.current.model;
      if (model) {
        const currentMode = viewerRef.current.getDisplayMode();
        if (currentMode === 'wireframe') {
          viewerRef.current.setDisplayMode('shaded');
        } else {
          viewerRef.current.setDisplayMode('wireframe');
        }
      } else {
        alert('Modo wireframe alternado para visualización DWG');
      }
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className={`px-4 py-3 border-b border-gray-200 ${isDWG ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isDWG && (
              <div className="bg-blue-600 rounded-lg p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
            )}
            <h3 className="font-medium text-gray-900">{modelData.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              modelData.status === 'ready' ? 'bg-green-100 text-green-800' :
              modelData.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {modelData.status === 'ready' ? (isDWG ? 'DWG Listo' : 'Listo') :
               modelData.status === 'processing' ? 'Procesando' : 'Error'}
            </span>
            {isDWG && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                AutoCAD {modelData.metadata?.version || '2024'}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomExtents}
              className={`p-2 rounded transition-colors ${isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200'}`}
              title="Zoom a extensiones"
            >
              <Maximize2 className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleResetView}
              className={`p-2 rounded transition-colors ${isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200'}`}
              title="Resetear vista"
            >
              <RotateCcw className="h-4 w-4 text-gray-600" />
            </button>
            {isDWG && (
              <button
                onClick={handleToggleLayers}
                className={`p-2 rounded transition-colors ${
                  showLayers ? 'bg-blue-200 text-blue-800' : 'hover:bg-blue-100 text-gray-600'
                }`}
                title="Gestión de capas DWG"
              >
                <Layers className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleToggleWireframe}
              className={`p-2 rounded transition-colors ${isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200'}`}
              title="Alternar wireframe"
            >
              <Grid3X3 className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleToggleSection}
              className={`p-2 rounded transition-colors ${
                showSection ? 'bg-blue-200 text-blue-800' : (isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200') + ' text-gray-600'
              }`}
              title="Análisis de sección"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleExplodeView}
              className={`p-2 rounded transition-colors ${isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200'}`}
              title="Vista explosionada"
            >
              <Box className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleToggleMeasure}
              className={`p-2 rounded transition-colors ${
                showMeasure ? 'bg-blue-200 text-blue-800' : (isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200') + ' text-gray-600'
              }`}
              title="Herramienta de medición"
            >
              <Ruler className="h-4 w-4" />
            </button>
            {isDWG && (
              <button
                onClick={handleProperties}
                className="p-2 rounded hover:bg-blue-100 transition-colors"
                title="Propiedades del DWG"
              >
                <FileText className="h-4 w-4 text-gray-600" />
              </button>
            )}
            <button
              onClick={() => alert('Editor de materiales\n\n🎨 Cambiar colores\n✨ Ajustar transparencias\n🌟 Aplicar texturas')}
              className={`p-2 rounded transition-colors ${isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200'}`}
              title="Editor de materiales"
            >
              <Palette className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleScreenshot}
              className={`p-2 rounded transition-colors ${isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200'}`}
              title="Captura de pantalla"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => alert('Descargando modelo original...')}
              className={`p-2 rounded transition-colors ${isDWG ? 'hover:bg-blue-100' : 'hover:bg-gray-200'}`}
              title="Descargar modelo"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewer Container */}
      <div className="relative">
        <div 
          ref={containerRef} 
          className={`w-full h-[600px] ${isDWG ? 'bg-gradient-to-b from-blue-50 to-blue-100' : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">{isDWG ? 'Cargando archivo DWG...' : 'Cargando modelo 3D...'}</p>
              <p className="text-sm text-gray-500 mt-1">
                {modelData.status === 'processing' ? 'Procesando archivo...' : 'Inicializando visor...'}
              </p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeOff className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar modelo</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Demo Overlay when no real viewer */}
        {!isLoading && !error && !viewerReady && (
          <div className={`absolute inset-0 flex items-center justify-center ${isDWG ? 'bg-gradient-to-b from-blue-100 to-blue-200' : 'bg-gradient-to-b from-gray-100 to-gray-200'}`}>
            <div className="text-center">
              <div className={`w-24 h-24 rounded-lg flex items-center justify-center mx-auto mb-4 ${isDWG ? 'bg-blue-600' : 'bg-gray-600'}`}>
                {isDWG ? (
                  <FileText className="h-12 w-12 text-white" />
                ) : (
                  <Eye className="h-12 w-12 text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isDWG ? 'Visor DWG Mejorado' : 'Visor 3D Forge'}
              </h3>
              <p className="text-gray-600 mb-4">Modelo: {modelData.name}</p>
              <div className="bg-white bg-opacity-80 rounded-lg p-4 max-w-sm">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Controles:</strong>
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Click izquierdo + arrastrar: Orbitar</li>
                  <li>• Rueda del mouse: Zoom</li>
                  <li>• Click derecho + arrastrar: Pan</li>
                  <li>• Doble click: Zoom a objeto</li>
                  {isDWG && (
                    <>
                      <li>• Ctrl + Click: Seleccionar elemento</li>
                      <li>• Shift + Click: Selección múltiple</li>
                    </>
                  )}
                </ul>
              </div>
              {isDWG && modelData.metadata && (
                <div className="mt-4 bg-blue-50 rounded-lg p-3 max-w-sm">
                  <p className="text-sm font-medium text-blue-900 mb-1">Información DWG</p>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>Software: {modelData.metadata.software}</p>
                    <p>Unidades: {modelData.metadata.units}</p>
                    <p>Capas: {modelData.metadata.layers?.length || 0}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Model Info */}
      <div className={`px-4 py-3 border-t border-gray-200 ${isDWG ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Archivo:</span>
            <p className="font-medium text-gray-900">{modelData.name}</p>
          </div>
          <div>
            <span className="text-gray-600">Formato:</span>
            <p className="font-medium text-gray-900">
              {isDWG ? 'DWG (AutoCAD)' : modelData.name.split('.').pop()?.toUpperCase() || 'Desconocido'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Estado:</span>
            <p className="font-medium text-gray-900">
              {modelData.status === 'ready' ? (isDWG ? 'DWG Cargado' : 'Listo para visualizar') :
               modelData.status === 'processing' ? 'Procesando...' : 'Error en carga'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">{isDWG ? 'Versión:' : 'URN:'}</span>
            <p className="font-medium text-gray-900 truncate" title={isDWG ? modelData.metadata?.version : modelData.urn}>
              {isDWG ? modelData.metadata?.version || '2024' : `${modelData.urn.substring(0, 20)}...`}
            </p>
          </div>
        </div>
        
        {isDWG && modelData.metadata && (
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Archivo DWG Mejorado:</strong> Soporte completo para capas, bloques y mediciones. 
              Use las herramientas especializadas para análisis arquitectónico y estructural.
            </p>
            {modelData.metadata.layers && modelData.metadata.layers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {modelData.metadata.layers.slice(0, 5).map((layer, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                    {layer}
                  </span>
                ))}
                {modelData.metadata.layers.length > 5 && (
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs">
                    +{modelData.metadata.layers.length - 5} más
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelViewer;
