import React, { Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { FLAGS } from '@/config/flags';

import Dashboard from '@/components/Dashboard/Dashboard';
import WaterQuality from '@/features/water/components/WaterQuality';
// import Reports from '@/features/reports/components/Reports'; // Eliminado: Usaremos el nuevo ReportsModule
import Visualization3D from '@/features/viewer3d/components/Visualization3D';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Lazy load components for code-splitting using absolute path aliases
const LocalViewer = React.lazy(
  () => import('@/features/viewer3d/pages/LocalViewer'),
);
const ImportarPage = React.lazy(
  () => import('@/features/import/ImportarPage'),
);
const Cages = React.lazy(
  () => import('@/features/cages/components/Cages'),
);
const Maintenance = React.lazy(
  () => import('@/features/maintenance/components/Maintenance'),
);
const ReportsModule = React.lazy( // Nuevo: Carga perezosa para ReportsModule
  () => import('@/features/reports/ReportsModule'),
);


const routes: RouteObject[] = [
  { path: '/', element: <Dashboard /> },
  { path: '/water', element: <WaterQuality /> },
  { path: '/viewer3d', element: <Visualization3D /> }, // legado
  {
    path: '/viewer',
    element: (
      <Suspense fallback={<div className="p-4">Cargando visor…</div>}>
        <LocalViewer />
      </Suspense>
    ),
  },
  {
    path: '/reports', // Actualizado: Ahora usa el nuevo ReportsModule con Suspense
    element: (
      <Suspense fallback={<div className="p-4">Cargando reportes…</div>}>
        <ReportsModule />
      </Suspense>
    ),
  },
  {
    path: '/cages',
    element: (
      <Suspense fallback={<div className="p-4">Cargando infraestructura...</div>}>
        <Cages />
      </Suspense>
    )
  },
  {
    path: '/maintenance',
    element: (
      <Suspense fallback={<div className="p-4">Cargando mantenimiento...</div>}>
        <Maintenance />
      </Suspense>
    )
  },
];

// Conditionally add the import route based on the feature flag and protect it
if (FLAGS.IMPORTAR_ENABLED) {
  routes.push({
    path: '/importar',
    element: (
      <ProtectedRoute roles={['admin', 'supervisor']}>
        <Suspense fallback={<div className="p-4">Cargando página de importación...</div>}>
          <ImportarPage />
        </Suspense>
      </ProtectedRoute>
    )
  });
}

export const router = createBrowserRouter(routes);
