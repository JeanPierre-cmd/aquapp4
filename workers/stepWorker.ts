/// <reference lib="webworker" />

import initOCCT, { OCCTModule } from 'occt-import-js';

/* -----------------------------------------------------------------------------
 * Utilidades
 * -------------------------------------------------------------------------- */
let occtPromise: Promise<OCCTModule> | null = null;
function getOCCT(): Promise<OCCTModule> {
  if (!occtPromise) occtPromise = initOCCT();
  return occtPromise;
}

interface ParsedMesh {
  positions: Float32Array;
  normals: Float32Array | null;
  indices: Uint32Array | null;
}

interface ParseSuccess {
  ok: true;
  parts: ParsedMesh[];
}

interface ParseError {
  ok: false;
  error: string;
}

type WorkerResponse = ParseSuccess | ParseError;

/* -----------------------------------------------------------------------------
 * Handler del worker
 * -------------------------------------------------------------------------- */
self.onmessage = async (e: MessageEvent<ArrayBuffer>) => {
  try {
    const buffer = e.data;
    if (!(buffer instanceof ArrayBuffer)) {
      throw new Error('STEP buffer ausente o inválido');
    }

    const occt = await getOCCT();

    // occt.ReadStepFile espera Uint8Array
    const { meshes = [] } = occt.ReadStepFile(new Uint8Array(buffer));

    const parts: ParsedMesh[] = meshes.map((m: any) => {
      const pos = m.attributes?.position?.array ?? m.positions ?? [];
      const nor = m.attributes?.normal?.array ?? m.normals ?? [];
      const idx = m.index ?? m.indices ?? [];

      return {
        positions: new Float32Array(pos),
        normals: nor.length ? new Float32Array(nor) : null,
        indices: idx.length ? new Uint32Array(idx) : null,
      };
    });

    const transfer: Transferable[] = [];
    parts.forEach(({ positions, normals, indices }) => {
      transfer.push(positions.buffer);
      if (normals) transfer.push(normals.buffer);
      if (indices) transfer.push(indices.buffer);
    });

    (self as DedicatedWorkerGlobalScope).postMessage(
      { ok: true, parts } as WorkerResponse,
      transfer,
    );
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : /* eslint-disable-line  @typescript-eslint/no-unsafe-argument */ String(err);

    (self as DedicatedWorkerGlobalScope).postMessage(
      { ok: false, error: errorMsg } as WorkerResponse,
    );
  }
};
