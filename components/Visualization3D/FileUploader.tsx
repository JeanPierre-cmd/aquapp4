import React, { ChangeEvent } from 'react';

interface ModelFile {
  id: string;
  name: string;
  extension: string;
  blob: Blob;
  rawFile: File;          // <- nuevo campo
}

interface Props {
  onFileReady: (file: ModelFile) => void;
}

const ACCEPTED = '.stp,.step,.iges,.igs,.ifc,.dxf,.glb,.gltf';
const ALLOWED_EXTENSIONS = ['stp', 'step', 'iges', 'igs', 'ifc', 'dxf', 'glb', 'gltf'];

const FileUploader: React.FC<Props> = ({ onFileReady }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()!.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`Extensión “${ext}” no soportada.`);
      return;
    }

    const blob = file.slice(0, file.size, file.type);
    onFileReady({
      id: crypto.randomUUID(),
      name: file.name,
      extension: ext,
      blob,
      rawFile: file
    });
  };

  return (
    <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
      Seleccionar archivo
      <input type="file" accept={ACCEPTED} onChange={handleChange} className="hidden" />
    </label>
  );
};

export default FileUploader;
