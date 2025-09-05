// Ajusta la cámara para encuadrar un objeto sin romper la UI
import * as THREE from 'three';

export function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  controls?: { target: THREE.Vector3 }
) {
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = (camera.fov * Math.PI) / 180;
  let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
  cameraZ *= 1.6; // margen extra

  camera.position.copy(center).add(new THREE.Vector3(cameraZ, cameraZ, cameraZ));
  camera.near = cameraZ / 1000;
  camera.far = cameraZ * 100;
  camera.updateProjectionMatrix();

  controls?.target?.copy(center);
}
