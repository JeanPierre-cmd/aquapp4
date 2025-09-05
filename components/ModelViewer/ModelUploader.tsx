import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileText,
  Box,
  Layers
} from 'lucide-react';
import { uploadModelFile, ModelData } from '../../utils/forgeViewer';
import { processAvzFile } from '../../utils/avzProcessor';

interface ModelUploaderProps {
  onUploadComplete: (modelData: ModelData) => void;
  onError?: (error: Error) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  modelData?: ModelData;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({ onUploadComplete, onError }) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploads: UploadingFile[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploads]);

    // Process each file
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      
      try {
        // Simulate upload progress
        const updateProgress = (progress: number) => {
          setUploadingFiles(prev => prev.map(upload => 
            upload.file === file 
              ? { ...upload, progress, status: progress < 100 ? 'uploading' : 'processing' }
              : upload
          ));
        };

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          updateProgress(progress);
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Check if it's an AVZ file
        const isAvzFile = file.name.toLowerCase().endsWith('.avz');
        
        let modelData: ModelData;
        
        if (isAvzFile) {
          // Process AVZ file
          const processedAvz = await processAvzFile(file);
          modelData = {
            urn: `avz_${Date.now()}`,
            name: file.name,
            status: 'ready',
            avzData: processedAvz
          };
        } else {
          // Upload regular file
          modelData = await uploadModelFile(file);
        }
        
        setUploadingFiles(prev => prev.map(upload => 
          upload.file === file 
            ? { ...upload, status: 'complete', modelData }
            : upload
        ));

        onUploadComplete(modelData);

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Upload failed';
        
        setUploadingFiles(prev => prev.map(upload => 
          upload.file === file 
            ? { ...upload, status: 'error', error: errorMsg }
            : upload
        ));

        if (onError) onError(error as Error);
      }
    }
  }, [onUploadComplete, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.dwg', '.ipt', '.step', '.stp', '.x_b', '.iges', '.igs', '.skp'],
      'application/zip': ['.avz'],
      'application/x-zip-compressed': ['.avz'],
      'application/step': ['.step', '.stp'],
      'model/step': ['.step', '.stp'],
      'application/iges': ['.iges', '.igs'],
    },
    multiple: true
  });

  const removeUpload = (file: File) => {
    setUploadingFiles(prev => prev.filter(upload => upload.file !== file));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'dwg':
        return <FileText className="h-8 w-8 text-blue-600" />;
      case 'ipt':
        return <Box className="h-8 w-8 text-green-600" />;
      case 'skp':
        return <Box className="h-8 w-8 text-orange-600" />;
      case 'step':
      case 'stp':
        return <Layers className="h-8 w-8 text-purple-600" />;
      case 'x_b':
        return <Layers className="h-8 w-8 text-cyan-600" />;
      default:
        return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'dwg':
        return 'AutoCAD Drawing';
      case 'ipt':
        return 'Inventor Part';
      case 'skp':
        return 'SketchUp Model';
      case 'step':
      case 'stp':
        return 'STEP File';
      case 'x_b':
        return 'Aquasim X_B';
      case 'iges':
      case 'igs':
        return 'IGES File';
      default:
        return 'CAD File';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos CAD aquí'}
        </h3>
        <p className="text-gray-600 mb-4">
          o haz clic para seleccionar archivos
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">DWG</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">IPT</span>
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">SKP</span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">STEP</span>
          <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded">X_B</span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">IGES</span>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Archivos en Proceso</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {uploadingFiles.map((upload, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(upload.file.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 truncate">
                          {upload.file.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {getFileTypeLabel(upload.file.name)} • {formatFileSize(upload.file.size)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {upload.status === 'complete' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {upload.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <button
                          onClick={() => removeUpload(upload.file)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {(upload.status === 'uploading' || upload.status === 'processing') && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {upload.status === 'uploading' ? 'Subiendo...' : 'Procesando...'}
                          </span>
                          <span className="text-gray-600">{upload.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Messages */}
                    {upload.status === 'complete' && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Archivo procesado exitosamente</span>
                      </div>
                    )}
                    
                    {upload.status === 'error' && (
                      <div className="flex items-center space-x-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{upload.error || 'Error al procesar archivo'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">Formatos Soportados</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Autodesk (via Forge):</h5>
            <ul className="space-y-1">
              <li>• <strong>DWG:</strong> AutoCAD Drawing files</li>
              <li>• <strong>IPT:</strong> Inventor Part files</li>
              <li>• <strong>IAM:</strong> Inventor Assembly files</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">CAD Estándar:</h5>
            <ul className="space-y-1">
              <li>• <strong>SKP:</strong> SketchUp Model files</li>
              <li>• <strong>STEP:</strong> Standard for Exchange of Product Data</li>
              <li>• <strong>X_B:</strong> Aquasim-Aquastructure output</li>
              <li>• <strong>IGES:</strong> Initial Graphics Exchange Specification</li>
              <li>• <strong>AVZ:</strong> AquaSim Project Archive (ZIP)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los archivos DWG e IPT se procesan con Autodesk Forge para máxima compatibilidad. 
            Los archivos STEP, SKP y X_B se visualizan directamente con Three.js. Los archivos AVZ se descomprimen y convierten automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelUploader;
