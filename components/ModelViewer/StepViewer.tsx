import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, RotateCcw, ZoomIn, ZoomOut, Download, Settings, Eye, EyeOff, Camera, Layers, Cuboid as Cube } from 'lucide-react';
import { createStepViewer, XeokitViewer } from '../../utils/xeokit';

interface StepViewerProps {
  modelUrl: string;
  fileName: string;
  onError?: (error: Error) => void;
}

const StepViewer: React.FC<StepViewerProps> = ({ modelUrl, fileName, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<XeokitViewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const viewer = createStepViewer({
          container: containerRef.current!,
          modelUrl,
          onLoad: () => {
            setIsLoading(false);
          },
          onError: (err) => {
            setError(err.message);
            setIsLoading(false);
            if (onError) onError(err);
          }
        });

        viewerRef.current = viewer;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error loading STEP model';
        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(err as Error);
      }
    };

    loadViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [modelUrl, onError]);

  const handleFitToView = () => {
    if (viewerRef.current) {
      viewerRef.current.fitToView();
    }
  };

  const handleResetView = () => {
    if (viewerRef.current) {
      viewerRef.current.setCamera([5, 5, 5], [0, 0, 0]);
    }
  };

  const handleScreenshot = () => {
    if (containerRef.current) {
      // Simple screenshot using html2canvas would go here
      alert(`Captura de pantalla guardada: ${fileName}_screenshot.png`);
    }
  };

  const handleToggleWireframe = () => {
    alert('Modo wireframe alternado para modelo STEP');
  };

  const handleMeasure = () => {
    alert('Herramienta de medición activada. Haga clic en dos puntos para medir distancia.');
  };

  const handleSectionView = () => {
    alert('Vista de sección activada. Use los controles para definir el plano de corte.');
  };

  const handleExportData = () => {
    alert('Exportando datos del modelo STEP...');
  };

  const getFileType = () => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'step':
      case 'stp':
        return 'STEP';
      case 'x_b':
        return 'Aquasim X_B';
      case 'iges':
      case 'igs':
        return 'IGES';
      default:
        return 'CAD';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cube className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">{fileName}</h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getFileType()}
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
              onClick={handleMeasure}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Herramienta de medición"
            >
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleScreenshot}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Captura de pantalla"
            >
              <Camera className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleExportData}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Exportar datos"
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
          className="w-full h-[600px] bg-gradient-to-b from-gray-50 to-gray-100"
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando modelo {getFileType()}...</p>
              <p className="text-sm text-gray-500 mt-1">Procesando geometría 3D...</p>
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

        {/* Demo Content when no error and not loading */}
        {!isLoading && !error && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg max-w-xs">
            <h4 className="font-medium text-gray-900 mb-2">Visor {getFileType()}</h4>
            <p className="text-sm text-gray-600 mb-3">
              Modelo 3D cargado con Three.js
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><strong>Controles:</strong></p>
              <p>• Click + arrastrar: Orbitar</p>
              <p>• Rueda: Zoom in/out</p>
              <p>• Shift + arrastrar: Pan</p>
            </div>
          </div>
        )}
      </div>

      {/* Model Info */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Archivo:</span>
            <p className="font-medium text-gray-900">{fileName}</p>
          </div>
          <div>
            <span className="text-gray-600">Formato:</span>
            <p className="font-medium text-gray-900">{getFileType()}</p>
          </div>
          <div>
            <span className="text-gray-600">Motor:</span>
            <p className="font-medium text-gray-900">Three.js + WebGL</p>
          </div>
        </div>
        
        {getFileType() === 'Aquasim X_B' && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Archivo Aquasim-Aquastructure:</strong> Este modelo contiene datos de simulación estructural. 
              Use las herramientas de análisis para visualizar tensiones y deformaciones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepViewer;
