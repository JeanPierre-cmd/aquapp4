import { describe, it, expect, vi } from 'vitest';
import { loadLocalModel } from '@/lib/three/loaders';

/* mocks GLTF y STL loaders para no requerir WebGL */
vi.mock('three/examples/jsm/loaders/GLTFLoader.js', () => {
  return {
    GLTFLoader: class {
      load(_url: string, onLoad: (gltf: any) => void) {
        onLoad({ scene: { traverse: () => {} } });
      }
    }
  };
});

vi.mock('three/examples/jsm/loaders/STLLoader.js', () => {
  return {
    STLLoader: class {
      load(_url: string, onLoad: (geo: any) => void) {
        onLoad({});
      }
    }
  };
});

describe('loadLocalModel', () => {
  it('acepta .glb', async () => {
    const file = new File([''], 'dummy.glb');
    const res = await loadLocalModel(file);
    expect(res.object).toBeDefined();
  });

  it('acepta .stl', async () => {
    const file = new File([''], 'mesh.stl');
    const res = await loadLocalModel(file);
    expect(res.object).toBeDefined();
  });

  it('rechaza formatos no soportados', async () => {
    const file = new File([''], 'foo.step');
    await expect(loadLocalModel(file)).rejects.toThrow();
  });
});
