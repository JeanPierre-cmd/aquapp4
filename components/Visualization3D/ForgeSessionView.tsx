import React from 'react';

// Si ya tienes el panel real de APS, descomenta la siguiente línea
// import ApsPanel from './aps/ApsPanel';

export default function ForgeSessionView() {
  // Si tienes ApsPanel, devuelve <ApsPanel /> y quita el placeholder:
  // return <ApsPanel />;

  // Placeholder neutro para compilar ahora mismo
  return (
    <div className="flex h-full w-full items-center justify-center text-[color:var(--textSecondary,#A3A3A3)]">
      <span>Forge (sesión) aún no implementado</span>
    </div>
  );
}
