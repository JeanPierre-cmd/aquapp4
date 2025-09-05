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
  Edit,
  MapPin
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

interface ExtractedData {
  loads: EnvironmentalLoad[];
  maxWaveHeight: number;
  maxWavePeriod: number;
  maxCurrentVelocity: number;
  classification?: {
    wave: 'A' | 'B' | 'C' | 'D' | 'E';
    current: 'a' | 'b' | 'c' | 'd' | 'e';
    combined: string;
  };
}

interface XmlDataExtractorProps {
  onDataExtracted: (data: ExtractedData) => void;
}

const XmlDataExtractor: React.FC<XmlDataExtractorProps> = ({ onDataExtracted }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualData, setManualData] = useState({
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
            throw new Error('Error al parsear el archivo XML. Verifique el formato.');
          }
          
          const loads: EnvironmentalLoad[] = [];
          const loadElements = xmlDoc.querySelectorAll('environmentloads > *');
          
          if (loadElements.length === 0) {
            throw new Error('No se encontró la etiqueta <environmentloads> o no contiene cargas en el archivo XML.');
          }

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
              waveAmplitude, wavePeriod, waveAngle,
              currentX, currentY, windX, windY
            });
          });
          
          const maxWaveHeight = Math.max(...loads.map(l => l.waveAmplitude));
          const maxWavePeriod = Math.max(...loads.map(l => l.wavePeriod));
          const maxCurrentVelocity = Math.max(...loads.map(l => 
            Math.sqrt(l.currentX * l.currentX + l.currentY * l.currentY)
          ));
          
          const classification = classifyExposure(maxWaveHeight, maxCurrentVelocity);
          
          resolve({ loads, maxWaveHeight, maxWavePeriod, maxCurrentVelocity, classification });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsText(file);
    });
  };

  const classifyExposure = (waveHeight: number, currentVelocity: number) => {
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
    
    return { wave: waveClass, current: currentClass, combined: `${waveClass}${currentClass}` };
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setIsProcessing(true);
    setExtractedData(null);
    
    try {
      const xmlFile = Array.from(files).find(file => file.name.toLowerCase().endsWith('.xml'));
      if (!xmlFile) throw new Error('Por favor, seleccione un archivo XML válido.');
      
      setUploadedFiles([xmlFile]);
      const data = await parseXmlFile(xmlFile);
      setExtractedData(data);
      onDataExtracted(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualClassification = () => {
    const classification = classifyExposure(manualData.waveHeight, manualData.currentVelocity);
    const data: ExtractedData = {
      loads: [],
      maxWaveHeight: manualData.waveHeight,
      maxWavePeriod: manualData.wavePeriod,
      maxCurrentVelocity: manualData.currentVelocity,
      classification
    };
    setExtractedData(data);
    onDataExtracted(data);
    setUploadedFiles([]);
    setError(null);
  };

  const exportData = () => {
    if (!extractedData) return;
    const exportObj = {
      source: uploadedFiles.length > 0 ? uploadedFiles[0].name : 'Manual Input',
      timestamp: new Date().toISOString(),
      compliance: 'NS-9415 / RES EX 1821 SERNAPESCA',
      ...extractedData
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-classification-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-text">
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Clasificación de Sitio (NS-9415)</h3>
            <p className="text-textSecondary">Carga un XML de simulación o ingresa los datos manualmente.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                showManualForm 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-surface hover:bg-primary/10 border border-border'
              }`}
            >
              <Edit className="h-4 w-4" />
              <span>{showManualForm ? 'Ocultar Formulario' : 'Ingreso Manual'}</span>
            </button>
          </div>
        </div>
        {extractedData?.classification && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-primary">Sitio Clasificado: {extractedData.classification.combined}</h4>
                  <p className="text-sm text-primary/80">
                    Fuente: {uploadedFiles.length > 0 ? 'Archivo XML' : 'Ingreso Manual'} | Cumple RES EX 1821
                  </p>
                </div>
              </div>
              <button onClick={exportData} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showManualForm && (
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            <span>Ingreso Manual de Parámetros Ambientales</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Manual Inputs Here */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Altura de Ola (Hs)</label>
              <select value={manualData.waveHeight} onChange={(e) => setManualData(p => ({ ...p, waveHeight: +e.target.value }))} className="bg-background border border-border rounded-lg px-3 py-2">
                <option value={3.5}>3.5 m - Clase E (Extremo)</option>
                <option value={2.5}>2.5 m - Clase D (Alto)</option>
                <option value={1.5}>1.5 m - Clase C (Considerable)</option>
                <option value={0.75}>0.75 m - Clase B (Moderado)</option>
                <option value={0.25}>0.25 m - Clase A (Bajo)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Velocidad Corriente (U)</label>
              <select value={manualData.currentVelocity} onChange={(e) => setManualData(p => ({ ...p, currentVelocity: +e.target.value }))} className="bg-background border border-border rounded-lg px-3 py-2">
                <option value={1.75}>1.75 m/s - Clase e (Extremo)</option>
                <option value={1.25}>1.25 m/s - Clase d (Alto)</option>
                <option value={0.75}>0.75 m/s - Clase c (Considerable)</option>
                <option value={0.4}>0.4 m/s - Clase b (Moderado)</option>
                <option value={0.15}>0.15 m/s - Clase a (Bajo)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleManualClassification} className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 font-semibold">
                <Calculator className="h-4 w-4" />
                <span>Clasificar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors bg-surface cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept=".xml" onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
        <div className="mx-auto w-fit bg-primary/10 text-primary p-4 rounded-full mb-4">
          <Upload className="h-8 w-8" />
        </div>
        <h4 className="text-lg font-semibold mb-1">Arrastra tu archivo XML o haz clic para seleccionar</h4>
        <p className="text-textSecondary">Se extraerán automáticamente los datos de simulación ambiental.</p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-error" />
          <span className="text-error/80 font-medium">{error}</span>
        </div>
      )}
      {isProcessing && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-primary/80 font-medium">Procesando archivo XML...</span>
        </div>
      )}

      {uploadedFiles.length > 0 && !error && (
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h4 className="font-medium mb-3">Archivo Cargado</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-textSecondary">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          ))}
        </div>
      )}

      {extractedData && (
        <div className="space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h4 className="font-medium mb-4">Parámetros Ambientales Máximos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg border border-border">
                <Waves className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{extractedData.maxWaveHeight.toFixed(2)} m</p>
                <p className="text-sm text-textSecondary">Altura Máx. de Ola (Hs)</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border border-border">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{extractedData.maxWavePeriod.toFixed(1)} s</p>
                <p className="text-sm text-textSecondary">Período Pico Máx. (Tp)</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg border border-border">
                <Wind className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{extractedData.maxCurrentVelocity.toFixed(2)} m/s</p>
                <p className="text-sm text-textSecondary">Velocidad Máx. Corriente (U)</p>
              </div>
            </div>
          </div>

          {extractedData.classification && (
            <div className="bg-surface rounded-xl p-6 border border-border">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span>Clasificación Automática NS-9415</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background rounded-lg border border-border">
                  <h5 className="font-semibold mb-2">Oleaje</h5>
                  <div className="text-3xl font-bold text-primary mb-2">{extractedData.classification.wave}</div>
                  <p className="text-xs text-textSecondary">Tabla 1 NS-9415</p>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border border-border">
                  <h5 className="font-semibold mb-2">Corriente</h5>
                  <div className="text-3xl font-bold text-primary mb-2">{extractedData.classification.current}</div>
                  <p className="text-xs text-textSecondary">Tabla 2 NS-9415</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h5 className="font-semibold text-primary mb-2">Combinada</h5>
                  <div className="text-3xl font-bold text-primary mb-2">{extractedData.classification.combined}</div>
                  <p className="text-xs text-primary/80">Clasificación Final</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XmlDataExtractor;
