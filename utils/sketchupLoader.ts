import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface SketchUpModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

export interface SketchUpViewerOptions {
  container: HTMLElement;
  modelUrl: string;
  onLoad?: (model: SketchUpModel) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: any) => void;
}

export interface SketchUpViewer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  destroy: () => void;
  fitToView: () => void;
  setCamera: (position: number[], target: number[]) => void;
  toggleWireframe: () => void;
  setSection: (enabled: boolean, plane?: THREE.Plane) => void;
  exportScreenshot: () => string;
  getModel: () => SketchUpModel | null;
}

export const createSketchUpViewer = (options: SketchUpViewerOptions): SketchUpViewer => {
  const { container, modelUrl, onLoad, onProgress, onError } = options;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true, 
    preserveDrawingBuffer: true 
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // Scene + Camera
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8fafc);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(10, 15, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  let loadedModel: SketchUpModel | null = null;
  let wireframeMode = false;
  let initialCameraState = {
    position: new THREE.Vector3(),
    target: new THREE.Vector3()
  };

  // Load model
  const loader = new GLTFLoader();
  loader.load(
    modelUrl,
    (gltf) => {
      const root = gltf.scene;
      root.traverse((o) => { if (o instanceof THREE.Mesh) { o.castShadow = true; o.receiveShadow = true; } });
      
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      controls.target.copy(center);
      camera.position.copy(center);
      camera.position.x += size / 1.5;
      camera.position.y += size / 2.0;
      camera.position.z += size / 1.5;
      camera.lookAt(center);
      
      initialCameraState.position.copy(camera.position);
      initialCameraState.target.copy(controls.target);
      
      controls.update();
      scene.add(root);
      
      loadedModel = { scene: root, animations: gltf.animations };
      if (onLoad) onLoad(loadedModel);
    },
    (event) => {
      const progress = event.total ? (event.loaded / event.total) * 100 : 0;
      if (onProgress) onProgress(progress);
    },
    (error) => {
      if (onError) onError(error);
    }
  );

  // Animation loop
  let animationFrameId: number;
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // Handle resize
  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', onResize);

  return {
    scene,
    camera,
    renderer,
    controls,
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      if (container) container.innerHTML = "";
    },
    fitToView: () => {
      camera.position.copy(initialCameraState.position);
      controls.target.copy(initialCameraState.target);
      controls.update();
    },
    setCamera: (position: number[], target: number[]) => {
      camera.position.fromArray(position);
      controls.target.fromArray(target);
      controls.update();
    },
    toggleWireframe: () => {
      wireframeMode = !wireframeMode;
      loadedModel?.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.wireframe = wireframeMode;
        }
      });
    },
    setSection: (enabled: boolean, plane?: THREE.Plane) => {
      const sectionPlane = plane || new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      loadedModel?.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.clippingPlanes = enabled ? [sectionPlane] : null;
        }
      });
      renderer.localClippingEnabled = enabled;
    },
    exportScreenshot: () => renderer.domElement.toDataURL('image/png'),
    getModel: () => loadedModel,
  };
};

export const isSketchUpFile = (fileName: string): boolean => {
  const supportedExtensions = ['.glb', '.gltf'];
  return supportedExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

export const getSketchUpInfo = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toUpperCase() || '3D';
  return {
    software: 'Web 3D Model',
    version: 'glTF/GLB',
    format: ext,
    description: 'Interactive 3D model, compatible with web standards.'
  };
};
