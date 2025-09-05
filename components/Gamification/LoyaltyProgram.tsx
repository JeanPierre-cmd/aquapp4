import React, { useState } from 'react';
import { 
  Award, 
  Star, 
  Gift, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar,
  CheckCircle,
  Trophy,
  Zap,
  Download,
  Crown
} from 'lucide-react';

interface UserCredits {
  total: number;
  available: number;
  earned: number;
  redeemed: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  points: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
  category: 'maintenance' | 'compliance' | 'efficiency' | 'adoption';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'discount' | 'support' | 'training' | 'audit';
  available: boolean;
}

const LoyaltyProgram: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'rewards' | 'leaderboard'>('overview');
  
  const userCredits: UserCredits = {
    total: 2850,
    available: 1200,
    earned: 2850,
    redeemed: 1650
  };

  const achievements: Achievement[] = [
    {
      id: 'perfect-compliance',
      title: 'Cumplimiento Perfecto',
      description: 'Mantén 100% cumplimiento RES EX 1821 por 3 meses consecutivos',
      icon: CheckCircle,
      points: 500,
      completed: true,
      progress: 3,
      maxProgress: 3,
      category: 'compliance'
    },
    {
      id: 'early-inspector',
      title: 'Inspector Proactivo',
      description: 'Registra 50 inspecciones antes de la fecha límite',
      icon: Calendar,
      points: 300,
      completed: false,
      progress: 32,
      maxProgress: 50,
      category: 'maintenance'
    },
    {
      id: 'data-master',
      title: 'Maestro de Datos',
      description: 'Carga inventario completo de todos los centros',
      icon: Target,
      points: 400,
      completed: false,
      progress: 2,
      maxProgress: 3,
      category: 'adoption'
    },
    {
      id: 'efficiency-champion',
      title: 'Campeón de Eficiencia',
      description: 'Alcanza top 10% en benchmark sectorial',
      icon: Trophy,
      points: 750,
      completed: false,
      progress: 78,
      maxProgress: 90,
      category: 'efficiency'
    },
    {
      id: 'referral-expert',
      title: 'Embajador AquApp',
      description: 'Refiere 2 centros que adopten la plataforma',
      icon: Users,
      points: 1000,
      completed: false,
      progress: 1,
      maxProgress: 2,
      category: 'adoption'
    }
  ];

  const rewards: Reward[] = [
    {
      id: 'license-discount',
      title: '20% Descuento Renovación',
      description: 'Descuento en renovación anual de licencias',
      cost: 800,
      category: 'discount',
      available: true
    },
    {
      id: 'premium-support',
      title: 'Soporte Premium 3 Meses',
      description: 'Acceso prioritario y soporte 24/7',
      cost: 600,
      category: 'support',
      available: true
    },
    {
      id: 'training-workshop',
      title: 'Workshop Personalizado',
      description: 'Capacitación on-site para tu equipo',
      cost: 1200,
      category: 'training',
      available: true
    },
    {
      id: 'technical-audit',
      title: 'Auditoría Técnica Anual',
      description: 'Revisión completa de cumplimiento normativo',
      cost: 1500,
      category: 'audit',
      available: false
    },
    {
      id: 'api-integration',
      title: 'Integración API Gratuita',
      description: 'Conexión con ERP/SAP sin costo adicional',
      cost: 2000,
      category: 'support',
      available: true
    }
  ];

  const leaderboard = [
    { rank: 1, center: 'Centro MultiX Norte', credits: 4200, manager: 'Carlos Mendoza' },
    { rank: 2, center: 'AquaSur Aysén', credits: 3850, manager: 'Ana Silva' },
    { rank: 3, center: 'Centro MultiX Este', credits: 3200, manager: 'Luis Ramírez' },
    { rank: 4, center: 'Centro Patagonia', credits: 2850, manager: 'Roberto González' },
    { rank: 5, center: 'Centro MultiX Sur', credits: 2400, manager: 'María Torres' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      case 'compliance':
        return 'bg-green-100 text-green-800';
      case 'efficiency':
        return 'bg-purple-100 text-purple-800';
      case 'adoption':
        return 'bg-orange-100 text-orange-800';
      case 'discount':
        return 'bg-red-100 text-red-800';
      case 'support':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'audit':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRedeemReward = (reward: Reward) => {
    if (userCredits.available >= reward.cost && reward.available) {
      if (confirm(`¿Confirmas el canje de "${reward.title}" por ${reward.cost} créditos?`)) {
        alert(`¡Felicitaciones! Has canjeado "${reward.title}". Te contactaremos en 24-48 horas.`);
      }
    } else if (!reward.available) {
      alert('Esta recompensa no está disponible actualmente.');
    } else {
      alert(`Necesitas ${reward.cost - userCredits.available} créditos adicionales para este canje.`);
    }
  };

  const userRank = leaderboard.findIndex(item => item.center === 'Centro MultiX Norte') + 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Programa de Fidelización</h1>
          <p className="text-gray-600">Maintenance Credit Program - Gana créditos por buen uso de la plataforma</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span className="font-bold">{userCredits.available} créditos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-8 w-8" />
            </div>
            <p className="text-3xl font-bold">{userCredits.total.toLocaleString()}</p>
            <p className="text-blue-100">Créditos Totales</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Gift className="h-8 w-8" />
            </div>
            <p className="text-3xl font-bold">{userCredits.available.toLocaleString()}</p>
            <p className="text-blue-100">Disponibles</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8" />
            </div>
            <p className="text-3xl font-bold">{userCredits.earned.toLocaleString()}</p>
            <p className="text-blue-100">Ganados</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-8 w-8" />
            </div>
            <p className="text-3xl font-bold">#{userRank}</p>
            <p className="text-blue-100">Ranking Nacional</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Resumen', icon: Award },
            { id: 'achievements', name: 'Logros', icon: Trophy },
            { id: 'rewards', name: 'Recompensas', icon: Gift },
            { id: 'leaderboard', name: 'Ranking', icon: Crown }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Achievements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros Recientes</h3>
            <div className="space-y-3">
              {achievements.filter(a => a.completed).slice(0, 3).map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Icon className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600">+{achievement.points} créditos</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas para Ganar Créditos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Registrar inspección a tiempo</p>
                  <p className="text-sm text-gray-600">+50 créditos por inspección</p>
                </div>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Completar reporte mensual</p>
                  <p className="text-sm text-gray-600">+100 créditos por reporte</p>
                </div>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Cargar inventario completo</p>
                  <p className="text-sm text-gray-600">+200 créditos por centro</p>
                </div>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <div key={achievement.id} className={`border-2 rounded-lg p-6 ${
                achievement.completed ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        achievement.completed ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                        {achievement.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">+{achievement.points}</p>
                    <p className="text-sm text-gray-600">créditos</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{achievement.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        achievement.completed ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {achievement.completed && (
                  <div className="mt-3 flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">¡Completado!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className={`border rounded-lg p-6 ${
              !reward.available ? 'opacity-50' : ''
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{reward.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                    {reward.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{reward.cost}</p>
                  <p className="text-sm text-gray-600">créditos</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{reward.description}</p>
              
              <button
                onClick={() => handleRedeemReward(reward)}
                disabled={!reward.available || userCredits.available < reward.cost}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  reward.available && userCredits.available >= reward.cost
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {!reward.available ? 'No Disponible' :
                 userCredits.available < reward.cost ? 'Créditos Insuficientes' : 'Canjear'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ranking Nacional de Centros</h3>
            <p className="text-sm text-gray-600">Basado en créditos de mantenimiento acumulados</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {leaderboard.map((item) => (
              <div key={item.rank} className={`p-6 ${
                item.center === 'Centro MultiX Norte' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      item.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      item.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      item.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      #{item.rank}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.center}</h4>
                      <p className="text-sm text-gray-600">Manager: {item.manager}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{item.credits.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">créditos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyProgram
