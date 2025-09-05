import React, { useEffect, useRef, useState } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  Layers,
  Scissors,
  Camera,
  Download,
  Grid3X3,
  Ruler,
  Palette,
  Sun,
  Moon,
  EyeOff
} from 'lucide-react';
import { createSketchUpViewer, SketchUpViewer as SketchUpViewerType, getSketchUpInfo } from '../../utils/sketchupLoader';

interface SketchUpViewerProps {
  modelUrl: string;
  fileName: string;
  onError?: (error: Error) => void;
}

const SketchUpViewer: React.FC<SketchUpViewerProps> = ({ modelUrl, fileName, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<SketchUpViewerType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [sectionMode, setSectionMode] = useState(false);
  const [lightingMode, setLightingMode] = useState<'day' | 'night'>('day');

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = createSketchUpViewer({
      container: containerRef.current!,
      modelUrl,
      onLoad: (model) => {
        setIsLoading(false);
        console.log('3D model loaded:', model);
      },
      onProgress: (progress) => {
        console.log('Loading progress:', progress);
        if (progress >= 100) {
          setIsLoading(false);
        }
      },
      onError: (err) => {
        const errorMsg = err.message || 'Failed to load 3D model';
        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(new Error(errorMsg));
      }
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [modelUrl, onError]);

  const handleFitToView = () => viewerRef.current?.fitToView();
  const handleResetView = () => viewerRef.current?.fitToView();

  const handleToggleWireframe = () => {
    viewerRef.current?.toggleWireframe();
    setWireframeMode(!wireframeMode);
  };

  const handleToggleSection = () => {
    const newSectionMode = !sectionMode;
    viewerRef.current?.setSection(newSectionMode);
    setSectionMode(newSectionMode);
  };

  const handleScreenshot = () => {
    const dataURL = viewerRef.current?.exportScreenshot();
    if (dataURL) {
      const link = document.createElement('a');
      link.download = `${fileName.split('.')[0]}_screenshot.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const handleToggleLighting = () => {
    const newMode = lightingMode === 'day' ? 'night' : 'day';
    setLightingMode(newMode);
    
    if (viewerRef.current) {
      const scene = viewerRef.current.scene;
      if (newMode === 'night') {
        scene.background = new (window as any).THREE.Color(0x1a202c);
      } else {
        scene.background = new (window as any).THREE.Color(0xf8fafc);
      }
    }
  };

  const modelInfo = getSketchUpInfo(fileName);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 rounded-lg p-2">
              <Grid3X3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{fileName}</h3>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {modelInfo.format} Model
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button onClick={handleFitToView} className="p-2 rounded hover:bg-gray-200 transition-colors" title="Fit to View"><Maximize2 className="h-4 w-4 text-gray-600" /></button>
            <button onClick={handleResetView} className="p-2 rounded hover:bg-gray-200 transition-colors" title="Reset View"><RotateCcw className="h-4 w-4 text-gray-600" /></button>
            <button onClick={handleToggleWireframe} className={`p-2 rounded transition-colors ${wireframeMode ? 'bg-purple-200 text-purple-800' : 'hover:bg-gray-200 text-gray-600'}`} title="Wireframe Mode"><Layers className="h-4 w-4" /></button>
            <button onClick={handleToggleSection} className={`p-2 rounded transition-colors ${sectionMode ? 'bg-purple-200 text-purple-800' : 'hover:bg-gray-200 text-gray-600'}`} title="Section View"><Scissors className="h-4 w-4" /></button>
            <button onClick={handleToggleLighting} className="p-2 rounded hover:bg-gray-200 transition-colors" title={`Toggle ${lightingMode === 'day' ? 'Night' : 'Day'} Mode`}>
              {lightingMode === 'day' ? <Moon className="h-4 w-4 text-gray-600" /> : <Sun className="h-4 w-4 text-yellow-500" />}
            </button>
            <button onClick={handleScreenshot} className="p-2 rounded hover:bg-gray-200 transition-colors" title="Screenshot"><Camera className="h-4 w-4 text-gray-600" /></button>
            <button onClick={() => alert('Exporting model...')} className="p-2 rounded hover:bg-gray-200 transition-colors" title="Export Model"><Download className="h-4 w-4 text-gray-600" /></button>
          </div>
        </div>
      </div>

      {/* Viewer Container */}
      <div className="relative flex-grow">
        <div ref={containerRef} className="w-full h-full min-h-[600px] bg-slate-100" />
        
        {(isLoading || error) && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center text-center p-4">
            {isLoading ? (
              <div>
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">Loading 3D Model...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait while the geometry is being processed.</p>
              </div>
            ) : error && (
              <div className="max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <EyeOff className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Model</h3>
                <p className="text-gray-600 mb-4 text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-500">File:</span><p className="font-medium text-gray-800">{fileName}</p></div>
          <div><span className="text-gray-500">Format:</span><p className="font-medium text-gray-800">{modelInfo.format}</p></div>
          <div><span className="text-gray-500">Engine:</span><p className="font-medium text-gray-800">Three.js + WebGL</p></div>
          <div><span className="text-gray-500">Controls:</span><p className="font-medium text-gray-800">Orbit (Drag to rotate, Scroll to zoom)</p></div>
        </div>
      </div>
    </div>
  );
};

export default SketchUpViewer;
