import * as THREE from 'three';

export type LightingPreset = 'neutral' | 'studio' | 'sunset' | 'dramatic';

/** 
 * Elimina luces previas (grupo "lighting") y añade un preset nuevo 
 */
export function applyLighting(scene: THREE.Scene, preset: LightingPreset) {
  const prev = scene.getObjectByName('lighting') as THREE.Group | undefined;
  if (prev) scene.remove(prev);

  const group = new THREE.Group();
  group.name = 'lighting';

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  group.add(ambient);

  const addDirectional = (
    color: number,
    intensity: number,
    position: THREE.Vector3
  ) => {
    const dir = new THREE.DirectionalLight(color, intensity);
    dir.position.copy(position);
    dir.castShadow = true;
    group.add(dir);
  };

  switch (preset) {
    case 'studio':
      addDirectional(0xffffff, 1, new THREE.Vector3(5, 10, 7.5));
      addDirectional(0xffffff, 0.5, new THREE.Vector3(-5, -10, -7.5));
      break;

    case 'sunset':
      addDirectional(0xffd1a4, 1, new THREE.Vector3(0, 5, 10));
      addDirectional(0xff7b00, 0.5, new THREE.Vector3(-5, 2, -5));
      break;

    case 'dramatic':
      addDirectional(0xffffff, 1.5, new THREE.Vector3(2, 6, 2));
      break;

    default: // neutral
      addDirectional(0xffffff, 0.8, new THREE.Vector3(3, 10, 5));
      break;
  }

  scene.add(group);
}
