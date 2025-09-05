import React from 'react';
import { 
  Waves, 
  Fish, 
  BarChart3, 
  Shield, 
  Droplets, 
  Settings,
  ArrowRight,
  CheckCircle,
  MapPin,
  Activity,
  Brain, // Nuevo ícono para IA
  Database, // Nuevo ícono para datos
  Lightbulb, // Nuevo ícono para decisiones inteligentes
  Rocket, // Nuevo ícono para escalamiento
  Cpu // Nuevo ícono para Industria 4.0
} from 'lucide-react';
import ChatWidget from '../Chat/ChatWidget'; // Import the ChatWidget

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const features = [
    {
      icon: Fish,
      title: 'Salud de Peces',
      description: 'Monitoreo integral del estado sanitario y bienestar de la población acuícola'
    },
    {
      icon: Droplets,
      title: 'Calidad del Agua',
      description: 'Control en tiempo real de parámetros críticos como temperatura, oxígeno y pH'
    },
    {
      icon: MapPin,
      title: 'Gestión de Balsas',
      description: 'Administración completa de balsas jaulas con visualización 3D interactiva'
    },
    {
      icon: BarChart3,
      title: 'Reportes Técnicos',
      description: 'Generación automática de reportes según las normativas de tu país'
    },
    {
      icon: Settings,
      title: 'Mantenimiento',
      description: 'Programación y seguimiento de tareas de mantenimiento preventivo'
    },
    {
      icon: Activity,
      title: 'Alertas Inteligentes',
      description: 'Sistema de notificaciones para condiciones ambientales y operacionales'
    }
  ];

  const benefits = [
    'Ahorro de 200+ horas anuales en reportes normativos',
    'Reducción del 30% en costos de mantenimiento correctivo',
    'Mejora en cumplimiento regulatorio y reducción de riesgo ambiental',
    'Visibilidad 360° para una toma de decisiones directiva informada',
    'Reducción de imprevistos y optimización de ciclos productivos con IA DeepTech',
    'Optimización de recursos y máxima eficiencia operacional'
  ];

  const aiPrinciples = [
    {
      icon: Database,
      title: 'Control Total de Datos',
      description: 'Centralice y analice toda la información de sus centros de cultivo.'
    },
    {
      icon: Lightbulb,
      title: 'Decisiones Inteligentes',
      description: 'Use IA para anticipar escenarios críticos y optimizar resultados.'
    },
    {
      icon: Rocket,
      title: 'Escalamiento Productivo',
      description: 'Invierta en infraestructura local que potencie agentes de IA.'
    },
    {
      icon: Cpu,
      title: 'Industria 4.0',
      description: 'Transforme la acuicultura en un sector digital, eficiente y sostenible.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AquApp</h1>
                <p className="text-sm text-blue-600">Plataforma de Gestión Acuícola</p>
              </div>
            </div>
            <button
              onClick={onEnter}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center space-x-3 text-lg font-semibold shadow-lg"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              <span>Cumplimiento Normativo Simplificado</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gestión Inteligente de
              <span className="text-blue-600 block">Cultivos Acuícolas</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              AquApp: Gestión y control total en la acuicultura.
              Automatizamos reportes normativos, aseguramos trazabilidad y predecimos la vida útil de tus activos con IA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onEnter}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center space-x-3 text-lg font-semibold shadow-lg"
              >
                <span>Comenzar Ahora</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Sin instalación requerida</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-600">AquApp Dashboard</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Fish className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-600">528.000</p>
                        <p className="text-sm text-gray-600">Población Total</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-600">8.2</p>
                        <p className="text-sm text-gray-600">Oxígeno mg/L</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold text-purple-600">2.3%</p>
                        <p className="text-sm text-gray-600">Crecimiento</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-6 text-center">
                  <p className="text-gray-700 font-medium">Vista previa del dashboard principal</p>
                  <p className="text-sm text-gray-600 mt-1">Monitoreo en tiempo real de todos tus centros de cultivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para gestionar tu centro de cultivo de manera eficiente y profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Beneficios Comprobados
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Más de 50 centros de cultivo confían en AquApp para optimizar sus operaciones 
                y cumplir con los más altos estándares de calidad.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="bg-white/20 rounded-full p-4 w-fit mx-auto mb-6">
                <Rocket className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Tecnología para un Mercado Global
              </h3>
              <p className="text-blue-100 mb-6">
                Nuestra plataforma se adapta a las normativas de tu país y está diseñada para escalar en un mercado global de <strong className="text-white">US$400B</strong>.
              </p>
              <div className="flex justify-center gap-x-6 gap-y-2 flex-wrap text-white">
                  <span className="bg-white/15 px-3 py-1 rounded-full text-sm">350+ centros en Chile</span>
                  <span className="bg-white/15 px-3 py-1 rounded-full text-sm">Camarón y Tilapia en LatAm</span>
              </div>
              <button
                onClick={onEnter}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold mt-8"
              >
                Explorar Plataforma
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nuevo Bloque: Acelerar el Futuro de la Acuicultura con IA */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-md">
              <Brain className="h-6 w-6 text-blue-600" />
              <Fish className="h-6 w-6 text-blue-600" />
              <span>Innovación con IA</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Acelerar el Futuro de la Acuicultura con IA
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              AquApp es más que gestión: es el motor que impulsa el crecimiento inteligente de la industria acuícola. Nuestra visión es darle el control total de su información, transformando datos en decisiones estratégicas con el poder de la inteligencia artificial y permitiéndole escalar su productividad con agentes de IA especializados, directamente en sus centros de cultivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {aiPrinciples.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-blue-50 rounded-lg p-3 w-fit mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{principle.title}</h3>
                  <p className="text-gray-600">{principle.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={onEnter}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 text-lg font-semibold shadow-lg inline-flex items-center space-x-3"
            >
              <span>Impulsar mi Empresa con IA</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Optimizar tu Centro de Cultivo?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a los líderes de la industria acuícola que ya utilizan AquApp 
            para maximizar su productividad y rentabilidad.
          </p>
          
          <button
            onClick={onEnter}
            className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 text-lg font-semibold shadow-lg inline-flex items-center space-x-3"
          >
            <span>Ingresar a la Plataforma</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <p className="text-gray-400 text-sm mt-4">
            Acceso inmediato • Sin compromisos • Soporte técnico incluido
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-blue-600 rounded-lg p-2">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AquApp</h3>
                <p className="text-sm text-gray-400">Plataforma de Gestión Acuícola</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 AquApp. Desarrollado para la industria acuícola global.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Adaptable a las normativas locales.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget - Added here */}
      <ChatWidget />
    </div>
  );
};

export default LandingPage;
