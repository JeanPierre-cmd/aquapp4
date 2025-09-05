<![CDATA[
import React, { useEffect } from 'react';
import { useApsPipeline } from './useApsPipeline';

/**
 * Visualizador de modelos procesados por Autodesk Platform Services (APS).
 * – Si se proporciona una URN existente, se omite el pipeline y se muestra directamente.
 * – Si se pasa un archivo + bucketKey, se lanza el pipeline completo de subida y traducción.
 */

interface APSViewerProps {
  /** Archivo recién subido (opcional) */
  file?: File;
  /** Bucket de S3/OSS requerido solo para nuevas subidas */
  bucketKey?: string;
  /** URN ya existente (salta el pipeline) */
  urn?: string;
}

const APSViewer: React.FC<APSViewerProps> = ({
  file,
  bucketKey,
  urn: providedUrn
}) => {
  /* ---------- Lógica de pipeline ---------- */
  const pipeline = useApsPipeline();
  const isExisting = Boolean(providedUrn);

  // Estados normalizados para renderizar
  const step = isExisting ? 'ready' : pipeline.step;
  const error = isExisting ? null : pipeline.error;
  const urn = providedUrn ?? pipeline.urn;

  useEffect(() => {
    if (file && bucketKey) {
      // Lanza el pipeline únicamente cuando hay archivo y bucketKey
      pipeline.start(file, bucketKey);
    }
  }, [file, bucketKey, pipeline]);

  /* ---------- Flags ---------- */
  const multiUrnEnabled =
    (import.meta.env.VITE_INFRA_APS_MULTI as string | undefined) === 'true';

  /* ---------- UI ---------- */
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-[color:var(--textSecondary,#A3A3A3)]">
      {/* Nada seleccionado aún */}
      {!file && !isExisting && (
        <span className="text-sm opacity-75">
          Aún no se ha cargado ningún modelo.
        </span>
      )}

      {/* Pipeline en marcha o modelo listo */}
      {(file || isExisting) && (
        <>
          {step === 'uploading' && <span>Subiendo…</span>}
          {step === 'processing' && <span>Procesando en APS…</span>}
          {step === 'ready' && urn && (
            <span>
              Modelo listo — <code>{urn}</code>
            </span>
          )}
          {error && (
            <span className="text-[color:var(--error,#ef4444)]">
              Error: {typeof error === 'string' ? error : error.message}
            </span>
          )}
        </>
      )}

      {/* Mensaje experimental para flujo multi-URN */}
      {multiUrnEnabled && (
        <span className="text-xs opacity-50">
          Soporte multi-URN experimental habilitado.
        </span>
      )}
    </div>
  );
};

export default APSViewer;
]]>
