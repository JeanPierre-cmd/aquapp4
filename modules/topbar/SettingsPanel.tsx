import React, { useEffect, useRef } from 'react';

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [onClose]);

  const clearLocal = () => {
    try {
      const keep = ['auth:token']; // si tienes claves que NO quieres borrar
      Object.keys(localStorage).forEach(k => { if (!keep.includes(k)) localStorage.removeItem(k); });
      alert('Caché local limpiada.');
    } catch (e) { console.error(e); }
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border bg-white p-3 shadow-xl border-gray-200"
    >
      <h3 className="mb-2 text-sm font-semibold text-gray-900">Herramientas</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><button className="w-full text-left hover:text-blue-600 transition-colors" onClick={clearLocal}>Limpiar caché local</button></li>
        <li><button className="w-full text-left hover:text-blue-600 transition-colors" onClick={() => location.reload()}>Reiniciar interfaz</button></li>
        <li className="text-gray-400 pt-2 mt-2 border-t border-gray-200">Versión: <span className="font-medium text-gray-500">MVP</span></li>
      </ul>
    </div>
  );
}
