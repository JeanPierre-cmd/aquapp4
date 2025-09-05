import React, { useState } from 'react';
import { 
  MessageCircle, 
  HelpCircle, 
  FileText, 
  Video, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Phone,
  Mail,
  Clock,
  User,
  Send,
  X
} from 'lucide-react';

interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
  createdAt: Date;
  lastUpdate: Date;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const SupportCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'help' | 'chat' | 'tickets' | 'schedule'>('help');
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TK-001',
      title: 'Error en carga de archivo DWG',
      status: 'in-progress',
      priority: 'medium',
      component: 'Visualización 3D',
      createdAt: new Date('2024-01-14'),
      lastUpdate: new Date('2024-01-15')
    },
    {
      id: 'TK-002',
      title: 'Consulta sobre RES EX 1821',
      status: 'resolved',
      priority: 'low',
      createdAt: new Date('2024-01-12'),
      lastUpdate: new Date('2024-01-13')
    }
  ]);

  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      question: '¿Qué es un grillete crítico?',
      answer: 'Un grillete crítico es un componente de conexión que ha alcanzado el 80% de su vida útil estimada o presenta signos de fatiga estructural. Requiere inspección inmediata y posible reemplazo.',
      category: 'Componentes',
      helpful: 15
    },
    {
      id: 'faq-2',
      question: '¿Cómo genero un reporte RES EX 1821?',
      answer: 'Ve al módulo de Reportes > Salud de Peces > Generar Reporte PDF. El sistema incluye automáticamente toda la información requerida por SERNAPESCA.',
      category: 'Reportes',
      helpful: 23
    },
    {
      id: 'faq-3',
      question: '¿Qué formatos acepta la carga de inventario?',
      answer: 'Aceptamos archivos CSV, Excel (.xlsx, .xls), DWG, IPT y AquaSim. Para inventario estructural, usa nuestro template CSV disponible en Historial Estructural.',
      category: 'Carga de Datos',
      helpful: 18
    },
    {
      id: 'faq-4',
      question: '¿Cómo interpretar las alertas de tensión acumulada?',
      answer: 'Las alertas rojas indican tensión fuera del rango seguro. Amarillas requieren monitoreo. Verdes están dentro de parámetros normales. Revisa el historial del componente para tendencias.',
      category: 'Alertas',
      helpful: 12
    }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Simular envío de mensaje
      alert(`Mensaje enviado: "${chatMessage}". Un especialista te responderá en breve.`);
      setChatMessage('');
    }
  };

  const handleCreateTicket = () => {
    const title = prompt('Describe brevemente tu consulta:');
    if (!title) return;
    
    const component = prompt('¿Está relacionado con algún módulo específico?\n\n1. Dashboard\n2. Calidad del Agua\n3. Salud de Peces\n4. Mantenimiento\n5. Reportes\n6. Otro\n\nIngrese el número o deje vacío:');
    
    const modules = {
      '1': 'Dashboard',
      '2': 'Calidad del Agua', 
      '3': 'Salud de Peces',
      '4': 'Mantenimiento',
      '5': 'Reportes',
      '6': 'Otro'
    };
    
      const newTicket: SupportTicket = {
        id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
        title,
        status: 'open',
        priority: 'medium',
        component: modules[component as keyof typeof modules] || component || undefined,
        createdAt: new Date(),
        lastUpdate: new Date()
      };
      
      setTickets(prev => [newTicket, ...prev]);
      alert(`Ticket ${newTicket.id} creado exitosamente.\n\n📋 Título: ${title}\n🏷️ Módulo: ${newTicket.component || 'General'}\n⏱️ Tiempo estimado de respuesta: 2-4 horas\n\nTe notificaremos por email cuando tengamos una respuesta.`);
  };

  const handleScheduleSession = () => {
    if (confirm('¿Desea agendar una sesión con Customer Success?\n\nSesiones disponibles:\n• Martes 10:00-17:00\n• Jueves 10:00-17:00\n\nDuración: 45 minutos')) {
      alert('Redirigiendo al calendario de Customer Success...\n\n📅 Próximas fechas disponibles:\n• Martes 23 Enero - 14:00\n• Jueves 25 Enero - 10:30\n• Martes 30 Enero - 16:00\n\nSeleccione su horario preferido.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Centro de Soporte</h1>
          <p className="text-gray-600">Asistencia técnica y recursos para optimizar tu experiencia</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowChat(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat en Vivo</span>
          </button>
          <button
            onClick={handleScheduleSession}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Agendar Sesión</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('help')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeTab === 'help' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <HelpCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Centro de Ayuda</p>
          <p className="text-sm text-gray-600">FAQs y tutoriales</p>
        </button>

        <button
          onClick={() => setShowChat(true)}
          className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
        >
          <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Chat en Vivo</p>
          <p className="text-sm text-gray-600">Respuesta inmediata</p>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`p-4 rounded-lg border-2 transition-all ${
            activeTab === 'tickets' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Mis Tickets</p>
          <p className="text-sm text-gray-600">{tickets.filter(t => t.status !== 'resolved').length} activos</p>
        </button>

        <button
          onClick={handleScheduleSession}
          className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
        >
          <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Customer Success</p>
          <p className="text-sm text-gray-600">Sesión trimestral</p>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          {/* Quick Start Checklist */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Checklist de Primera Carga</h3>
            <div className="space-y-3">
              {[
                'Cargar inventario de componentes estructurales',
                'Configurar alertas de mantenimiento',
                'Generar primer reporte RES EX 1821',
                'Revisar panel de cumplimiento normativo',
                'Programar inspecciones trimestrales'
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h3>
            <div className="space-y-4">
              {faqItems.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-600 text-sm mb-2">{faq.answer}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Categoría: {faq.category}</span>
                    <span className="text-xs text-gray-500">{faq.helpful} personas encontraron esto útil</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Tutorials */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutoriales en Video</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Cómo cargar tu inventario estructural',
                'Generación de reportes RES EX 1821',
                'Interpretación de alertas críticas',
                'Panel comparativo entre centros'
              ].map((title, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Video className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{title}</p>
                      <p className="text-sm text-gray-600">5-8 minutos</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Mis Tickets de Soporte</h3>
            <button
              onClick={handleCreateTicket}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Nuevo Ticket
            </button>
          </div>
          
          <div className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-medium text-gray-900">{ticket.id}</span>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'open' ? 'Abierto' : 
                         ticket.status === 'in-progress' ? 'En Progreso' : 'Resuelto'}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{ticket.title}</h4>
                    {ticket.component && (
                      <p className="text-sm text-gray-600 mb-2">Módulo: {ticket.component}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Creado: {ticket.createdAt.toLocaleDateString('es-ES')}</span>
                      <span>Actualizado: {ticket.lastUpdate.toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Soporte AquApp</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 h-64 overflow-y-auto bg-gray-50">
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 mb-1">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Soporte AquApp</span>
                  <span className="text-xs text-gray-500">Ahora</span>
                </div>
                <p className="text-sm text-gray-700">
                  ¡Hola! Soy María del equipo de soporte técnico. ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Contacto Directo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Soporte Técnico</p>
              <p className="text-sm text-blue-700">+56 2 2XXX XXXX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Email</p>
              <p className="text-sm text-blue-700">soporte@aquapp.cl</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Horario</p>
              <p className="text-sm text-blue-700">Lun-Vie 8:00-18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter
