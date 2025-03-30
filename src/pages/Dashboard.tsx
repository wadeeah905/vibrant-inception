
import { 
  Activity, 
  Users as UsersIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Shield,
  AlertTriangle,
  MapPin,
  ChevronDown,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Settings as SettingsIcon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses, getStatsClasses, getButtonClasses } from '../config/theme';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
    details: "4 rondes terminées aujourd'hui",
    link: "/rounds"
  },
  {
    title: "Agents Connectés",
    value: "24",
    change: "+12%",
    isPositive: true,
    icon: UsersIcon,
    details: "8 agents en service",
    link: "/users"
  },
  {
    title: "Messages",
    value: "18",
    change: "+5%",
    isPositive: true,
    icon: MessageSquare,
    details: "3 nouveaux messages",
    link: "/messages"
  },
  {
    title: "Incidents",
    value: "3",
    change: "-25%",
    isPositive: true,
    icon: AlertTriangle,
    details: "2 résolus aujourd'hui",
    link: "/administration"
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
            Vue d'ensemble des activités
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

      {/* Stats Grid - Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link 
            to={stat.link} 
            key={index}
            className={`${getStatsClasses(theme, 'background')} rounded-xl border ${getStatsClasses(theme, 'border')} p-6 transition-transform hover:scale-[1.02] cursor-pointer`}
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
          </Link>
        ))}
      </div>

      {/* Main dashboard sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rounds Overview */}
        <Link to="/rounds" className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 transition-transform hover:scale-[1.01] cursor-pointer col-span-1`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Rondes
              </h2>
            </div>
            <Shield className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
          </div>

          <div className="space-y-4">
            <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg ${getThemeClasses(theme, 'cardHover')}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getThemeClasses(theme, 'backgroundSecondary')}`}>
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                      Ronde en cours
                    </p>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                      Site A - Zone Nord
                    </p>
                  </div>
                </div>
                <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                  45 min
                </span>
              </div>
            </div>
            
            <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg ${getThemeClasses(theme, 'cardHover')}`}>
              <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                Points à contrôler aujourd'hui
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className={`text-3xl font-bold ${getThemeClasses(theme, 'text')}`}>
                  24
                </p>
                <p className={`text-sm ${getThemeClasses(theme, 'textTertiary')}`}>
                  8 restants
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Users Overview */}
        <Link to="/users" className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 transition-transform hover:scale-[1.01] cursor-pointer col-span-1`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Utilisateurs
              </h2>
            </div>
            <TrendingUp className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className={getThemeClasses(theme, 'textSecondary')}>Agents actifs</p>
              <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>18/24</p>
            </div>
            <div className="h-2 rounded-full bg-gray-700">
              <div className="h-full rounded-full bg-primary-500" style={{ width: '75%' }} />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-3 rounded-lg flex justify-between items-center`}>
              <p className={getThemeClasses(theme, 'text')}>Agents en service</p>
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 ${getThemeClasses(theme, 'border')} bg-gray-800 flex items-center justify-center`}>
                    <span className="text-xs font-medium text-primary-400">{i + 1}</span>
                  </div>
                ))}
                <div className={`w-8 h-8 rounded-full border-2 ${getThemeClasses(theme, 'border')} bg-gray-800 flex items-center justify-center`}>
                  <span className="text-xs font-medium text-primary-400">+14</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Administrative Info */}
        <Link to="/administration" className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 transition-transform hover:scale-[1.01] cursor-pointer col-span-1`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Administration
              </h2>
            </div>
            <SettingsIcon className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-1">
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
                </div>
              ))}
            </div>
            
            <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                    Efficacité globale
                  </p>
                  <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                    Ce mois-ci
                  </p>
                </div>
                <div className="p-2 rounded-full bg-primary-500/20">
                  <span className="text-lg font-bold text-primary-400">89%</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Messages and Settings Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/messages" className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 transition-transform hover:scale-[1.01] cursor-pointer`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${getThemeClasses(theme, 'backgroundTertiary')}`}>
              <MessageSquare className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')}`}>Messages</h3>
              <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                18 messages, 3 non lus
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            </div>
          </div>
        </Link>
        
        <Link to="/settings" className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 transition-transform hover:scale-[1.01] cursor-pointer`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${getThemeClasses(theme, 'backgroundTertiary')}`}>
              <SettingsIcon className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')}`}>Paramètres</h3>
              <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                Système et Préférences
              </p>
            </div>
            <div className="ml-auto">
              <ChevronDown className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
            </div>
          </div>
        </Link>
      </div>
      
      <div className="mt-8 text-center">
        <p className={`text-sm ${getThemeClasses(theme, 'textTertiary')}`}>
          Dernier rafraîchissement: Aujourd'hui à 15:30
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
