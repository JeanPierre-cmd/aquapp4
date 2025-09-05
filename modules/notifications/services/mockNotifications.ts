import { Notification } from '../types';

const mockData: Notification[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'Alerta de Oxígeno Bajo',
    message: 'Niveles de oxígeno en la Jaula A-3 han caído por debajo de 5 mg/L.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    metadata: { cageId: 'A-3', value: '4.8 mg/L' }
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'Mantenimiento Programado',
    message: 'El mantenimiento de la red de la Jaula B-1 está programado para mañana a las 08:00.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    metadata: { cageId: 'B-1', task: 'Net Maintenance' }
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Reporte Generado',
    message: 'El reporte de salud semanal ha sido generado y enviado exitosamente.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
    metadata: { reportType: 'Health Report' }
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Actualización del Sistema',
    message: 'El sistema se actualizará esta noche a las 23:00. Se espera una breve interrupción.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
    {
    id: 'notif-5',
    type: 'alert',
    title: 'Fallo de Sensor de Temperatura',
    message: 'El sensor de temperatura de la Jaula C-2 no está respondiendo.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    metadata: { cageId: 'C-2', sensor: 'Temp-02' }
  },
];

export const fetchNotifications = (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
};
