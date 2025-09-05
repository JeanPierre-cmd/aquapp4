import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Shield, Calendar, FileText, Download, Bell, Clock } from 'lucide-react';
import Modal from '../common/Modal';

interface ComplianceItem {
  id: string;
  requirement: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastCheck: Date;
  nextDue: Date;
  responsible: string;
  article: string;
  history: { date: Date; action: string }[];
}

interface InspectionAlert {
  id: string;
  type: string;
  description: string;
  dueDate: Date;
  overdueDays?: number;
  priority: 'high' | 'medium' | 'low';
  center: string;
  relatedComplianceId: string;
}

interface ExecutiveTrafficLightProps {
  lastUpdate: Date;
}

// Datos iniciales fuera del componente para no reiniciarlos en cada render
const initialComplianceItems: ComplianceItem[] = [
  {
    id: 'art-5',
    requirement: 'Registro sanitario actualizado',
    status: 'compliant',
    lastCheck: new Date('2024-01-10'),
    nextDue: new Date('2024-04-10'),
    responsible: 'Dr. María González',
    article: 'Artículo 5°',
    history: [{ date: new Date('2024-01-10'), action: 'Revisión completada. Todo en orden.' }]
  },
  {
    id: 'art-12',
    requirement: 'Programa sanitario vigente',
    status: 'compliant',
    lastCheck: new Date('2024-01-15'),
    nextDue: new Date('2024-07-15'),
    responsible: 'Dr. Carlos Ruiz',
    article: 'Artículo 12°',
    history: [{ date: new Date('2024-01-15'), action: 'Programa actualizado y aprobado.' }]
  },
  {
    id: 'art-18',
    requirement: 'Reportes mensuales de mortalidad',
    status: 'warning',
    lastCheck: new Date('2023-12-15'),
    nextDue: new Date('2024-01-15'),
    responsible: 'Ana Torres',
    article: 'Artículo 18°',
    history: [{ date: new Date('2023-12-15'), action: 'Reporte de Diciembre entregado.' }]
  },
  {
    id: 'art-25',
    requirement: 'Inspección veterinaria trimestral',
    status: 'non-compliant',
    lastCheck: new Date('2023-10-20'),
    nextDue: new Date('2024-01-20'),
    responsible: 'Dr. Luis Morales',
    article: 'Artículo 25°',
    history: [{ date: new Date('2023-10-20'), action: 'Última inspección realizada.' }]
  },
  {
    id: 'art-30',
    requirement: 'Registro de tratamientos',
    status: 'compliant',
    lastCheck: new Date('2024-01-12'),
    nextDue: new Date('2024-02-12'),
    responsible: 'Patricia Silva',
    article: 'Artículo 30°',
    history: [{ date: new Date('2024-01-12'), action: 'Registros al día.' }]
  }
];

const initialInspectionAlerts: InspectionAlert[] = [
  {
    id: 'insp-1',
    type: 'Inspección Veterinaria',
    description: 'Inspección trimestral de salud de peces vencida',
    dueDate: new Date('2024-01-20'),
    priority: 'high',
    center: 'Centro Norte',
    relatedComplianceId: 'art-25'
  },
  {
    id: 'insp-2',
    type: 'Reporte Mortalidad',
    description: 'Reporte mensual de mortalidad pendiente',
    dueDate: new Date('2024-01-15'),
    priority: 'high',
    center: 'Centro Sur',
    relatedComplianceId: 'art-18'
  },
  {
    id: 'insp-3',
    type: 'Auditoría Estructural',
    description: 'Inspección de integridad estructural próxima a vencer',
    dueDate: new Date('2024-02-01'),
    priority: 'medium',
    center: 'Centro Este',
    relatedComplianceId: 'art-12' // Example relation
  }
];

const ExecutiveTrafficLight: React.FC<ExecutiveTrafficLightProps> = ({ lastUpdate }) => {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(initialComplianceItems);
  const [inspectionAlerts, setInspectionAlerts] = useState<InspectionAlert[]>(initialInspectionAlerts);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);
  const isInitialMount = useRef(true);

  // Simula la actualización de datos cuando el padre lo solicita
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const simulateDataUpdate = () => {
      setComplianceItems(prevItems => {
        const newItems = [...prevItems];
        // Seleccionar un item aleatorio para cambiar su estado
        const itemIndex = Math.floor(Math.random() * newItems.length);
        const itemToUpdate = { ...newItems[itemIndex] };
        
        const statuses: Array<'compliant' | 'warning' | 'non-compliant'> = ['compliant', 'warning', 'non-compliant'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

        itemToUpdate.status = newStatus;
        itemToUpdate.lastCheck = new Date();
        const nextDueDate = new Date();
        nextDueDate.setMonth(nextDueDate.getMonth() + 3);
        itemToUpdate.nextDue = nextDueDate;
        itemToUpdate.history = [...itemToUpdate.history, { date: new Date(), action: `Estado cambiado a ${newStatus} tras revisión.` }];

        newItems[itemIndex] = itemToUpdate;
        return newItems;
      });
    };

    simulateDataUpdate();
  }, [lastUpdate]);

  // Calcula los días de retraso dinámicamente
  useEffect(() => {
    const today = new Date();
    setInspectionAlerts(prevAlerts => 
      prevAlerts.map(alert => {
        const diffTime = today.getTime() - alert.dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          ...alert,
          overdueDays: diffDays > 0 ? diffDays : undefined
        };
      })
    );
  }, [complianceItems]); // Recalcula si los items cambian

  const handleOpenModal = (item: ComplianceItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleManageAlert = (alert: InspectionAlert) => {
    const relatedItem = complianceItems.find(item => item.id === alert.relatedComplianceId);
    if (relatedItem) {
      handleOpenModal(relatedItem);
    } else {
      alert(`Gestionando alerta: ${alert.description}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'non-compliant': return <XCircle className="h-6 w-6 text-red-600" />;
      default: return <AlertTriangle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 border-green-500';
      case 'warning': return 'bg-yellow-100 border-yellow-500';
      case 'non-compliant': return 'bg-red-100 border-red-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'compliant': return 'CUMPLE';
      case 'warning': return 'ATENCIÓN';
      case 'non-compliant': return 'NO CUMPLE';
      default: return 'DESCONOCIDO';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const overdueAlerts = inspectionAlerts.filter(alert => alert.overdueDays && alert.overdueDays > 0);
  const upcomingAlerts = inspectionAlerts.filter(alert => !alert.overdueDays);
  const complianceRate = (complianceItems.filter(item => item.status === 'compliant').length / complianceItems.length) * 100;

  const handleGenerateReport = () => {
    console.log('Generando Reporte RES EX 1821 en PDF con los siguientes datos:', { complianceItems, inspectionAlerts });
    alert('Generando Reporte RES EX 1821 en PDF... (ver consola para detalles)');
  };

  return (
    <div className="space-y-6">
      {/* Header con indicadores principales */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard Ejecutivo - Cumplimiento Normativo</h1>
            <p className="text-blue-100">Resolución Exenta N° 1821 - SERNAPESCA</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Bell className="h-6 w-6" />
              {overdueAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {overdueAlerts.length}
                </span>
              )}
            </button>
            <button
              onClick={handleGenerateReport}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Reporte RES EX 1821</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold">{complianceRate.toFixed(0)}%</p>
            <p className="text-blue-100">Cumplimiento General</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-300">{overdueAlerts.length}</p>
            <p className="text-blue-100">Inspecciones Vencidas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-300">{upcomingAlerts.length}</p>
            <p className="text-blue-100">Próximas a Vencer</p>
          </div>
        </div>
      </div>

      {/* Panel de Notificaciones */}
      {showNotifications && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Bell className="h-5 w-5 text-red-500" />
              <span>Notificaciones de Inspecciones</span>
            </h3>
            <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          
          <div className="space-y-3">
            {inspectionAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 border-l-4 border-red-500">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(alert.priority)}`}></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{alert.type}</h4>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>Vence: {alert.dueDate.toLocaleDateString('es-ES')}</span>
                    <span>Centro: {alert.center}</span>
                    {alert.overdueDays && (
                      <span className="text-red-600 font-medium">Vencida hace {alert.overdueDays} días</span>
                    )}
                  </div>
                </div>
                <button onClick={() => handleManageAlert(alert)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  Gestionar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Semáforo de Cumplimiento */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Panel Semáforo - Cumplimiento RES EX 1821</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-sm text-gray-600">Cumple</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span className="text-sm text-gray-600">Atención</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-sm text-gray-600">No Cumple</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceItems.map((item) => (
            <div key={item.id} className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(item.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">{getStatusIcon(item.status)}<span className="text-sm font-medium text-gray-600">{item.article}</span></div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'compliant' ? 'bg-green-500 text-white' : item.status === 'warning' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>{getStatusLabel(item.status)}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{item.requirement}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Responsable:</span><span className="font-medium">{item.responsible}</span></div>
                <div className="flex justify-between"><span>Última revisión:</span><span>{item.lastCheck.toLocaleDateString('es-ES')}</span></div>
                <div className="flex justify-between"><span>Próximo vencimiento:</span><span className={item.nextDue < new Date() ? 'text-red-600 font-medium' : ''}>{item.nextDue.toLocaleDateString('es-ES')}</span></div>
              </div>
              <button className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200 transition-colors text-sm" onClick={() => handleOpenModal(item)} data-testid={`ver-detalle-${item.id}`} aria-label={`Ver detalle del requerimiento ${item.requirement}`}>Ver Detalles</button>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen Normativo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2"><FileText className="h-6 w-6 text-green-600" /><span>Resumen Normativo - Próximas Acciones</span></h3>
          <span className="text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Acciones Inmediatas Requeridas</h4>
            <div className="space-y-3">
              {complianceItems.filter(item => item.status === 'non-compliant' || item.nextDue < new Date()).map((item) => (<div key={item.id} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500"><XCircle className="h-5 w-5 text-red-600 mt-0.5" /><div><p className="text-sm font-medium text-red-800">{item.requirement}</p><p className="text-xs text-red-600">{item.article} - Responsable: {item.responsible}</p></div></div>))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Próximos Vencimientos (30 días)</h4>
            <div className="space-y-3">
              {complianceItems.filter(item => { const daysUntilDue = Math.ceil((item.nextDue.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)); return daysUntilDue <= 30 && daysUntilDue > 0; }).map((item) => (<div key={item.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"><Calendar className="h-5 w-5 text-yellow-600 mt-0.5" /><div><p className="text-sm font-medium text-yellow-800">{item.requirement}</p><p className="text-xs text-yellow-600">Vence: {item.nextDue.toLocaleDateString('es-ES')} - {item.responsible}</p></div></div>))}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600"><span className="font-medium">Estado de Cumplimiento General:</span><span className={`ml-2 ${complianceRate >= 80 ? 'text-green-600' : complianceRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{complianceRate >= 80 ? 'SATISFACTORIO' : complianceRate >= 60 ? 'REQUIERE ATENCIÓN' : 'CRÍTICO'}</span></p>
              <p className="text-xs text-gray-500 mt-1">Resolución Exenta N° 1821 - Servicio Nacional de Pesca y Acuicultura</p>
            </div>
            <button onClick={handleGenerateReport} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"><Download className="h-4 w-4" /><span>Exportar Reporte Completo</span></button>
          </div>
        </div>
      </div>

      {selectedItem && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Detalle - ${selectedItem.article}`}>
          <div className="space-y-4 text-sm" aria-labelledby="modal-title">
            <p className="text-base font-semibold text-gray-800">{selectedItem.requirement}</p>
            <div className="flex items-center space-x-2"><span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedItem.status === 'compliant' ? 'bg-green-500 text-white' : selectedItem.status === 'warning' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}`}>{getStatusLabel(selectedItem.status)}</span><span className="text-gray-500">ID: {selectedItem.id}</span></div>
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <span className="text-gray-500">Responsable:</span><span className="font-medium text-gray-800">{selectedItem.responsible}</span>
                <span className="text-gray-500">Última Revisión:</span><span className="font-medium text-gray-800">{selectedItem.lastCheck.toLocaleString('es-ES')}</span>
                <span className="text-gray-500">Próximo Vencimiento:</span><span className={`font-medium ${selectedItem.nextDue < new Date() ? 'text-red-600' : 'text-gray-800'}`}>{selectedItem.nextDue.toLocaleDateString('es-ES')}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center"><Clock className="h-4 w-4 mr-2 text-gray-500" />Historial de Acciones</h4>
              <ul className="space-y-2 text-xs">
                {selectedItem.history.slice(-3).reverse().map((entry, index) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-600">
                    <span className="font-mono text-gray-500">{entry.date.toLocaleDateString('es-ES')}</span>
                    <span>-</span>
                    <p>{entry.action}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" onClick={handleCloseModal}>Cerrar</button>
              <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none" onClick={handleCloseModal}>Registrar Acción</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExecutiveTrafficLight;
