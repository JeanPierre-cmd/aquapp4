// src/lib/three/loaders.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export interface LoadedModel {
  object: THREE.Object3D;
  dispose: () => void;
}

/**
 * Carga un archivo local (.glb/.gltf/.stl) y devuelve el objeto Three.js listo
 * para insertar en la escena.
 *
 * Si el usuario intenta abrir STEP/STP/STPZ se lanza un error indicando
 * que debe convertirlo a GLB primero (offline).
 */
export async function loadLocalModel(
  file: File,
  onProgress?: (progress: number) => void
): Promise<LoadedModel> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'glb':
    case 'gltf':
      return loadGlb(file, onProgress);
    case 'stl':
      return loadStl(file);
    default:
      throw new Error(
        `Formato no soportado: .${ext}. Conviértelo offline a .glb para visualizarlo.`
      );
  }
}

/* ───────────────────────── helpers ───────────────────────── */

async function loadGlb(
  file: File,
  onProgress?: (p: number) => void
): Promise<LoadedModel> {
  const loader = new GLTFLoader();
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        URL.revokeObjectURL(url);

        const dispose = () => {
          gltf.scene.traverse((obj: any) => {
            if (obj.geometry) obj.geometry.dispose?.();
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach((m: any) => m.dispose?.());
              } else obj.material.dispose?.();
            }
          });
        };

        resolve({ object: gltf.scene, dispose });
      },
      (ev) => onProgress?.(ev.loaded / ev.total),
      (err) => reject(err)
    );
  });
}

async function loadStl(file: File): Promise<LoadedModel> {
  const loader = new STLLoader();
  const url = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (geometry) => {
        URL.revokeObjectURL(url);

        const material = new THREE.MeshStandardMaterial({
          color: 0xd9d9d9,
          metalness: 0.1,
          roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);

        const dispose = () => {
          geometry.dispose();
          material.dispose();
        };

        resolve({ object: mesh, dispose });
      },
      undefined,
      (err) => reject(err)
    );
  });
}
