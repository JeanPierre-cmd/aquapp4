import React, { useEffect, useRef } from 'react';

export type UserInfo = { name?: string; email?: string };

export default function UserMenu({
  user, onClose, onAction
}: { user?: UserInfo; onClose: () => void; onAction?: (a: 'profile'|'logout') => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [onClose]);

  const u = user ?? { name: 'Invitado', email: '' };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border bg-white p-3 shadow-xl border-gray-200"
    >
      <div className="mb-2 pb-2 border-b border-gray-200">
        <div className="text-sm font-semibold text-gray-900">{u.name}</div>
        {u.email && <div className="text-xs text-gray-500">{u.email}</div>}
      </div>
      <button className="w-full rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => onAction?.('profile')}>Perfil</button>
      <button className="mt-1 w-full rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => onAction?.('logout')}>Cerrar sesión</button>
    </div>
  );
}
