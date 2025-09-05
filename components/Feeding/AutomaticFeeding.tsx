import React, { useState } from 'react';
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Thermometer,
  Fish,
  Clock,
  BarChart3
} from 'lucide-react';

interface AIFeedingRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  conditions: {
    waterTemp?: { min: number; max: number };
    oxygenLevel?: { min: number };
    fishActivity?: 'low' | 'normal' | 'high';
    weatherCondition?: string[];
    timeOfDay?: { start: string; end: string };
  };
  actions: {
    adjustAmount: number; // % adjustment
    adjustFrequency: number; // % adjustment
    feedType?: string;
    notification: boolean;
  };
  description: string;
}

interface FeedingPrediction {
  cageId: string;
  nextFeedingTime: Date;
  recommendedAmount: number;
  confidence: number;
  factors: string[];
  expectedFCR: number;
  growthImpact: number;
}

const AutomaticFeeding: React.FC = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [learningMode, setLearningMode] = useState(false);
  const [selectedCage, setSelectedCage] = useState<string>('A-1');

  const [aiRules, setAiRules] = useState<AIFeedingRule[]>([
    {
      id: 'rule-1',
      name: 'Temperatura Baja',
      enabled: true,
      priority: 1,
      conditions: {
        waterTemp: { min: 0, max: 12 },
      },
      actions: {
        adjustAmount: -15,
        adjustFrequency: -20,
        notification: true
      },
      description: 'Reduce alimentación cuando la temperatura del agua es baja'
    },
    {
      id: 'rule-2',
      name: 'Alta Actividad',
      enabled: true,
      priority: 2,
      conditions: {
        fishActivity: 'high',
        oxygenLevel: { min: 7 }
      },
      actions: {
        adjustAmount: 10,
        adjustFrequency: 0,
        notification: false
      },
      description: 'Aumenta cantidad cuando los peces están muy activos'
    },
    {
      id: 'rule-3',
      name: 'Condiciones Adversas',
      enabled: true,
      priority: 3,
      conditions: {
        weatherCondition: ['tormenta', 'viento fuerte'],
      },
      actions: {
        adjustAmount: -25,
        adjustFrequency: -30,
        notification: true
      },
      description: 'Reduce significativamente durante mal tiempo'
    },
    {
      id: 'rule-4',
      name: 'Horario Nocturno',
      enabled: false,
      priority: 4,
      conditions: {
        timeOfDay: { start: '20:00', end: '06:00' }
      },
      actions: {
        adjustAmount: -50,
        adjustFrequency: -100,
        notification: false
      },
      description: 'Reduce o suspende alimentación nocturna'
    }
  ]);

  const predictions: FeedingPrediction[] = [
    {
      cageId: 'A-1',
      nextFeedingTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      recommendedAmount: 47.5,
      confidence: 92,
      factors: ['Temperatura óptima', 'Alta actividad', 'Consumo histórico'],
      expectedFCR: 1.15,
      growthImpact: 2.3
    },
    {
      cageId: 'A-2',
      nextFeedingTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      recommendedAmount: 42.0,
      confidence: 88,
      factors: ['Oxígeno alto', 'Comportamiento normal', 'Patrón estacional'],
      expectedFCR: 1.18,
      growthImpact: 2.1
    },
    {
      cageId: 'B-1',
      nextFeedingTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      recommendedAmount: 38.5,
      confidence: 85,
      factors: ['Temperatura subóptima', 'Actividad reducida'],
      expectedFCR: 1.22,
      growthImpact: 1.8
    }
  ];

  const aiMetrics = {
    accuracy: 94.2,
    fcrImprovement: 8.5,
    feedSavings: 12.3,
    growthOptimization: 15.7,
    decisionsToday: 156,
    learningProgress: 78
  };

  const handleToggleRule = (ruleId: string) => {
    setAiRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleEditRule = (ruleId: string) => {
    const rule = aiRules.find(r => r.id === ruleId);
    if (rule) {
      alert(`Editando regla: ${rule.name}\n\nEsta funcionalidad abrirá el editor avanzado de reglas de IA.`);
    }
  };

  const handleApplyPrediction = (prediction: FeedingPrediction) => {
    if (confirm(`¿Aplicar recomendación de IA para ${prediction.cageId}?\n\nCantidad: ${prediction.recommendedAmount} kg\nConfianza: ${prediction.confidence}%\nFCR esperado: ${prediction.expectedFCR}`)) {
      alert(`✅ Recomendación aplicada para ${prediction.cageId}\n\n🤖 IA programó alimentación automática\n⏰ Hora: ${prediction.nextFeedingTime.toLocaleTimeString('es-ES')}\n📊 Monitoreo continuo activado`);
    }
  };

  const handleTrainModel = () => {
    if (confirm('¿Iniciar entrenamiento del modelo de IA?\n\nEsto analizará los últimos 6 meses de datos para mejorar las predicciones.')) {
      alert('🧠 Entrenamiento de IA iniciado...\n\n📊 Analizando 180 días de datos\n🎯 Optimizando algoritmos FCR\n📈 Mejorando predicciones de crecimiento\n\n⏱️ Tiempo estimado: 2 horas');
    }
  };

  const handleResetAI = () => {
    if (confirm('¿Resetear modelo de IA a configuración de fábrica?\n\nEsto eliminará todo el aprendizaje personalizado.')) {
      alert('🔄 Modelo de IA reseteado\n\nConfiguración restaurada a valores por defecto');
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Status Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-bold">Sistema de IA AquaFeed</h2>
              <p className="text-purple-100">Alimentación inteligente basada en machine learning</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{aiMetrics.accuracy}%</p>
              <p className="text-purple-100 text-sm">Precisión</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ai-enabled"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="rounded border-white text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="ai-enabled" className="text-sm font-medium">
                IA Activada
              </label>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{aiMetrics.fcrImprovement}%</p>
            <p className="text-purple-100 text-sm">Mejora FCR</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{aiMetrics.feedSavings}%</p>
            <p className="text-purple-100 text-sm">Ahorro Alimento</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{aiMetrics.growthOptimization}%</p>
            <p className="text-purple-100 text-sm">Optimización Crecimiento</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{aiMetrics.decisionsToday}</p>
            <p className="text-purple-100 text-sm">Decisiones Hoy</p>
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Predicciones y Recomendaciones</span>
          </h3>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="learning-mode"
              checked={learningMode}
              onChange={(e) => setLearningMode(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="learning-mode" className="text-sm font-medium text-gray-700">
              Modo Aprendizaje
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {predictions.map((prediction) => (
            <div key={prediction.cageId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Jaula {prediction.cageId}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    prediction.confidence > 90 ? 'bg-green-500' :
                    prediction.confidence > 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">{prediction.confidence}%</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Próxima alimentación:</span>
                  <span className="font-medium">{prediction.nextFeedingTime.toLocaleTimeString('es-ES')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cantidad recomendada:</span>
                  <span className="font-medium">{prediction.recommendedAmount} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">FCR esperado:</span>
                  <span className="font-medium text-green-600">{prediction.expectedFCR}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impacto crecimiento:</span>
                  <span className="font-medium text-blue-600">+{prediction.growthImpact}%</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Factores considerados:</p>
                <div className="space-y-1">
                  {prediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleApplyPrediction(prediction)}
                disabled={!aiEnabled}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aplicar Recomendación
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Rules Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Settings className="h-5 w-5 text-purple-600" />
            <span>Reglas de IA</span>
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={handleTrainModel}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Entrenar Modelo</span>
            </button>
            <button
              onClick={handleResetAI}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset IA
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {aiRules.map((rule) => (
            <div key={rule.id} className={`border rounded-lg p-4 ${rule.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{rule.name}</h4>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Prioridad: {rule.priority}</span>
                  <button
                    onClick={() => handleEditRule(rule.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Condiciones:</p>
                  <ul className="space-y-1 text-gray-600">
                    {rule.conditions.waterTemp && (
                      <li>• Temperatura: {rule.conditions.waterTemp.min}°C - {rule.conditions.waterTemp.max}°C</li>
                    )}
                    {rule.conditions.oxygenLevel && (
                      <li>• Oxígeno mín: {rule.conditions.oxygenLevel.min} mg/L</li>
                    )}
                    {rule.conditions.fishActivity && (
                      <li>• Actividad: {rule.conditions.fishActivity}</li>
                    )}
                    {rule.conditions.weatherCondition && (
                      <li>• Clima: {rule.conditions.weatherCondition.join(', ')}</li>
                    )}
                    {rule.conditions.timeOfDay && (
                      <li>• Horario: {rule.conditions.timeOfDay.start} - {rule.conditions.timeOfDay.end}</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Acciones:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Ajuste cantidad: {rule.actions.adjustAmount > 0 ? '+' : ''}{rule.actions.adjustAmount}%</li>
                    <li>• Ajuste frecuencia: {rule.actions.adjustFrequency > 0 ? '+' : ''}{rule.actions.adjustFrequency}%</li>
                    {rule.actions.feedType && <li>• Tipo: {rule.actions.feedType}</li>}
                    <li>• Notificación: {rule.actions.notification ? 'Sí' : 'No'}</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span>Progreso de Aprendizaje</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Métricas de Rendimiento</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Precisión de predicciones</span>
                  <span className="font-medium">{aiMetrics.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${aiMetrics.accuracy}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progreso de aprendizaje</span>
                  <span className="font-medium">{aiMetrics.learningProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${aiMetrics.learningProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Datos de Entrenamiento</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Registros de alimentación:</span>
                <span className="font-medium">12,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Datos ambientales:</span>
                <span className="font-medium">8,760 horas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Observaciones de comportamiento:</span>
                <span className="font-medium">3,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última actualización:</span>
                <span className="font-medium">Hace 2 horas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Recomendación del Sistema</h5>
              <p className="text-sm text-blue-800">
                El modelo ha identificado patrones estacionales en el consumo. Se recomienda ajustar las reglas 
                de temperatura para optimizar el FCR en un 3-5% adicional durante los próximos 30 días.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomaticFeeding;
