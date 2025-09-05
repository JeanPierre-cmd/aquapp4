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
  FileText,
  BarChart3
} from 'lucide-react';

interface AvzViewerProps {
  urls: string[];
  metadata?: {
    projectName?: string;
    version?: string;
    analysisType?: string;
    results?: any[];
  };
  onError?: (error: Error) => void;
}

const AvzViewer: React.FC<AvzViewerProps> = ({ urls, metadata, onError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!urls?.length || !canvasRef.current) return;

    const loadAvzModel = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simular carga con xeokit (en producción usarías el SDK real)
        // const viewer = new Viewer({ canvasId: canvasRef.current });
        // const loader = new GLTFLoaderPlugin(viewer);
        
        // urls.forEach((url, i) => {
        //   loader.load({ id: `part${i}`, src: url });
        // });
        
        // viewer.camera.eye = [10, 10, 10];

        // Simulación para demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error loading AVZ model';
        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(err as Error);
      }
    };

    loadAvzModel();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [urls, onError]);

  const handleFitToView = () => {
    if (viewerRef.current) {
      // viewerRef.current.cameraFlight.flyTo({ eye: [10, 10, 10], look: [0, 0, 0] });
      alert('Ajustando vista a extensiones del modelo AquaSim');
    }
  };

  const handleResetView = () => {
    if (viewerRef.current) {
      // viewerRef.current.camera.eye = [10, 10, 10];
      alert('Vista resetada a posición inicial');
    }
  };

  const handleToggleWireframe = () => {
    alert('Alternando modo wireframe para análisis estructural');
  };

  const handleSectionView = () => {
    alert('Activando vista de sección para análisis interno');
  };

  const handleScreenshot = () => {
    alert('Captura de pantalla guardada: aquasim_model_screenshot.png');
  };

  const handleShowResults = () => {
    setShowResults(!showResults);
  };

  const handleExportResults = () => {
    if (metadata?.results) {
      const csvContent = metadata.results.map(r => Object.values(r).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aquasim_results.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">AS</span>
            </div>
            <h3 className="font-medium text-gray-900">
              {metadata?.projectName || 'Proyecto AquaSim'}
            </h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
              AVZ
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleFitToView}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Ajustar a vista"
            >
              <Maximize2 className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Resetear vista"
            >
              <RotateCcw className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleToggleWireframe}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Alternar wireframe"
            >
              <Layers className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleSectionView}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Vista de sección"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleShowResults}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Mostrar resultados"
            >
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleScreenshot}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Captura de pantalla"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleExportResults}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Exportar resultados"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewer Container */}
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-[600px] bg-gradient-to-b from-gray-50 to-gray-100"
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Extrayendo modelo AquaSim...</p>
              <p className="text-sm text-gray-500 mt-1">Convirtiendo STEP a GLTF...</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar archivo AVZ</h3>
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

        {/* Demo Content when loaded */}
        {!isLoading && !error && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg max-w-xs">
            <h4 className="font-medium text-gray-900 mb-2">Modelo AquaSim Cargado</h4>
            <p className="text-sm text-gray-600 mb-3">
              Geometría 3D extraída del archivo AVZ
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><strong>Controles:</strong></p>
              <p>• Click + arrastrar: Orbitar</p>
              <p>• Rueda: Zoom in/out</p>
              <p>• Shift + arrastrar: Pan</p>
            </div>
            {metadata?.analysisType && (
              <div className="mt-2 p-2 bg-cyan-50 rounded">
                <p className="text-xs text-cyan-800">
                  <strong>Análisis:</strong> {metadata.analysisType}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Panel */}
      {showResults && metadata?.results && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Resultados de Simulación</h4>
            <button
              onClick={() => setShowResults(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-3">
              <p className="text-sm text-gray-600">Tensión Máxima</p>
              <p className="text-lg font-bold text-red-600">450 MPa</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm text-gray-600">Desplazamiento Máx.</p>
              <p className="text-lg font-bold text-blue-600">2.3 mm</p>
            </div>
            <div className="bg-white rounded p-3">
              <p className="text-sm text-gray-600">Factor de Seguridad</p>
              <p className="text-lg font-bold text-green-600">2.8</p>
            </div>
          </div>
        </div>
      )}

      {/* Model Info */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Proyecto:</span>
            <p className="font-medium text-gray-900">{metadata?.projectName || 'AquaSim Project'}</p>
          </div>
          <div>
            <span className="text-gray-600">Versión:</span>
            <p className="font-medium text-gray-900">{metadata?.version || 'AquaStructure 3.2'}</p>
          </div>
          <div>
            <span className="text-gray-600">Modelos:</span>
            <p className="font-medium text-gray-900">{urls.length} componentes</p>
          </div>
          <div>
            <span className="text-gray-600">Motor:</span>
            <p className="font-medium text-gray-900">xeokit + WebGL</p>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-cyan-50 rounded-lg">
          <p className="text-sm text-cyan-800">
            <strong>Archivo AquaSim-AquaStructure:</strong> Este modelo contiene geometría 3D y resultados de simulación estructural. 
            Use las herramientas de análisis para visualizar tensiones y deformaciones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvzViewer;
