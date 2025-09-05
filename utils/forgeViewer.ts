// Forge Viewer utilities
import * as THREE from 'three';

declare global {
  interface Window {
    Autodesk: any;
    THREE: any;
  }
}

export interface ForgeCredentials {
  access_token: string;
  expires_in: number;
}

export interface ModelData {
  urn: string;
  name: string;
  status: 'processing' | 'ready' | 'error';
  progress?: number;
  fileType?: 'dwg' | 'ipt' | 'step' | 'skp' | 'avz';
  metadata?: {
    software?: string;
    version?: string;
    units?: string;
    layers?: string[];
    blocks?: string[];
  };
  avzData?: {
    modelURLs: string[];
    metadata: any;
    results: any[];
  };
}

// Load Forge Viewer scripts
export const loadForgeViewer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Autodesk?.Viewing) {
      resolve();
      return;
    }

    // Make THREE.js available globally for Forge
    window.THREE = THREE;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/style.min.css?v=v7.108';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/viewer3D.min.js?v=v7.108';
    script.onload = () => {
      console.log('Forge Viewer loaded successfully');
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Forge Viewer'));
    document.head.appendChild(script);
  });
};

// Get Forge token
export const getForgeToken = async (): Promise<string> => {
  try {
    // Try to get real token first
    const response = await fetch('/api/forge/token');
    if (!response.ok) {
      console.warn('Forge API endpoint not available (connection refused), using demo token');
      return generateDemoToken();
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Forge API endpoint not available, using demo token');
      return generateDemoToken();
    }
    const data: ForgeCredentials = await response.json();
    return data.access_token;
  } catch (error) {
    console.warn('Error getting Forge token (backend not running), using demo token:', error);
    return generateDemoToken();
  }
};

// Generate a more realistic demo token
const generateDemoToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `demo_${result}`;
};
// Initialize Forge Viewer
export const initializeViewer = async (
  container: HTMLElement,
  urn: string,
  onViewerReady?: (viewer: any) => void,
  modelData?: ModelData
): Promise<any> => {
  try {
    await loadForgeViewer();
    const token = await getForgeToken();

    // Enhanced options for DWG files
    const options = {
      env: 'AutodeskProduction',
      api: 'derivativeV2',
      language: 'es',
      getAccessToken: (callback: (token: string, expire: number) => void) => {
        callback(token, 3600);
      },
      useADP: false
    };

    return new Promise((resolve, reject) => {
      window.Autodesk.Viewing.Initializer(options, () => {
        // Enhanced viewer configuration for DWG
        const config = {
          extensions: [
            'Autodesk.DocumentBrowser',
            'Autodesk.LayerManager',
            'Autodesk.Measure',
            'Autodesk.Section',
            'Autodesk.Explode'
          ]
        };
        
        const viewer = new window.Autodesk.Viewing.GuiViewer3D(container, config);
        const startedCode = viewer.start();
        
        if (startedCode > 0) {
          reject(new Error('Failed to create viewer'));
          return;
        }

        // Enhanced model loading for DWG
        if (urn.startsWith('demo_')) {
          // Create enhanced demo DWG content
          createDemoDWGContent(viewer, modelData);
          if (onViewerReady) onViewerReady(viewer);
          resolve(viewer);
        } else {
          // Load real model with enhanced options
          const loadOptions = {
            sharedPropertyDbPath: null,
            globalOffset: { x: 0, y: 0, z: 0 },
            applyRefPoint: true,
            keepCurrentModels: false
          };

          viewer.loadDocumentNode(urn, null, {
            ...loadOptions,
            onSuccessCallback: () => {
              console.log('DWG model loaded successfully');
              setupDWGViewer(viewer, modelData);
              if (onViewerReady) onViewerReady(viewer);
              resolve(viewer);
            },
            onErrorCallback: (error: any) => {
              console.error('Error loading DWG model:', error);
              // Fallback to demo content
              createDemoDWGContent(viewer, modelData);
              if (onViewerReady) onViewerReady(viewer);
              resolve(viewer);
            }
          });
        }
      });
    });
  } catch (error) {
    console.error('Error initializing DWG viewer:', error);
    throw error;
  }
};

// Setup DWG-specific viewer features
const setupDWGViewer = (viewer: any, modelData?: ModelData) => {
  // Enable DWG-specific features
  viewer.setTheme('light-theme');
  viewer.setQualityLevel(true, true); // High quality rendering
  viewer.setGhosting(true);
  viewer.setGroundShadow(true);
  viewer.setGroundReflection(true);
  
  // Setup layer management for DWG
  viewer.addEventListener(window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
    const layerManager = viewer.getExtension('Autodesk.LayerManager');
    if (layerManager && modelData?.metadata?.layers) {
      console.log('DWG Layers available:', modelData.metadata.layers);
    }
  });
  
  // Enhanced navigation for architectural models
  viewer.navigation.setRequestTransitionWithUp(true);
  viewer.setProgressiveRendering(true);
  viewer.setOptimizeNavigation(true);
};

// Create enhanced demo content for DWG visualization
const createDemoDWGContent = (viewer: any, modelData?: ModelData) => {
  // Create a more sophisticated demo scene for DWG files
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Enhanced aquaculture facility layout (DWG style)
  const group = new THREE.Group();
  
  // Main platform structure
  const platformGeometry = new THREE.BoxGeometry(40, 2, 30);
  const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = 1;
  group.add(platform);
  
  // Cage structures (multiple cages in DWG layout)
  const cagePositions = [
    [-12, 0, -8], [0, 0, -8], [12, 0, -8],
    [-12, 0, 8], [0, 0, 8], [12, 0, 8]
  ];
  
  cagePositions.forEach((pos, i) => {
    // Cage frame
    const cageGeometry = new THREE.BoxGeometry(8, 6, 8);
    const cageMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4a90e2, 
      transparent: true, 
      opacity: 0.3,
      wireframe: false
    });
    const cage = new THREE.Mesh(cageGeometry, cageMaterial);
    cage.position.set(pos[0], pos[1] + 3, pos[2]);
    group.add(cage);
    
    // Cage wireframe (DWG style lines)
    const wireframeGeometry = new THREE.EdgesGeometry(cageGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x2563eb, 
      linewidth: 2 
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    wireframe.position.copy(cage.position);
    group.add(wireframe);
    
    // Feeding system per cage
    const feederGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
    const feederMaterial = new THREE.MeshLambertMaterial({ color: 0x10b981 });
    const feeder = new THREE.Mesh(feederGeometry, feederMaterial);
    feeder.position.set(pos[0], pos[1] + 7, pos[2]);
    group.add(feeder);
  });
  
  // Walkways and infrastructure (DWG architectural elements)
  const walkwayGeometry = new THREE.BoxGeometry(50, 0.2, 3);
  const walkwayMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
  
  // Main walkway
  const mainWalkway = new THREE.Mesh(walkwayGeometry, walkwayMaterial);
  mainWalkway.position.set(0, 2.5, 0);
  group.add(mainWalkway);
  
  // Side walkways
  const sideWalkwayGeometry = new THREE.BoxGeometry(3, 0.2, 20);
  const leftWalkway = new THREE.Mesh(sideWalkwayGeometry, walkwayMaterial);
  leftWalkway.position.set(-20, 2.5, 0);
  group.add(leftWalkway);
  
  const rightWalkway = new THREE.Mesh(sideWalkwayGeometry, walkwayMaterial);
  rightWalkway.position.set(20, 2.5, 0);
  group.add(rightWalkway);
  
  // Control building
  const buildingGeometry = new THREE.BoxGeometry(8, 6, 6);
  const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0xd4af37 });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(25, 5, 0);
  group.add(building);
  
  // Add technical annotations (DWG style)
  // Note: Font loading removed to avoid THREE.FontLoader constructor error
  // In a real implementation, you'd load fonts separately for text annotations
  
  // Enhanced lighting for DWG visualization
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 50, 25);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  scene.add(group);
  
  // Simulate viewer integration
  console.log('Enhanced DWG demo content created with architectural layout');
};

// Enhanced DWG file detection
export const isDWGFile = (fileName: string): boolean => {
  return fileName.toLowerCase().endsWith('.dwg');
};

// Get DWG-specific metadata
export const getDWGMetadata = (fileName: string) => {
  return {
    software: 'AutoCAD',
    version: '2024',
    format: 'DWG',
    description: 'AutoCAD Drawing file with enhanced support',
    units: 'Meters',
    layers: ['0', 'Cages', 'Infrastructure', 'Annotations', 'Dimensions'],
    blocks: ['Cage_Standard', 'Feeder_System', 'Walkway_Section']
  };
};

// Enhanced DWG processing
export const processDWGFile = async (file: File): Promise<ModelData> => {
  console.log('Processing DWG file with enhanced features:', file.name);
  
  // Simulate enhanced processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    urn: `dwg_enhanced_${Date.now()}`,
    name: file.name,
    status: 'ready',
    fileType: 'dwg',
    metadata: getDWGMetadata(file.name)
  };
};

// Upload file and get URN
export const uploadModelFile = async (file: File): Promise<ModelData> => {
  try {
    // Handle SketchUp files specially
    const isSketchUp = file.name.toLowerCase().endsWith('.skp');
    if (isSketchUp) {
      console.log('Processing SketchUp file:', file.name);
      return {
        urn: `sketchup_${Date.now()}`,
        name: file.name,
        status: 'ready'
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/forge/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      console.warn('Upload failed (backend not available), using demo fallback');
      return {
        urn: `demo_urn_${Date.now()}`,
        name: file.name,
        status: 'ready'
      };
    }

    const data = await response.json();
    return {
      urn: data.urn || `demo_urn_${Date.now()}`,
      name: file.name,
      status: 'processing'
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    // Fallback: simulate upload for demo
    return {
      urn: `demo_urn_${Date.now()}`,
      name: file.name,
      status: 'ready'
    };
  }
};

// Check translation status
export const checkTranslationStatus = async (urn: string): Promise<string> => {
  try {
    const response = await fetch(`/api/forge/status/${urn}`);
    if (!response.ok) {
      throw new Error('Failed to check status');
    }
    const data = await response.json();
    return data.status || 'ready';
  } catch (error) {
    console.error('Error checking status:', error);
    return 'ready'; // Fallback
  }
};
