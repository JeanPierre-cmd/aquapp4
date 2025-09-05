import React, { ChangeEvent } from 'react';

interface Props {
  onFileReady: (file: File) => void;
}

const ACCEPT =
  '.dwg,.dxf,.rvt,.ipt,.iam,.ifc,.stp,.step';

const ALLOWED = [
  'dwg',
  'dxf',
  'rvt',
  'ipt',
  'iam',
  'ifc',
  'stp',
  'step'
];

const ForgeUploader: React.FC<Props> = ({ onFileReady }) => {
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const ext = f.name.split('.').pop()!.toLowerCase();
    if (!ALLOWED.includes(ext)) {
      alert(`Extensión “${ext}” no soportada.`);
      return;
    }
    onFileReady(f);
  };

  return (
    <label className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
      Seleccionar archivo
      <input
        type="file"
        accept={ACCEPT}
        onChange={handle}
        className="hidden"
      />
    </label>
  );
};

export default ForgeUploader;
