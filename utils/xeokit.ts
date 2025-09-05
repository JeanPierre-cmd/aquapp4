// Xeokit utilities for STEP and X_B files
import * as THREE from 'three';

export interface StepViewerOptions {
  container: HTMLElement;
  modelUrl: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface XeokitViewer {
  destroy: () => void;
  fitToView: () => void;
  setCamera: (position: number[], target: number[]) => void;
}

// Simple Three.js based viewer for STEP/X_B files
export const createStepViewer = (options: StepViewerOptions): XeokitViewer => {
  const { container, modelUrl, onLoad, onError } = options;

  // Create Three.js scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Controls (basic orbit)
  let isMouseDown = false;
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let rotationX = 0;
  let rotationY = 0;

  const onMouseDown = (event: MouseEvent) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  const onMouseUp = () => {
    isMouseDown = false;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isMouseDown) return;

    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;

    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const scale = event.deltaY > 0 ? 1.1 : 0.9;
    camera.position.multiplyScalar(scale);
  };

  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mouseup', onMouseUp);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('wheel', onWheel);

  // Load model (simulate for now)
  const loadModel = async () => {
    try {
      // Create a sample geometry for demonstration
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshLambertMaterial({ 
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // Add wireframe
      const wireframe = new THREE.WireframeGeometry(geometry);
      const line = new THREE.LineSegments(wireframe);
      (line.material as THREE.LineBasicMaterial).color.setHex(0x000000);
      scene.add(line);

      if (onLoad) onLoad();
    } catch (error) {
      if (onError) onError(error as Error);
    }
  };

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Smooth rotation
    rotationX += (targetRotationX - rotationX) * 0.1;
    rotationY += (targetRotationY - rotationY) * 0.1;

    // Apply rotation to camera around origin
    const radius = camera.position.length();
    camera.position.x = radius * Math.sin(rotationY) * Math.cos(rotationX);
    camera.position.y = radius * Math.sin(rotationX);
    camera.position.z = radius * Math.cos(rotationY) * Math.cos(rotationX);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  // Handle resize
  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener('resize', onResize);

  // Start
  loadModel();
  animate();

  // Return viewer interface
  return {
    destroy: () => {
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    },
    fitToView: () => {
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
    },
    setCamera: (position: number[], target: number[]) => {
      camera.position.set(position[0], position[1], position[2]);
      camera.lookAt(target[0], target[1], target[2]);
    }
  };
};
