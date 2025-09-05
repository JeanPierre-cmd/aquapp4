import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadGltf } from './loaders/loadGltf';

interface ModelFile {
  id: string;
  name: string;
  extension: string;
  blob: Blob;
  rawFile: File;
}

interface Props {
  file: ModelFile | null;
}

const ThreeViewer: React.FC<Props> = ({ file }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    /* -------- Escena básica -------- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10_000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(10, 10, 10);
    controls.update();

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    /* --------------- Carga de modelo --------------- */
    const loadModel = async () => {
      if (!file) return;

      const ext = file.extension.toLowerCase();
      const gltfEnabled =
        import.meta.env.VITE_INFRA_GLTF_ENABLED?.toString() === 'true';

      if (gltfEnabled && (ext === 'glb' || ext === 'gltf')) {
        await loadGltf(file.rawFile, scene, camera, controls);
        return;
      }

      // Resto de formatos (STEP/IGES/IFC/DXF) …
      // ... (lógica previa sin tocar) ...
    };

    loadModel();

    /* --------------- Limpieza --------------- */
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [file]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeViewer;
