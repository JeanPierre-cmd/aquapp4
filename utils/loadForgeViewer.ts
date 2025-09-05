/**
 * Carga Autodesk Forge Viewer desde el CDN oficial.
 *  - Devuelve la instancia global de Autodesk una vez lista.
 *  - Evita la dependencia inexistente en npm (`forge-viewer`).
 *
 *  Ejemplo:
 *    const Autodesk = await loadForgeViewer();
 *    const viewer = new Autodesk.Viewing.GuiViewer3D(domNode);
 */
export async function loadForgeViewer(): Promise<typeof Autodesk> {
  if (typeof window === 'undefined') {
    throw new Error('Forge Viewer solo puede cargarse en el navegador.');
  }

  // Ya existe (singleton)
  if ((window as any).Autodesk?.Viewing) {
    return (window as any).Autodesk;
  }

  await import(
    /* @vite-ignore */
    'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js'
  );

  if (!(window as any).Autodesk?.Viewing) {
    throw new Error('No se pudo inicializar Autodesk Forge Viewer.');
  }

  return (window as any).Autodesk;
}
