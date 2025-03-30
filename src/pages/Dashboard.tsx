import React, { useState } from 'react';
import { 
  Activity, 
  Users as UsersIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Bell
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses, getStatsClasses, getButtonClasses } from '../config/theme';

interface Performance {
  label: string;
  value: number;
  target: number;
  unit: string;
}

const performanceMetrics: Performance[] = [
  { label: "Rondes Complétées", value: 85, target: 90, unit: "%" },
  { label: "Temps de Réponse", value: 12, target: 15, unit: "min" },
  { label: "Satisfaction Client", value: 92, target: 95, unit: "%" }
];

const stats = [
  {
    title: "Rondes Actives",
    value: "12",
    change: "+8%",
    isPositive: true,
    icon: Shield,
    details: "4 rondes terminées aujourd'hui"
  },
  {
    title: "Agents Connectés",
    value: "24",
    change: "+12%",
    isPositive: true,
    icon: UsersIcon,
    details: "8 agents en service"
  },
  {
    title: "Temps Moyen",
    value: "45min",
    change: "-5%",
    isPositive: true,
    icon: Clock,
    details: "Par ronde"
  },
  {
    title: "Incidents",
    value: "3",
    change: "-25%",
    isPositive: true,
    icon: AlertTriangle,
    details: "2 résolus aujourd'hui"
  }
];

function Dashboard() {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>Tableau de Bord</h1>
          <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
            Vue d'ensemble de la sécurité
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
          >
            <option value="24h">Dernières 24 heures</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
          <button className={`${getButtonClasses(theme, 'primary')} px-4 py-2 rounded-lg flex items-center space-x-2`}>
            <BarChart3 className="w-4 h-4" />
            <span>Rapport</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${getStatsClasses(theme, 'background')} rounded-xl border ${getStatsClasses(theme, 'border')} p-6`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${getStatsClasses(theme, 'icon')}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`${stat.isPositive ? 'text-emerald-500' : 'text-red-500'} flex items-center text-sm font-medium`}>
                {stat.change}
                {stat.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 ml-1" />
                )}
              </span>
            </div>
            <div className="mt-4">
              <h2 className={`text-3xl font-bold ${getThemeClasses(theme, 'text')}`}>{stat.value}</h2>
              <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>{stat.title}</p>
              <p className={`text-sm ${getThemeClasses(theme, 'textTertiary')} mt-2`}>{stat.details}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Performance
              </h2>
            </div>
            <button className={`${getThemeClasses(theme, 'hover')} p-2 rounded-lg`}>
              <ChevronDown className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
            </button>
          </div>

          <div className="space-y-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={getThemeClasses(theme, 'text')}>{metric.label}</span>
                  <span className={`${getThemeClasses(theme, 'text')} font-medium`}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
                <div className={`h-2 rounded-full ${getThemeClasses(theme, 'backgroundTertiary')}`}>
                  <div 
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${(metric.value / metric.target) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className={getThemeClasses(theme, 'textSecondary')}>
                    Objectif: {metric.target}{metric.unit}
                  </span>
                  <span className={`${metric.value >= metric.target ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {((metric.value / metric.target) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Activité Récente
              </h2>
            </div>
            <span className={`${getThemeClasses(theme, 'textSecondary')} text-sm`}>
              Aujourd'hui
            </span>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index}
                className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg ${getThemeClasses(theme, 'cardHover')}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getThemeClasses(theme, 'backgroundSecondary')}`}>
                      <Shield className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                        Ronde complétée
                      </p>
                      <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                        Site A - Zone Nord
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                    Il y a 2h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;