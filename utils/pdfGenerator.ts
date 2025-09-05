import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { WaterParameter } from '../types';

// Extend the jsPDF interface to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface WaterQualityReportData {
  reportDate: Date;
  parameters: WaterParameter[];
  observations: string;
}

export interface HealthReportData {
  reportInfo: {
    reportNumber: string;
    reportDate: Date;
    certifier: string;
    veterinarian: string;
  };
  concessionInfo: {
    name: string;
    rut: string;
    concessionCode: string;
    waterBody: string;
  };
  cageData: {
    id: string;
    species: string;
    population: number;
    biomass: number;
    origin: string;
  }[];
  healthAnalysis: {
    overallStatus: string;
    observations: string;
  };
}

export interface ExecutiveReportData {
  title: string;
  period: 'month' | 'quarter' | 'year';
  generatedAt: string; // ISO string
  centers: {
    id: string;
    name: string;
    location: string;
    metrics: {
      efficiency: number;
      maintenance: number;
      safety: number;
      compliance: number;
      productivity: number;
    };
    status: 'excellent' | 'good' | 'warning' | 'critical';
    criticalComponents: number;
    lastInspection: Date;
  }[];
  kpis: {
    title: string;
    value: string;
    trend: 'up' | 'down';
    change: string;
    status: string; // 'good', 'excellent', 'warning', 'critical'
  }[];
  maintenanceCycles: {
    component: string;
    currentCycle: number;
    totalCycles: number;
    nextMaintenance: Date;
    status: 'optimal' | 'attention' | 'urgent';
    wearLevel: number;
  }[];
  recommendations: string[];
}

export interface FeedingReportData {
  reportDate: Date;
  periodType: 'daily' | 'weekly' | 'monthly' | 'custom';
  selectedCage: string;
  dateRange: {
    start: string;
    end: string;
  };
  feedingMetrics: {
    period: string;
    totalFeed: number;
    averageFCR: number;
    feedingEfficiency: number;
    costPerKg: number;
    growthRate: number;
    mortality: number;
    feedingEvents: number;
  }[];
  cagePerformance: {
    cageId: string;
    fcr: number;
    efficiency: number;
    growth: number;
    cost: number;
  }[];
  feedTypeUsage: {
    type: string;
    usage: number; // in percentage
    cost: number;
    percentage: number; // redundant but kept for consistency with original data
  }[];
}

export interface MaintenanceReportData {
  reportDate: Date;
  period: string; // e.g., "Mensual", "Trimestral"
  centerName: string;
  summary: string;
  tasks: {
    id: string;
    component: string;
    description: string;
    status: 'Pendiente' | 'Completado' | 'En progreso' | 'Retrasado';
    responsible: string;
    dueDate: Date;
    completionDate?: Date;
    priority: 'Alta' | 'Media' | 'Baja';
  }[];
  componentHealth: {
    name: string;
    lastMaintenance: Date;
    nextMaintenance: Date;
    wearLevel: number; // Percentage
    condition: 'Óptimo' | 'Desgaste' | 'Crítico';
  }[];
  recommendations: string[];
}

// NEW: Interface for Alerts Report Data
export interface AlertsReportData {
  reportDate: Date;
  period: string; // e.g., "Últimos 7 días", "Mensual", "Trimestral"
  centerName: string;
  summary: string;
  alerts: {
    id: string;
    type: string; // e.g., "Calidad de Agua", "Salud de Peces", "Mantenimiento"
    severity: 'Crítica' | 'Alta' | 'Media' | 'Baja';
    timestamp: Date;
    description: string;
    status: 'Activa' | 'Resuelta' | 'En progreso';
    affectedComponent: string; // e.g., "Jaula A-1", "Sensor pH", "Alimentador"
    actionTaken?: string;
  }[];
  kpis: {
    totalAlerts: number;
    resolvedAlerts: number;
    activeAlerts: number;
    avgResolutionTimeHours: number;
  };
  recommendations: string[];
}

export const generateSampleHealthReport = (): HealthReportData => ({
  reportInfo: {
    reportNumber: `IS-2024-${Math.floor(Math.random() * 1000)}`,
    reportDate: new Date(),
    certifier: 'AquaCertify S.A.',
    veterinarian: 'Dr. Juan Pérez (Reg. 1234)',
  },
  concessionInfo: {
    name: 'Salmones del Sur S.A.',
    rut: '76.123.456-7',
    concessionCode: '103456',
    waterBody: 'Seno de Reloncaví',
  },
  cageData: [
    { id: 'A-1', species: 'Salmo Salar', population: 4850, biomass: 19.4, origin: 'Piscicultura Río Bueno' },
    { id: 'A-2', species: 'Salmo Salar', population: 4920, biomass: 19.7, origin: 'Piscicultura Río Bueno' },
    { id: 'B-1', species: 'Salmo Salar', population: 4200, biomass: 16.8, origin: 'Piscicultura Río Bueno' },
  ],
  healthAnalysis: {
    overallStatus: 'La población de peces se encuentra en buen estado sanitario, sin signos clínicos de enfermedades de alto riesgo. Se observa una baja carga parasitaria de Caligus, bajo los umbrales de tratamiento definidos por el PSEVC.',
    observations: 'Se recomienda mantener las buenas prácticas de bioseguridad y continuar con el monitoreo semanal según los programas sanitarios vigentes.',
  },
});

export const generateSampleFeedingReport = (): FeedingReportData => ({
  reportDate: new Date(),
  periodType: 'weekly',
  selectedCage: 'all',
  dateRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  feedingMetrics: [
    {
      period: 'Semana 1',
      totalFeed: 8750,
      averageFCR: 1.15,
      feedingEfficiency: 94.2,
      costPerKg: 1.68,
      growthRate: 2.3,
      mortality: 0.8,
      feedingEvents: 42
    },
    {
      period: 'Semana 2',
      totalFeed: 9200,
      averageFCR: 1.18,
      feedingEfficiency: 92.8,
      costPerKg: 1.72,
      growthRate: 2.1,
      mortality: 0.6,
      feedingEvents: 44
    },
    {
      period: 'Semana 3',
      totalFeed: 8950,
      averageFCR: 1.12,
      feedingEfficiency: 96.1,
      costPerKg: 1.65,
      growthRate: 2.5,
      mortality: 0.7,
      feedingEvents: 43
    },
    {
      period: 'Semana 4',
      totalFeed: 9100,
      averageFCR: 1.16,
      feedingEfficiency: 93.5,
      costPerKg: 1.70,
      growthRate: 2.2,
      mortality: 0.9,
      feedingEvents: 45
    }
  ],
  cagePerformance: [
    { cageId: 'A-1', fcr: 1.12, efficiency: 96.2, growth: 2.4, cost: 1.65 },
    { cageId: 'A-2', fcr: 1.18, efficiency: 93.8, growth: 2.1, cost: 1.72 },
    { cageId: 'A-3', fcr: 1.15, efficiency: 94.5, growth: 2.3, cost: 1.68 },
    { cageId: 'B-1', fcr: 1.22, efficiency: 91.2, growth: 1.9, cost: 1.78 },
    { cageId: 'B-2', fcr: 1.14, efficiency: 95.1, growth: 2.2, cost: 1.67 }
  ],
  feedTypeUsage: [
    { type: 'Pellets Premium 6mm', usage: 45, cost: 83250, percentage: 45 },
    { type: 'Pellets Estándar 4mm', usage: 30, cost: 43500, percentage: 30 },
    { type: 'Pellets Juvenil 3mm', usage: 20, cost: 42000, percentage: 20 },
    { type: 'Suplemento Vitamínico', usage: 5, cost: 17500, percentage: 5 }
  ]
});

export const generateSampleMaintenanceReport = (): MaintenanceReportData => ({
  reportDate: new Date(),
  period: 'Trimestral (Ene-Mar 2024)',
  centerName: 'Centro Acuícola Reloncaví',
  summary: 'El centro ha mantenido un alto nivel de cumplimiento en las tareas de mantenimiento preventivo y correctivo. Se han identificado áreas de mejora en la gestión de repuestos para componentes críticos, lo que podría optimizar los tiempos de respuesta.',
  tasks: [
    {
      id: 'MT-001',
      component: 'Red de Contención Jaula A-1',
      description: 'Inspección y reparación de desgarros menores en red.',
      status: 'Completado',
      responsible: 'Equipo de Mantenimiento A',
      dueDate: new Date('2024-01-15'),
      completionDate: new Date('2024-01-14'),
      priority: 'Alta',
    },
    {
      id: 'MT-002',
      component: 'Sistema de Anclaje Jaula B-2',
      description: 'Revisión de tensión de líneas de fondeo y estado de grilletes.',
      status: 'Completado',
      responsible: 'Equipo de Mantenimiento B',
      dueDate: new Date('2024-02-01'),
      completionDate: new Date('2024-01-30'),
      priority: 'Media',
    },
    {
      id: 'MT-003',
      component: 'Boyas de Flotación Jaula C-3',
      description: 'Limpieza y verificación de flotabilidad.',
      status: 'En progreso',
      responsible: 'Equipo de Mantenimiento A',
      dueDate: new Date('2024-03-10'),
      priority: 'Baja',
    },
    {
      id: 'MT-004',
      component: 'Sensores de Oxígeno Disuelto',
      description: 'Calibración y reemplazo de sonda en Jaula A-1.',
      status: 'Retrasado',
      responsible: 'Técnico Especializado',
      dueDate: new Date('2024-02-20'),
      priority: 'Alta',
    },
    {
      id: 'MT-005',
      component: 'Alimentador Automático Jaula B-1',
      description: 'Mantenimiento preventivo y limpieza de tolva.',
      status: 'Pendiente',
      responsible: 'Equipo de Mantenimiento B',
      dueDate: new Date('2024-03-25'),
      priority: 'Media',
    },
  ],
  componentHealth: [
    {
      name: 'Redes de Contención',
      lastMaintenance: new Date('2024-01-14'),
      nextMaintenance: new Date('2024-04-14'),
      wearLevel: 25,
      condition: 'Óptimo',
    },
    {
      name: 'Sistemas de Anclaje',
      lastMaintenance: new Date('2024-01-30'),
      nextMaintenance: new Date('2024-07-30'),
      wearLevel: 15,
      condition: 'Óptimo',
    },
    {
      name: 'Boyas de Flotación',
      lastMaintenance: new Date('2023-11-01'),
      nextMaintenance: new Date('2024-03-10'),
      wearLevel: 60,
      condition: 'Desgaste',
    },
    {
      name: 'Sensores IoT',
      lastMaintenance: new Date('2024-01-05'),
      nextMaintenance: new Date('2024-04-05'),
      wearLevel: 70,
      condition: 'Crítico',
    },
  ],
  recommendations: [
    'Establecer un plan de contingencia para la adquisición de repuestos de sensores IoT.',
    'Capacitar al personal en la detección temprana de desgaste en boyas de flotación.',
    'Implementar un sistema de alerta automática para tareas de mantenimiento retrasadas.',
    'Realizar una auditoría de los procedimientos de mantenimiento de redes de contención.'
  ],
});

// NEW: Sample data generator for Alerts Report
export const generateSampleAlertsReport = (): AlertsReportData => ({
  reportDate: new Date(),
  period: 'Últimos 30 días',
  centerName: 'Centro Acuícola Reloncaví',
  summary: 'Durante el último mes, se registraron 15 alertas, de las cuales 12 fueron resueltas. Las alertas críticas se redujeron en un 20% respecto al mes anterior, pero el tiempo promedio de resolución aumentó ligeramente debido a dos incidentes complejos en la calidad del agua.',
  alerts: [
    {
      id: 'AL-001',
      type: 'Calidad de Agua',
      severity: 'Crítica',
      timestamp: new Date('2024-05-20T10:30:00Z'),
      description: 'Nivel de oxígeno disuelto por debajo del umbral crítico en Jaula A-1.',
      status: 'Resuelta',
      affectedComponent: 'Jaula A-1',
      actionTaken: 'Activación de aireadores de emergencia, monitoreo continuo y ajuste de alimentación.'
    },
    {
      id: 'AL-002',
      type: 'Salud de Peces',
      severity: 'Alta',
      timestamp: new Date('2024-05-22T14:00:00Z'),
      description: 'Observación de comportamiento anómalo y baja ingesta de alimento en Jaula B-2.',
      status: 'En progreso',
      affectedComponent: 'Jaula B-2',
      actionTaken: 'Muestreo de peces para análisis patológico, ajuste de régimen de alimentación.'
    },
    {
      id: 'AL-003',
      type: 'Mantenimiento',
      severity: 'Media',
      timestamp: new Date('2024-05-25T09:15:00Z'),
      description: 'Falla intermitente en sensor de temperatura de Jaula C-3.',
      status: 'Activa',
      affectedComponent: 'Sensor de Temperatura Jaula C-3',
      actionTaken: 'Programación de revisión y calibración del sensor.'
    },
    {
      id: 'AL-004',
      type: 'Calidad de Agua',
      severity: 'Alta',
      timestamp: new Date('2024-05-28T11:00:00Z'),
      description: 'Aumento súbito de amonio en Jaula A-2.',
      status: 'Resuelta',
      affectedComponent: 'Jaula A-2',
      actionTaken: 'Verificación de alimentación, revisión de filtros y aumento de recambio de agua.'
    },
    {
      id: 'AL-005',
      type: 'Salud de Peces',
      severity: 'Baja',
      timestamp: new Date('2024-06-01T08:45:00Z'),
      description: 'Detección de Caligus en niveles bajos en Jaula B-1.',
      status: 'Resuelta',
      affectedComponent: 'Jaula B-1',
      actionTaken: 'Monitoreo intensificado, sin tratamiento inmediato requerido.'
    },
  ],
  kpis: {
    totalAlerts: 15,
    resolvedAlerts: 12,
    activeAlerts: 3,
    avgResolutionTimeHours: 18.5,
  },
  recommendations: [
    'Implementar un sistema de alerta temprana para variaciones de amonio.',
    'Capacitar al personal en la identificación de signos tempranos de enfermedades.',
    'Establecer un protocolo de mantenimiento preventivo para sensores críticos.',
  ],
});

export class PDFReportGenerator {
  private addHeader(doc: jsPDF, title: string) {
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de Generación: ${new Date().toLocaleString('es-ES')}`, 14, 30);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);
  }

  private addFooter(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
      doc.text('AquApp - Sistema de Gestión Acuícola', 14, 287);
    }
  }

  public generateWaterQualityReport(data: WaterQualityReportData) {
    const doc = new jsPDF();
    this.addHeader(doc, 'Reporte de Calidad de Agua (INFA)');

    doc.setFontSize(12);
    doc.text('Resumen de Parámetros Fisicoquímicos', 14, 50);

    const tableColumn = ["Parámetro", "Valor Actual", "Unidad", "Rango Óptimo", "Estado"];
    const tableRows: (string | number)[][] = [];

    data.parameters.forEach(param => {
      const row = [
        param.name,
        param.value.toFixed(2),
        param.unit,
        `${param.minRange} - ${param.maxRange}`,
        param.value < param.minRange || param.value > param.maxRange ? 'Alerta' : 'Normal'
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
    });

    let finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.text('Observaciones y Cumplimiento Normativo (D.S. N° 320/2001)', 14, finalY + 15);
    doc.setFontSize(10);
    doc.text(data.observations, 14, finalY + 22, { maxWidth: 180 });

    this.addFooter(doc);
    doc.save(`reporte-calidad-agua-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public generateHealthReport(data: HealthReportData) {
    const doc = new jsPDF();
    this.addHeader(doc, 'Informe Sanitario para Cosecha (Res. Ex. 1821)');

    let yPos = 45;

    // Section 1: Report Information
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('1. Información del Reporte', 14, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`Número de Reporte: ${data.reportInfo.reportNumber}`, 20, yPos);
    doc.text(`Fecha de Reporte: ${data.reportInfo.reportDate.toLocaleDateString('es-ES')}`, 100, yPos);
    yPos += 6;
    doc.text(`Certificador: ${data.reportInfo.certifier}`, 20, yPos);
    yPos += 6;
    doc.text(`Médico Veterinario Responsable: ${data.reportInfo.veterinarian}`, 20, yPos);
    yPos += 12;

    // Section 2: Concession Information
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('2. Información de la Concesión', 14, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`Razón Social: ${data.concessionInfo.name} (${data.concessionInfo.rut})`, 20, yPos);
    yPos += 6;
    doc.text(`Código de Concesión: ${data.concessionInfo.concessionCode}`, 20, yPos);
    doc.text(`Cuerpo de Agua: ${data.concessionInfo.waterBody}`, 100, yPos);
    yPos += 12;

    // Section 3: Cage Data
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('3. Resumen de Balsas Jaulas', 14, yPos);
    yPos += 5;

    const tableColumn = ["Jaula ID", "Especie", "Población", "Biomasa (t)", "Origen"];
    const tableRows: (string | number)[][] = data.cageData.map(cage => [
      cage.id,
      cage.species,
      cage.population.toLocaleString(),
      cage.biomass.toFixed(1),
      cage.origin
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Section 4: Health Analysis
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('4. Análisis Sanitario General', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.text('Estado Sanitario General:', 20, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(data.healthAnalysis.overallStatus, 20, yPos, { maxWidth: 170 });
    yPos = doc.getTextDimensions(data.healthAnalysis.overallStatus, { maxWidth: 170 }).h + yPos + 8;

    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.text('Observaciones y Recomendaciones:', 20, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(data.healthAnalysis.observations, 20, yPos, { maxWidth: 170 });

    this.addFooter(doc);
    doc.save(`informe-sanitario-${data.reportInfo.reportNumber}.pdf`);
  }

  public generateExecutiveReport(data: ExecutiveReportData) {
    const doc = new jsPDF();
    this.addHeader(doc, data.title);

    let yPos = 45;

    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text(`Período: ${data.period.charAt(0).toUpperCase() + data.period.slice(1)}`, 14, yPos);
    doc.text(`Generado el: ${new Date(data.generatedAt).toLocaleString('es-ES')}`, 100, yPos);
    yPos += 15;

    // KPIs Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Indicadores Clave de Rendimiento (KPIs)', 14, yPos);
    yPos += 5;

    const kpiTableColumn = ["Indicador", "Valor", "Cambio", "Estado"];
    const kpiTableRows: (string | number)[][] = data.kpis.map(kpi => [
      kpi.title,
      kpi.value,
      `${kpi.trend === 'up' ? '▲' : '▼'} ${kpi.change}`,
      kpi.status.charAt(0).toUpperCase() + kpi.status.slice(1)
    ]);

    doc.autoTable({
      head: [kpiTableColumn],
      body: kpiTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [158, 127, 255] }, // Primary color from palette
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Center Comparison Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Comparación de Centros Acuícolas', 14, yPos);
    yPos += 5;

    const centerTableColumn = ["Centro", "Ubicación", "Eficiencia", "Mantenimiento", "Seguridad", "Cumplimiento", "Productividad", "Críticos", "Estado"];
    const centerTableRows: (string | number)[][] = data.centers.map(center => [
      center.name,
      center.location,
      `${center.metrics.efficiency}%`,
      `${center.metrics.maintenance}%`,
      `${center.metrics.safety}%`,
      `${center.metrics.compliance}%`,
      `${center.metrics.productivity}%`,
      center.criticalComponents,
      center.status.charAt(0).toUpperCase() + center.status.slice(1)
    ]);

    doc.autoTable({
      head: [centerTableColumn],
      body: centerTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [56, 189, 248] }, // Secondary color from palette
      styles: { fontSize: 8 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Maintenance Cycles Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Ciclos de Mantenimiento de Componentes Críticos', 14, yPos);
    yPos += 5;

    const maintenanceTableColumn = ["Componente", "Ciclo", "Próx. Mant.", "Desgaste", "Estado"];
    const maintenanceTableRows: (string | number)[][] = data.maintenanceCycles.map(cycle => [
      cycle.component,
      `${cycle.currentCycle}/${cycle.totalCycles}`,
      cycle.nextMaintenance.toLocaleDateString('es-ES'),
      `${cycle.wearLevel}%`,
      cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)
    ]);

    doc.autoTable({
      head: [maintenanceTableColumn],
      body: maintenanceTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [244, 114, 182] }, // Accent color from palette
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Recommendations Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Recomendaciones Prioritarias', 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    data.recommendations.forEach((rec, index) => {
      doc.text(`• ${rec}`, 20, yPos + (index * 7), { maxWidth: 170 });
    });
    yPos += (data.recommendations.length * 7) + 10;

    this.addFooter(doc);
    doc.save(`reporte-ejecutivo-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public generateFeedingReport(data: FeedingReportData) {
    const doc = new jsPDF();
    this.addHeader(doc, 'Reporte de Alimentación');

    let yPos = 45;

    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text(`Período: ${data.periodType.charAt(0).toUpperCase() + data.periodType.slice(1)}`, 14, yPos);
    doc.text(`Jaula: ${data.selectedCage === 'all' ? 'Todas' : data.selectedCage}`, 100, yPos);
    doc.text(`Rango de Fechas: ${data.dateRange.start} a ${data.dateRange.end}`, 14, yPos + 7);
    yPos += 20;

    // Key Metrics Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Métricas Clave de Alimentación', 14, yPos);
    yPos += 5;

    const avgFCR = data.feedingMetrics.reduce((sum, m) => sum + m.averageFCR, 0) / data.feedingMetrics.length;
    const avgEfficiency = data.feedingMetrics.reduce((sum, m) => sum + m.feedingEfficiency, 0) / data.feedingMetrics.length;
    const totalFeed = data.feedingMetrics.reduce((sum, m) => sum + m.totalFeed, 0);
    const totalCost = data.feedTypeUsage.reduce((sum, f) => sum + f.cost, 0);

    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`FCR Promedio: ${avgFCR.toFixed(2)}`, 20, yPos + 5);
    doc.text(`Eficiencia Promedio: ${avgEfficiency.toFixed(1)}%`, 20, yPos + 12);
    doc.text(`Total Alimento Consumido: ${totalFeed.toLocaleString()} kg`, 100, yPos + 5);
    doc.text(`Costo Total de Alimentación: $${totalCost.toLocaleString()}`, 100, yPos + 12);
    yPos += 25;

    // Detailed Metrics Table
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Métricas Detalladas por Período', 14, yPos);
    yPos += 5;

    const metricsTableColumn = ["Período", "Alimento (kg)", "FCR", "Eficiencia (%)", "Costo/kg ($)", "Crecimiento (%)", "Eventos"];
    const metricsTableRows: (string | number)[][] = data.feedingMetrics.map(metric => [
      metric.period,
      metric.totalFeed.toLocaleString(),
      metric.averageFCR.toFixed(2),
      metric.feedingEfficiency.toFixed(1),
      metric.costPerKg.toFixed(2),
      metric.growthRate.toFixed(1),
      metric.feedingEvents
    ]);

    doc.autoTable({
      head: [metricsTableColumn],
      body: metricsTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [158, 127, 255] }, // Primary color
      styles: { fontSize: 8 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Cage Performance Table
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Rendimiento por Jaula', 14, yPos);
    yPos += 5;

    const cageTableColumn = ["Jaula ID", "FCR", "Eficiencia (%)", "Crecimiento (%)", "Costo/kg ($)"];
    const cageTableRows: (string | number)[][] = data.cagePerformance.map(cage => [
      cage.cageId,
      cage.fcr.toFixed(2),
      cage.efficiency.toFixed(1),
      cage.growth.toFixed(1),
      cage.cost.toFixed(2)
    ]);

    doc.autoTable({
      head: [cageTableColumn],
      body: cageTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [56, 189, 248] }, // Secondary color
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Feed Type Usage Table
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Uso por Tipo de Alimento', 14, yPos);
    yPos += 5;

    const feedUsageTableColumn = ["Tipo de Alimento", "Uso (%)", "Costo Total ($)"];
    const feedUsageTableRows: (string | number)[][] = data.feedTypeUsage.map(feed => [
      feed.type,
      feed.usage.toFixed(1),
      feed.cost.toLocaleString()
    ]);

    doc.autoTable({
      head: [feedUsageTableColumn],
      body: feedUsageTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [244, 114, 182] }, // Accent color
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    this.addFooter(doc);
    doc.save(`reporte-alimentacion-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  public generateMaintenanceReport(data: MaintenanceReportData) {
    const doc = new jsPDF();
    this.addHeader(doc, 'Reporte de Mantenimiento de Infraestructura');

    let yPos = 45;

    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text(`Centro Acuícola: ${data.centerName}`, 14, yPos);
    doc.text(`Período del Reporte: ${data.period}`, 100, yPos);
    doc.text(`Fecha de Generación: ${data.reportDate.toLocaleDateString('es-ES')}`, 14, yPos + 7);
    yPos += 20;

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Resumen General del Mantenimiento', 14, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    const summaryText = String(data.summary);
    doc.text(summaryText, 14, yPos, { maxWidth: 180 });
    yPos = doc.getTextDimensions(summaryText, { maxWidth: 180 }).h + yPos + 15;

    // Maintenance Tasks Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Tareas de Mantenimiento Detalladas', 14, yPos);
    yPos += 5;

    const tasksTableColumn = ["ID", "Componente", "Descripción", "Estado", "Responsable", "Fecha Límite", "Prioridad"];
    const tasksTableRows: (string | number)[][] = data.tasks.map(task => [
      task.id,
      task.component,
      task.description,
      task.status,
      task.responsible,
      task.dueDate.toLocaleDateString('es-ES'),
      task.priority
    ]);

    doc.autoTable({
      head: [tasksTableColumn],
      body: tasksTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [158, 127, 255] }, // Primary color
      styles: { fontSize: 8 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Component Health Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Estado de Componentes Críticos', 14, yPos);
    yPos += 5;

    const healthTableColumn = ["Componente", "Último Mant.", "Próximo Mant.", "Desgaste (%)", "Condición"];
    const healthTableRows: (string | number)[][] = data.componentHealth.map(comp => [
      comp.name,
      comp.lastMaintenance.toLocaleDateString('es-ES'),
      comp.nextMaintenance.toLocaleDateString('es-ES'),
      comp.wearLevel.toFixed(0),
      comp.condition
    ]);

    doc.autoTable({
      head: [healthTableColumn],
      body: healthTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [56, 189, 248] }, // Secondary color
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Recommendations Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Recomendaciones Estratégicas', 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    data.recommendations.forEach((rec, index) => {
      doc.text(`• ${rec}`, 20, yPos + (index * 7), { maxWidth: 170 });
    });
    yPos += (data.recommendations.length * 7) + 10;

    this.addFooter(doc);
    doc.save(`reporte-mantenimiento-${data.centerName.replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // NEW: Method for Alerts Report
  public generateAlertsReport(data: AlertsReportData) {
    const doc = new jsPDF();
    this.addHeader(doc, 'Reporte de Alertas y Eventos Críticos');

    let yPos = 45;

    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text(`Centro Acuícola: ${data.centerName}`, 14, yPos);
    doc.text(`Período del Reporte: ${data.period}`, 100, yPos);
    doc.text(`Fecha de Generación: ${data.reportDate.toLocaleDateString('es-ES')}`, 14, yPos + 7);
    yPos += 20;

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Resumen Ejecutivo de Alertas', 14, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    const summaryText = String(data.summary);
    doc.text(summaryText, 14, yPos, { maxWidth: 180 });
    yPos = doc.getTextDimensions(summaryText, { maxWidth: 180 }).h + yPos + 15;

    // KPIs Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Indicadores Clave de Alertas (KPIs)', 14, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`Total de Alertas Registradas: ${data.kpis.totalAlerts}`, 20, yPos);
    doc.text(`Alertas Resueltas: ${data.kpis.resolvedAlerts}`, 100, yPos);
    yPos += 6;
    doc.text(`Alertas Activas: ${data.kpis.activeAlerts}`, 20, yPos);
    doc.text(`Tiempo Promedio de Resolución: ${data.kpis.avgResolutionTimeHours.toFixed(1)} horas`, 100, yPos);
    yPos += 12;

    // Alerts List Section
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Detalle de Alertas Registradas', 14, yPos);
    yPos += 5;

    const alertsTableColumn = ["ID", "Tipo", "Severidad", "Fecha/Hora", "Componente Afectado", "Estado"];
    const alertsTableRows: (string | number)[][] = data.alerts.map(alert => [
      alert.id,
      alert.type,
      alert.severity,
      alert.timestamp.toLocaleString('es-ES'),
      alert.affectedComponent,
      alert.status
    ]);

    doc.autoTable({
      head: [alertsTableColumn],
      body: alertsTableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [158, 127, 255] }, // Primary color
      styles: { fontSize: 8 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Detailed Alert Descriptions (if space allows or on new page)
    if (data.alerts.length > 0) {
      doc.addPage();
      this.addHeader(doc, 'Reporte de Alertas y Eventos Críticos (Continuación)');
      yPos = 45;
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text('Descripciones Detalladas y Acciones Tomadas', 14, yPos);
      yPos += 8;

      data.alerts.forEach((alert, index) => {
        if (yPos + 40 > doc.internal.pageSize.height - 30) { // Check for page break
          doc.addPage();
          this.addHeader(doc, 'Reporte de Alertas y Eventos Críticos (Continuación)');
          yPos = 45;
          doc.setFontSize(14);
          doc.setTextColor(44, 62, 80);
          doc.text('Descripciones Detalladas y Acciones Tomadas', 14, yPos);
          yPos += 8;
        }

        doc.setFontSize(11);
        doc.setTextColor(44, 62, 80);
        doc.text(`${index + 1}. Alerta ID: ${alert.id} - Tipo: ${alert.type} (${alert.severity})`, 20, yPos);
        yPos += 6;
        doc.setFontSize(10);
        doc.setTextColor(52, 73, 94);
        doc.text(`Descripción: ${alert.description}`, 25, yPos, { maxWidth: 165 });
        yPos = doc.getTextDimensions(`Descripción: ${alert.description}`, { maxWidth: 165 }).h + yPos + 4;
        doc.text(`Componente Afectado: ${alert.affectedComponent}`, 25, yPos);
        yPos += 6;
        doc.text(`Estado: ${alert.status}`, 25, yPos);
        yPos += 6;
        if (alert.actionTaken) {
          doc.text(`Acción Tomada: ${alert.actionTaken}`, 25, yPos, { maxWidth: 165 });
          yPos = doc.getTextDimensions(`Acción Tomada: ${alert.actionTaken}`, { maxWidth: 165 }).h + yPos + 8;
        } else {
          yPos += 8;
        }
      });
    }

    // Recommendations Section
    if (yPos + (data.recommendations.length * 7) + 20 > doc.internal.pageSize.height - 30) {
      doc.addPage();
      this.addHeader(doc, 'Reporte de Alertas y Eventos Críticos (Continuación)');
      yPos = 45;
    }
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Recomendaciones para la Gestión de Alertas', 14, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    data.recommendations.forEach((rec, index) => {
      doc.text(`• ${rec}`, 20, yPos + (index * 7), { maxWidth: 170 });
    });
    yPos += (data.recommendations.length * 7) + 10;

    this.addFooter(doc);
    doc.save(`reporte-alertas-${data.centerName.replace(/\s/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
