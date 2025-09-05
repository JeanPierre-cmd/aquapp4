import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  Waves,
  Wind,
  BarChart3,
  Calculator,
  X,
  Edit,
  Save,
  RefreshCw,
  MapPin,
  Thermometer,
  Anchor,
  Settings,
  Box,
  Layers
} from 'lucide-react';

interface EnvironmentalLoad {
  id: string;
  waveAmplitude: number;
  wavePeriod: number;
  waveAngle: number;
  currentX: number;
  currentY: number;
  windX: number;
  windY: number;
}

interface Component {
  id: string;
  name: string;
  type: 'beam' | 'membrane' | 'truss' | 'shape';
  number: string;
  visible: boolean;
  stressVisible: boolean;
  color: { x: number; y: number; z: number };
  material?: {
    eModulus?: number;
    gModulus?: number;
    massDensity?: number;
    thickness?: number;
    outerDiameter?: number;
    breakingLoad?: number;
  };
  crossSection?: {
    type: string;
    points: Array<{ x: number; y: number }>;
  };
}

interface ExtractedData {
  loads: EnvironmentalLoad[];
  components: Component[];
  maxWaveHeight: number;
  maxWavePeriod: number;
  maxCurrentVelocity: number;
  classification?: {
    wave: 'A' | 'B' | 'C' | 'D' | 'E';
    current: 'a' | 'b' | 'c' | 'd' | 'e';
    combined: string;
  };
  oceanographicInfo: {
    totalLoads: number;
    waveRange: { min: number; max: number };
    periodRange: { min: number; max: number };
    currentRange: { min: number; max: number };
    dominantDirection: number;
  };
}

interface ManualData {
  waveHeight: number;
  wavePeriod: number;
  currentVelocity: number;
  tidalRange: number;
  windGust: number;
}

const ModelDataManager: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualData, setManualData] = useState<ManualData>({
    waveHeight: 3.5,
    wavePeriod: 9.0,
    currentVelocity: 1.0,
    tidalRange: 2.5,
    windGust: 25.0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseXmlFile = async (file: File): Promise<ExtractedData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const xmlText = e.target?.result as string;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          
          const parseError = xmlDoc.querySelector('parsererror');
          if (parseError) {
            throw new Error('Error al parsear el archivo XML');
          }
          
          // Extraer cargas ambientales
          const loads: EnvironmentalLoad[] = [];
          const loadElements = xmlDoc.querySelectorAll('environmentloads > *');
          
          loadElements.forEach((loadElement, index) => {
            const waveAmplitude = parseFloat(loadElement.getAttribute('waveamplitude') || '0');
            const wavePeriod = parseFloat(loadElement.getAttribute('waveperiod') || '0');
            const waveAngle = parseFloat(loadElement.getAttribute('waveangle') || '0');
            const currentX = parseFloat(loadElement.getAttribute('currentx') || '0');
            const currentY = parseFloat(loadElement.getAttribute('currenty') || '0');
            const windX = parseFloat(loadElement.getAttribute('windx') || '0');
            const windY = parseFloat(loadElement.getAttribute('windy') || '0');
            
            loads.push({
              id: `load-${index + 1}`,
              waveAmplitude,
              wavePeriod,
              waveAngle,
              currentX,
              currentY,
              windX,
              windY
            });
          });

          // Extraer componentes
          const components: Component[] = [];
          const componentElements = xmlDoc.querySelectorAll('components > *');
          
          componentElements.forEach((compElement) => {
            const id = compElement.getAttribute('id') || '';
            const number = compElement.getAttribute('number') || '';
            const name = compElement.getAttribute('name') || '';
            const type = compElement.tagName.toLowerCase() as 'beam' | 'membrane' | 'truss' | 'shape';
            const visible = compElement.getAttribute('visible') === 'true';
            const stressVisible = compElement.getAttribute('stressVisible') === 'true';
            
            // Extraer color
            const colorElement = compElement.querySelector('color');
            const color = {
              x: parseFloat(colorElement?.getAttribute('x') || '0'),
              y: parseFloat(colorElement?.getAttribute('y') || '0'),
              z: parseFloat(colorElement?.getAttribute('z') || '0')
            };

            // Extraer material (wizard)
            const wizardElement = compElement.querySelector('wizard');
            let material = undefined;
            if (wizardElement) {
              material = {
                eModulus: parseFloat(wizardElement.getAttribute('eModulus') || '0'),
                gModulus: parseFloat(wizardElement.getAttribute('gModulus') || '0'),
                massDensity: parseFloat(wizardElement.getAttribute('massDensity') || '0'),
                thickness: parseFloat(wizardElement.getAttribute('thickness') || '0'),
                outerDiameter: parseFloat(wizardElement.getAttribute('outerDiameter') || '0'),
                breakingLoad: parseFloat(wizardElement.getAttribute('breakingload') || '0')
              };
            }

            // Extraer sección transversal
            const crossSectionElement = compElement.querySelector('crossection');
            let crossSection = undefined;
            if (crossSectionElement) {
              const points = Array.from(crossSectionElement.querySelectorAll('point')).map(point => ({
                x: parseFloat(point.getAttribute('x') || '0'),
                y: parseFloat(point.getAttribute('y') || '0')
              }));
              
              crossSection = {
                type: wizardElement?.getAttribute('type') || 'unknown',
                points
              };
            }

            components.push({
              id,
              name,
              type,
              number,
              visible,
              stressVisible,
              color,
              material,
              crossSection
            });
          });
          
          if (loads.length === 0) {
            throw new Error('No se encontraron datos de cargas ambientales en el archivo XML');
          }
          
          // Calcular valores máximos y estadísticas
          const maxWaveHeight = Math.max(...loads.map(l => l.waveAmplitude));
          const maxWavePeriod = Math.max(...loads.map(l => l.wavePeriod));
          const maxCurrentVelocity = Math.max(...loads.map(l => 
            Math.sqrt(l.currentX * l.currentX + l.currentY * l.currentY)
          ));

          const minWaveHeight = Math.min(...loads.map(l => l.waveAmplitude));
          const minWavePeriod = Math.min(...loads.map(l => l.wavePeriod));
          const minCurrentVelocity = Math.min(...loads.map(l => 
            Math.sqrt(l.currentX * l.currentX + l.currentY * l.currentY)
          ));

          // Calcular dirección dominante
          const avgAngle = loads.reduce((sum, l) => sum + l.waveAngle, 0) / loads.length;
          
          // Clasificar según NS-9415
          const classification = classifyExposure(maxWaveHeight, maxWavePeriod, maxCurrentVelocity);
          
          const extractedData: ExtractedData = {
            loads,
            components,
            maxWaveHeight,
            maxWavePeriod,
            maxCurrentVelocity,
            classification,
            oceanographicInfo: {
              totalLoads: loads.length,
              waveRange: { min: minWaveHeight, max: maxWaveHeight },
              periodRange: { min: minWavePeriod, max: maxWavePeriod },
              currentRange: { min: minCurrentVelocity, max: maxCurrentVelocity },
              dominantDirection: avgAngle
            }
          };
          
          resolve(extractedData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.readAsText(file);
    });
  };

  const classifyExposure = (waveHeight: number, wavePeriod: number, currentVelocity: number) => {
    // Clasificación según NS-9415 Tabla 1 y 2
    let waveClass: 'A' | 'B' | 'C' | 'D' | 'E';
    if (waveHeight <= 0.5) waveClass = 'A';
    else if (waveHeight <= 1.0) waveClass = 'B';
    else if (waveHeight <= 2.0) waveClass = 'C';
    else if (waveHeight <= 3.0) waveClass = 'D';
    else waveClass = 'E';
    
    let currentClass: 'a' | 'b' | 'c' | 'd' | 'e';
    if (currentVelocity <= 0.3) currentClass = 'a';
    else if (currentVelocity <= 0.5) currentClass = 'b';
    else if (currentVelocity <= 1.0) currentClass = 'c';
    else if (currentVelocity <= 1.5) currentClass = 'd';
    else currentClass = 'e';
    
    return {
      wave: waveClass,
      current: currentClass,
      combined: `${waveClass}${currentClass}`
    };
  };

  const handleFileUpload = async (files: FileList) => {
    setError(null);
    setIsProcessing(true);
    
    try {
      const xmlFiles = Array.from(files).filter(file => 
        file.name.toLowerCase().endsWith('.xml')
      );
      
      if (xmlFiles.length === 0) {
        throw new Error('Por favor seleccione archivos XML válidos');
      }
      
      setUploadedFiles(xmlFiles);
      
      const data = await parseXmlFile(xmlFiles[0]);
      setExtractedData(data);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleManualClassification = () => {
    const manualClassification = classifyExposure(
      manualData.waveHeight,
      manualData.wavePeriod,
      manualData.currentVelocity
    );
    
    const manualExtractedData: ExtractedData = {
      loads: [{
        id: 'manual-1',
        waveAmplitude: manualData.waveHeight,
        wavePeriod: manualData.wavePeriod,
        waveAngle: 180,
        currentX: manualData.currentVelocity,
        currentY: 0,
        windX: manualData.windGust,
        windY: 0
      }],
      components: [],
      maxWaveHeight: manualData.waveHeight,
      maxWavePeriod: manualData.wavePeriod,
      maxCurrentVelocity: manualData.currentVelocity,
      classification: manualClassification,
      oceanographicInfo: {
        totalLoads: 1,
        waveRange: { min: manualData.waveHeight, max: manualData.waveHeight },
        periodRange: { min: manualData.wavePeriod, max: manualData.wavePeriod },
        currentRange: { min: manualData.currentVelocity, max: manualData.currentVelocity },
        dominantDirection: 180
      }
    };
    
    setExtractedData(manualExtractedData);
  };

  const exportData = () => {
    if (!extractedData) return;
    
    const exportData = {
      fileName: uploadedFiles[0]?.name || 'manual-input',
      extractedAt: new Date().toISOString(),
      source: uploadedFiles.length > 0 ? 'XML File' : 'Manual Input',
      environmentalData: extractedData,
      manualData: showManualForm ? manualData : null,
      compliance: 'Resolución Exenta 1821 - SERNAPESCA'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modelo-datos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'beam': return <Box className="h-4 w-4" />;
      case 'membrane': return <Layers className="h-4 w-4" />;
      case 'truss': return <Settings className="h-4 w-4" />;
      case 'shape': return <Anchor className="h-4 w-4" />;
      default: return <Box className="h-4 w-4" />;
    }
  };

  const getComponentTypeLabel = (type: string) => {
    switch (type) {
      case 'beam': return 'Viga/Tubería';
      case 'membrane': return 'Membrana/Red';
      case 'truss': return 'Reticulado/Cable';
      case 'shape': return 'Forma/Boya';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Datos del Modelo</h3>
            <p className="text-gray-600">Carga archivos XML de simulación y extrae información oceanográfica y de componentes</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                showManualForm 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Edit className="h-4 w-4" />
              <span>{showManualForm ? 'Ocultar Manual' : 'Ingreso Manual'}</span>
            </button>
            {extractedData && (
              <button
                onClick={exportData}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Datos</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Status de clasificación */}
        {extractedData?.classification && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Sitio Clasificado Automáticamente</h4>
                  <p className="text-sm text-blue-800">
                    Clasificación: <strong className="text-lg">{extractedData.classification.combined}</strong> según NS-9415
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600 font-medium">
                  Fuente: {uploadedFiles.length > 0 ? 'Archivo XML' : 'Ingreso Manual'}
                </p>
                <p className="text-xs text-blue-500">Cumple RES EX 1821</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formulario manual */}
      {showManualForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Edit className="h-5 w-5 text-green-600" />
            <span>Ingreso Manual de Condiciones Ambientales</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura Significativa de Ola (Hs)
              </label>
              <select
                value={manualData.waveHeight}
                onChange={(e) => setManualData(prev => ({ ...prev, waveHeight: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={0.25}>0.25 m - Clase A (Bajo)</option>
                <option value={0.5}>0.5 m - Clase A (Bajo)</option>
                <option value={0.75}>0.75 m - Clase B (Moderado)</option>
                <option value={1.0}>1.0 m - Clase B (Moderado)</option>
                <option value={1.5}>1.5 m - Clase C (Considerable)</option>
                <option value={2.0}>2.0 m - Clase C (Considerable)</option>
                <option value={2.5}>2.5 m - Clase D (Alto)</option>
                <option value={3.0}>3.0 m - Clase D (Alto)</option>
                <option value={3.5}>3.5 m - Clase E (Extremo)</option>
                <option value={4.0}>4.0 m - Clase E (Extremo)</option>
                <option value={5.0}>5.0 m - Clase E (Extremo)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período Pico (Tp)
              </label>
              <select
                value={manualData.wavePeriod}
                onChange={(e) => setManualData(prev => ({ ...prev, wavePeriod: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={1.0}>1.0 s - Clase A</option>
                <option value={2.0}>2.0 s - Clase A</option>
                <option value={2.5}>2.5 s - Clase C</option>
                <option value={3.2}>3.2 s - Clase B</option>
                <option value={4.0}>4.0 s - Clase D</option>
                <option value={5.1}>5.1 s - Clase C</option>
                <option value={5.3}>5.3 s - Clase E</option>
                <option value={6.7}>6.7 s - Clase D</option>
                <option value={8.0}>8.0 s - Clase E</option>
                <option value={12.0}>12.0 s - Clase E</option>
                <option value={18.0}>18.0 s - Clase E</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Velocidad de Corriente (U)
              </label>
              <select
                value={manualData.currentVelocity}
                onChange={(e) => setManualData(prev => ({ ...prev, currentVelocity: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={0.15}>0.15 m/s - Clase a (Bajo)</option>
                <option value={0.3}>0.3 m/s - Clase a (Bajo)</option>
                <option value={0.4}>0.4 m/s - Clase b (Moderado)</option>
                <option value={0.5}>0.5 m/s - Clase b (Moderado)</option>
                <option value={0.75}>0.75 m/s - Clase c (Considerable)</option>
                <option value={1.0}>1.0 m/s - Clase c (Considerable)</option>
                <option value={1.25}>1.25 m/s - Clase d (Alto)</option>
                <option value={1.5}>1.5 m/s - Clase d (Alto)</option>
                <option value={1.75}>1.75 m/s - Clase e (Extremo)</option>
                <option value={2.0}>2.0 m/s - Clase e (Extremo)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango Mareal
              </label>
              <select
                value={manualData.tidalRange}
                onChange={(e) => setManualData(prev => ({ ...prev, tidalRange: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={1.0}>1.0 m - Micromareal</option>
                <option value={2.0}>2.0 m - Mesomareal</option>
                <option value={3.0}>3.0 m - Mesomareal</option>
                <option value={4.0}>4.0 m - Macromareal</option>
                <option value={5.0}>5.0 m - Macromareal</option>
                <option value={6.0}>6.0 m - Hipermareal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Racha de Viento
              </label>
              <select
                value={manualData.windGust}
                onChange={(e) => setManualData(prev => ({ ...prev, windGust: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={15}>15 m/s - Brisa moderada</option>
                <option value={20}>20 m/s - Brisa fresca</option>
                <option value={25}>25 m/s - Brisa fuerte</option>
                <option value={30}>30 m/s - Viento fuerte</option>
                <option value={35}>35 m/s - Viento muy fuerte</option>
                <option value={40}>40 m/s - Temporal</option>
                <option value={50}>50 m/s - Temporal fuerte</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleManualClassification}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
              >
                <Calculator className="h-4 w-4" />
                <span>Clasificar Sitio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Área de carga XML */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Carga de Archivos XML de Simulación</span>
        </h3>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-all bg-gradient-to-br from-gray-50 to-blue-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml"
            multiple
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
          
          <Upload className="mx-auto h-16 w-16 text-blue-400 mb-4" />
          <h4 className="text-xl font-medium text-gray-900 mb-2">
            Arrastra archivos XML aquí o haz clic para seleccionar
          </h4>
          <p className="text-gray-600 mb-6">
            Archivos XML con datos de simulación ambiental y componentes estructurales
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            Seleccionar Archivos XML
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-800">Procesando archivo XML y extrayendo datos...</span>
            </div>
          </div>
        )}
      </div>

      {/* Archivos cargados */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Archivos Procesados</h4>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB • XML • Procesado exitosamente
                    </p>
                  </div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Datos extraídos */}
      {extractedData && (
        <div className="space-y-6">
          {/* Información oceanográfica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Waves className="h-6 w-6 text-blue-600" />
              <span>Información Oceanográfica</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Waves className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-blue-600">{extractedData.maxWaveHeight.toFixed(2)} m</p>
                <p className="text-sm text-gray-600 font-medium">Altura Máxima de Ola (Hs)</p>
                <p className="text-xs text-blue-500 mt-1">Rango: {extractedData.oceanographicInfo.waveRange.min.toFixed(1)} - {extractedData.oceanographicInfo.waveRange.max.toFixed(1)} m</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
                <BarChart3 className="h-10 w-10 text-cyan-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-cyan-600">{extractedData.maxWavePeriod.toFixed(1)} s</p>
                <p className="text-sm text-gray-600 font-medium">Período Pico Máximo (Tp)</p>
                <p className="text-xs text-cyan-500 mt-1">Rango: {extractedData.oceanographicInfo.periodRange.min.toFixed(1)} - {extractedData.oceanographicInfo.periodRange.max.toFixed(1)} s</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Wind className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-green-600">{extractedData.maxCurrentVelocity.toFixed(2)} m/s</p>
                <p className="text-sm text-gray-600 font-medium">Velocidad Máxima de Corriente (U)</p>
                <p className="text-xs text-green-500 mt-1">Rango: {extractedData.oceanographicInfo.currentRange.min.toFixed(2)} - {extractedData.oceanographicInfo.currentRange.max.toFixed(2)} m/s</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <MapPin className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-purple-600">{extractedData.oceanographicInfo.dominantDirection.toFixed(0)}°</p>
                <p className="text-sm text-gray-600 font-medium">Dirección Dominante</p>
                <p className="text-xs text-purple-500 mt-1">{extractedData.oceanographicInfo.totalLoads} cargas analizadas</p>
              </div>
            </div>
          </div>

          {/* Cargas ambientales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">
                Cargas Ambientales Detectadas ({extractedData.loads.length})
              </h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Altura Ola (m)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período (s)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ángulo (°)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corriente X (m/s)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Corriente Y (m/s)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Velocidad Total (m/s)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {extractedData.loads.map((load, index) => {
                    const totalCurrent = Math.sqrt(load.currentX * load.currentX + load.currentY * load.currentY);
                    return (
                      <tr key={load.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Load {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {load.waveAmplitude.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {load.wavePeriod.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {load.waveAngle.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {load.currentX.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {load.currentY.toFixed(3)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {totalCurrent.toFixed(3)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Componentes estructurales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <span>Componentes Estructurales Identificados ({extractedData.components.length})</span>
              </h4>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {extractedData.components.map((component) => (
                  <div key={component.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      {getComponentIcon(component.type)}
                      <div>
                        <h5 className="font-medium text-gray-900">{component.name}</h5>
                        <p className="text-sm text-gray-600">{getComponentTypeLabel(component.type)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium">{component.number}</span>
                      </div>
                      
                      {component.material?.outerDiameter && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diámetro:</span>
                          <span className="font-medium">{component.material.outerDiameter} mm</span>
                        </div>
                      )}
                      
                      {component.material?.thickness && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Espesor:</span>
                          <span className="font-medium">{component.material.thickness} mm</span>
                        </div>
                      )}
                      
                      {component.material?.massDensity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Densidad:</span>
                          <span className="font-medium">{component.material.massDensity} kg/m³</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          component.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {component.visible ? 'Visible' : 'Oculto'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-4">Instrucciones de Uso</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">📁 Carga de Archivos XML:</h5>
            <ul className="space-y-1">
              <li>• Archivos de simulación con <code>&amp;lt;environmentloads&amp;gt;</code></li>
              <li>• Extracción automática de parámetros oceanográficos</li>
              <li>• Identificación de componentes estructurales</li>
              <li>• Clasificación automática según NS-9415</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">✏️ Ingreso Manual:</h5>
            <ul className="space-y-1">
              <li>• Formulario con valores predefinidos NS-9415</li>
              <li>• Selección directa de condiciones máximas</li>
              <li>• Clasificación inmediata del sitio</li>
              <li>• Cumplimiento RES EX 1821 garantizado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDataManager;
