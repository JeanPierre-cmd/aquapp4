export interface Concession {
  id: string;
  user_id: string;
  name: string;
  rut?: string;
  manager: string;
  phone?: string;
  email?: string;
  established?: string;
  address?: string;
  location: string;
  water_body?: string;
  total_area?: string;
  max_depth?: string;
  latitude?: number;
  longitude?: number;
  license?: string;
  operational_status: 'Activa' | 'Inactiva' | 'Suspendida' | 'En Revisión';
  certifications?: string[];
  environmental_permits?: string[];
  created_at: string;
  updated_at: string;
}
