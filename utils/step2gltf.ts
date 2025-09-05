// utils/step2gltf.ts
import { convert } from '@xeokit/xeokit-convert';

export async function convertStepToGltf(src: string): Promise<string> {
  const dst = src.replace(/\.(stp|step)$/, '.glb');
  
  try {
    await convert({ 
      src, 
      dst, 
      format: 'glb' 
    });
    return dst;
  } catch (error) {
    console.error('Error converting STEP to GLTF:', error);
    throw new Error(`Failed to convert ${src} to GLTF`);
  }
}

export async function convertSatToStep(src: string): Promise<string> {
  // Para archivos .sat, primero convertir a STEP
  // Esto requeriría AquaSim CLI o un conversor ACIS → STEP
  const stepFile = src.replace(/\.sat$/, '.step');
  
  // Simulación de conversión (en producción usarías AquaSim CLI)
  console.warn('SAT to STEP conversion requires AquaSim CLI');
  
  return stepFile;
}

export async function convertGeoToStep(src: string): Promise<string> {
  // Para archivos .geo (formato legacy de AquaSim)
  const stepFile = src.replace(/\.geo$/, '.step');
  
  // Simulación de conversión
  console.warn('GEO to STEP conversion requires AquaSim legacy converter');
  
  return stepFile;
}
