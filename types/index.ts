export interface WaterParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  minRange: number;
  maxRange: number;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
  impactLevel?: 'positive' | 'neutral' | 'negative' | 'highly_negative';
  environmentalRisk?: 'low' | 'medium' | 'high';
}

export interface EnvironmentalParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  ranges: {
    condition: string;
    min: number;
    max: number;
    impact: 'positive' | 'neutral' | 'negative' | 'highly_negative';
    riskLevel: 'low' | 'medium' | 'high';
  }[];
  timestamp: Date;
  currentImpact: 'positive' | 'neutral' | 'negative' | 'highly_negative';
  alertLevel: 'green' | 'yellow' | 'red';
}

export interface Fish {
  id: string;
  species: string;
  age: number;
  weight: number;
  health: 'healthy' | 'sick' | 'dead';
  cageId: string;
}

export interface FeedingRecord {
  id: string;
  cageId: string;
  feedType: string;
  amount: number;
  timestamp: Date;
  feederId: string;
}

export interface Alert {
  id: string;
  type: 'water-quality' | 'feeding' | 'health' | 'equipment';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
  cageId?: string;
}

export interface Cage {
  id: string;
  name: string;
  capacity: number;
  currentPopulation: number;
  location: {
    lat: number;
    lng: number;
  };
  waterParameters: WaterParameter[];
  lastInspection: Date;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface TechnicalFile {
  id: string;
  name: string;
  type: 'dwg' | 'ipt' | 'skp' | 'aquasim' | 'pdf' | 'image' | 'aquastructure';
  size: number;
  uploadDate: Date;
  description?: string;
  category: 'structural' | 'maintenance' | 'inspection' | 'design';
  associatedCage?: string;
  metadata?: {
    version?: string;
    software?: string;
    dimensions?: string;
    material?: string;
    analysisType?: string;
    structuralData?: {
      maxStress?: string;
      safetyFactor?: string;
      fatigueLife?: string;
    };
  };
}

export interface MaintenanceTask {
  id: string;
  date: string;
  task: string;
  status: 'pending' | 'completed' | 'responsible' | 'broken';
  responsible: string;
  observations: string;
  cageId?: string;
  files?: TechnicalFile[];
}

export interface Component3D {
  id: string;
  name: string;
  type: 'shackle' | 'chain' | 'buoy' | 'anchor' | 'net' | 'frame';
  specifications: {
    material: string;
    resistance: string;
    dimensions: string;
  };
  technicalDrawing?: string;
  realPhoto?: string;
  traceability: {
    installDate: string;
    lastMaintenance: string;
    nextMaintenance: string;
  };
}
