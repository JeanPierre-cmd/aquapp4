import {
  Box3,
  Vector3,
  Object3D,
  WebGLRenderer,
  PerspectiveCamera
} from 'three';

/**
 * Centra la cámara y calcula la distancia óptima para encuadrar un objeto.
 * Permite padding dinámico pasando `'auto'`.
 *
 * @param camera    Cámara de la escena
 * @param object    Objeto cuyo bounding box se usará
 * @param renderer  Renderer activo
 * @param padding   Factor multiplicador (número) o `'auto'`
 */
export function fitCameraToObject(
  camera: PerspectiveCamera,
  object: Object3D,
  renderer: WebGLRenderer,
  padding: number | 'auto' = 'auto'
) {
  const box   = new Box3().setFromObject(object);
  const size  = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);

  // Padding dinámico simple basado en aspect ratio
  const dynPad =
    padding === 'auto'
      ? camera.aspect > 1 ? 1.15 : 1.35   // panorámico vs vertical
      : padding;

  let dist = (maxSize / 2) / Math.tan(fov / 2);
  dist *= dynPad;

  const dir = camera.position.clone().sub(center).normalize();
  camera.position.copy(center.clone().add(dir.multiplyScalar(dist)));

  camera.near = dist / 100;
  camera.far  = dist * 100;
  camera.updateProjectionMatrix();
  camera.lookAt(center);

  renderer.render(object.parent ?? object, camera);
}
