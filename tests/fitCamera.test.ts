import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { fitCameraToObject } from '@/lib/three/fitCamera';

describe('fitCameraToObject', () => {
  it('coloca la cámara a una distancia >0', () => {
    const scene = new THREE.Scene();
    const cube  = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    scene.add(cube);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(128, 128);

    fitCameraToObject(camera, cube, renderer, 'auto');

    expect(camera.position.length()).toBeGreaterThan(0);
    renderer.dispose();
  });
});
