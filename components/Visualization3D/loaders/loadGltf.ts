// GLTF/GLB loader específico para el módulo Infraestructura
import * as THREE from 'three';
import { fitCameraToObject } from '../utils/camera';

/**
 * Carga un archivo GLTF/GLB en la escena y ajusta la cámara.
 */
export async function loadGltf(
  rawFile: File,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls?: any
) {
  // Import dinámico: evita peso extra en el bundle principal
  const { GLTFLoader } = await import(
    'https://unpkg.com/three@0.179.1/examples/jsm/loaders/GLTFLoader.js'
  );

  const buffer = await rawFile.arrayBuffer();
  const loader = new GLTFLoader();

  return new Promise<void>((resolve, reject) => {
    loader.parse(
      buffer,
      '',
      (gltf: any) => {
        const root = gltf.scene ?? gltf.scenes?.[0];
        if (root) {
          scene.add(root);
          fitCameraToObject(camera, root, controls);
        }
        resolve();
      },
      (err) => {
        console.error('GLTF parse error', err);
        reject(err);
      }
    );
  });
}
