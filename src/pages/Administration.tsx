import React, { useState } from 'react';
import { 
  BarChart, 
  Download, 
  Clock, 
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  Filter,
  ChevronDown,
  Search,
  MapPin
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses, getButtonClasses, getTableClasses } from '../config/theme';

interface Performance {
  agent: string;
  avatar: string;
  completedRounds: number;
  incidents: number;
  avgDuration: string;
  successRate: number;
  department: string;
  lastRound: string;
}

interface Incident {
  id: number;
  type: 'security' | 'maintenance' | 'emergency';
  description: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  priority: 'high' | 'medium' | 'low';
}

const performances: Performance[] = [
  {
    agent: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    completedRounds: 45,
    incidents: 2,
    avgDuration: "42 mins",
    successRate: 98,
    department: "Site A - Zone Nord",
    lastRound: "Il y a 2 heures"
  },
  {
    agent: "Jane Smith",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    completedRounds: 38,
    incidents: 1,
    avgDuration: "45 mins",
    successRate: 95,
    department: "Site B - Zone Sud",
    lastRound: "Il y a 1 heure"
  },
  {
    agent: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    completedRounds: 42,
    incidents: 3,
    avgDuration: "40 mins",
    successRate: 94,
    department: "Site A - Zone Est",
    lastRound: "Il y a 30 minutes"
  }
];

const incidents: Incident[] = [
  {
    id: 1,
    type: 'security',
    description: "Porte de sécurité mal fermée",
    location: "Bâtiment A - Entrée principale",
    status: 'resolved',
    reportedBy: "John Doe",
    reportedAt: "2024-02-28 14:30",
    priority: 'high'
  },
  {
    id: 2,
    type: 'maintenance',
    description: "Caméra de surveillance défectueuse",
    location: "Parking B - Zone 3",
    status: 'in-progress',
    reportedBy: "Jane Smith",
    reportedAt: "2024-02-28 15:45",
    priority: 'medium'
  },
  {
    id: 3,
    type: 'emergency',
    description: "Détection de mouvement suspect",
    location: "Zone Restreinte - Secteur 2",
    status: 'pending',
    reportedBy: "Mike Johnson",
    reportedAt: "2024-02-28 16:15",
    priority: 'high'
  }
];

const getIncidentTypeColor = (type: Incident['type']) => {
  switch (type) {
    case 'security': return 'text-red-500';
    case 'maintenance': return 'text-orange-500';
    case 'emergency': return 'text-purple-500';
    default: return 'text-slate-500';
  }
};

const getIncidentStatusColor = (status: Incident['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500';
    case 'in-progress': return 'bg-blue-500';
    case 'resolved': return 'bg-green-500';
    default: return 'bg-slate-500';
  }
};

const getIncidentPriorityColor = (priority: Incident['priority']) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-orange-500';
    case 'low': return 'text-yellow-500';
    default: return 'text-slate-500';
  }
};

export default function Administration() {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Incident['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Incident['type'] | 'all'>('all');

  const handleExport = (format: 'pdf' | 'excel') => {
    // Implement export logic here
    console.log(`Exporting in ${format} format...`);
  };

  const filteredIncidents = incidents
    .filter(incident => 
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(incident => statusFilter === 'all' || incident.status === statusFilter)
    .filter(incident => typeFilter === 'all' || incident.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>Administration</h1>
          <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
            Supervision et rapports de sécurité
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
          <button
            onClick={() => handleExport('pdf')}
            className={`flex items-center space-x-2 ${getButtonClasses(theme, 'primary')} px-4 py-2 rounded-lg`}
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className={`flex items-center space-x-2 ${getButtonClasses(theme, 'secondary')} px-4 py-2 rounded-lg`}
          >
            <FileText className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart className="w-5 h-5 text-primary-500" />
            <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
              Vue d'ensemble des performances
            </h2>
          </div>
          <button className={`${getThemeClasses(theme, 'hover')} p-2 rounded-lg`}>
            <ChevronDown className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={getTableClasses(theme, 'header')}>
                <th className="px-6 py-4 text-left">Agent</th>
                <th className="px-6 py-4 text-left">Département</th>
                <th className="px-6 py-4 text-left">Rondes Complétées</th>
                <th className="px-6 py-4 text-left">Incidents</th>
                <th className="px-6 py-4 text-left">Durée Moyenne</th>
                <th className="px-6 py-4 text-left">Taux de Réussite</th>
                <th className="px-6 py-4 text-left">Dernière Ronde</th>
              </tr>
            </thead>
            <tbody>
              {performances.map((perf, index) => (
                <tr key={index} className={getTableClasses(theme, 'row')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={perf.avatar}
                        alt={perf.agent}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className={getThemeClasses(theme, 'text')}>{perf.agent}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>
                    {perf.department}
                  </td>
                  <td className={`px-6 py-4 ${getThemeClasses(theme, 'text')}`}>
                    {perf.completedRounds}
                  </td>
                  <td className={`px-6 py-4 ${getThemeClasses(theme, 'text')}`}>
                    {perf.incidents}
                  </td>
                  <td className={`px-6 py-4 ${getThemeClasses(theme, 'text')}`}>
                    {perf.avgDuration}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-24 h-2 rounded-full ${getThemeClasses(theme, 'backgroundTertiary')}`}>
                        <div
                          className="h-full rounded-full bg-primary-500"
                          style={{ width: `${perf.successRate}%` }}
                        />
                      </div>
                      <span className={`text-sm ${getThemeClasses(theme, 'text')}`}>
                        {perf.successRate}%
                      </span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>
                    {perf.lastRound}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incidents */}
      <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary-500" />
            <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
              Incidents
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
              <input
                type="text"
                placeholder="Rechercher des incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 ${getThemeClasses(theme, 'input')}`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Incident['status'] | 'all')}
              className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in-progress">En cours</option>
              <option value="resolved">Résolu</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as Incident['type'] | 'all')}
              className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
            >
              <option value="all">Tous les types</option>
              <option value="security">Sécurité</option>
              <option value="maintenance">Maintenance</option>
              <option value="emergency">Urgence</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <div 
              key={incident.id}
              className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg ${getThemeClasses(theme, 'cardHover')}`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                      {incident.description}
                    </span>
                    <span className={`text-sm ${getIncidentTypeColor(incident.type)}`}>
                      {incident.type === 'security' ? 'Sécurité' : 
                       incident.type === 'maintenance' ? 'Maintenance' : 'Urgence'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getIncidentStatusColor(incident.status)}`}>
                      {incident.status === 'pending' ? 'En attente' : 
                       incident.status === 'in-progress' ? 'En cours' : 'Résolu'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <span className={getThemeClasses(theme, 'textSecondary')}>
                        {incident.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <span className={getThemeClasses(theme, 'textSecondary')}>
                        {incident.reportedBy}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <span className={getThemeClasses(theme, 'textSecondary')}>
                        {incident.reportedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getIncidentPriorityColor(incident.priority)}`}>
                    {incident.priority === 'high' ? 'Priorité haute' :
                     incident.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}