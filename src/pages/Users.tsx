import React, { useState } from 'react';
import { User, Shield, Clock, Search, Filter, Plus, Edit, Trash2, X, Check, ArrowUpDown, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses, getButtonClasses, getTableClasses } from '../config/theme';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'guard';
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
  phone?: string;
  department?: string;
  address?: string;
}

interface UserLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  timestamp: string;
  ip: string;
  device: string;
  location?: string;
}

const users: UserData[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "supervisor",
    status: "active",
    lastActive: "2024-02-28 09:30:45",
    createdAt: "2024-01-15",
    phone: "+33 6 12 34 56 78",
    department: "Sécurité Site A",
    address: "123 Rue de la Paix, Paris"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "guard",
    status: "active",
    lastActive: "2024-02-28 09:15:22",
    createdAt: "2024-01-20",
    phone: "+33 6 98 76 54 32",
    department: "Sécurité Site B",
    address: "456 Avenue des Champs-Élysées, Paris"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    role: "admin",
    status: "active",
    lastActive: "2024-02-28 09:00:15",
    createdAt: "2024-01-10",
    phone: "+33 6 11 22 33 44",
    department: "Administration",
    address: "789 Boulevard Haussmann, Paris"
  }
];

const logs: UserLog[] = [
  {
    id: 1,
    userId: 1,
    userName: "John Doe",
    action: "Connexion au système",
    timestamp: "2024-02-28 09:30:45",
    ip: "192.168.1.100",
    device: "Windows / Chrome",
    location: "Paris, France"
  },
  {
    id: 2,
    userId: 2,
    userName: "Jane Smith",
    action: "Début de ronde",
    timestamp: "2024-02-28 09:15:22",
    ip: "192.168.1.101",
    device: "iOS / Safari",
    location: "Lyon, France"
  },
  {
    id: 3,
    userId: 3,
    userName: "Mike Johnson",
    action: "Mise à jour du profil",
    timestamp: "2024-02-28 09:00:15",
    ip: "192.168.1.102",
    device: "Android / Chrome",
    location: "Marseille, France"
  }
];

const getRoleColor = (role: UserData['role']) => {
  switch (role) {
    case 'admin': return 'bg-purple-500';
    case 'supervisor': return 'bg-primary-500';
    case 'guard': return 'bg-emerald-500';
    default: return 'bg-slate-500';
  }
};

const getRoleName = (role: UserData['role']) => {
  switch (role) {
    case 'admin': return 'Administrateur';
    case 'supervisor': return 'Superviseur';
    case 'guard': return 'Agent';
    default: return role;
  }
};

function Users() {
  const { theme } = useTheme();
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserData['role'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserData['status'] | 'all'>('all');
  const [sortField, setSortField] = useState<keyof UserData>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => roleFilter === 'all' || user.role === roleFilter)
    .filter(user => statusFilter === 'all' || user.status === statusFilter)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

  const userLogs = selectedUser 
    ? logs.filter(log => log.userId === selectedUser.id)
    : logs;

  const handleSort = (field: keyof UserData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleUserDetails = (user: UserData) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>Gestion des Utilisateurs</h1>
        <button
          onClick={() => setShowNewUserModal(true)}
          className={`${getButtonClasses(theme, 'primary')} flex items-center space-x-2 px-4 py-2 rounded-lg`}
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter un Utilisateur</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-inherit">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 -mb-px ${
            activeTab === 'users'
              ? `border-b-2 border-primary-500 ${getThemeClasses(theme, 'text')}`
              : getThemeClasses(theme, 'textSecondary')
          }`}
        >
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Utilisateurs</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 -mb-px ${
            activeTab === 'logs'
              ? `border-b-2 border-primary-500 ${getThemeClasses(theme, 'text')}`
              : getThemeClasses(theme, 'textSecondary')
          }`}
        >
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Historique des Connexions</span>
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
          <input
            type="text"
            placeholder={activeTab === 'users' ? "Rechercher des utilisateurs..." : "Rechercher dans l'historique..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
          />
        </div>
        {activeTab === 'users' && (
          <>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserData['role'] | 'all')}
              className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="supervisor">Superviseur</option>
              <option value="guard">Agent</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserData['status'] | 'all')}
              className={`rounded-lg px-4 py-2 ${getThemeClasses(theme, 'input')}`}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </>
        )}
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className={`${getThemeClasses(theme, 'card')} rounded-xl overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={getTableClasses(theme, 'header')}>
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      className="flex items-center space-x-2"
                      onClick={() => handleSort('name')}
                    >
                      <span>Nom</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Rôle</th>
                  <th className="px-6 py-4 text-left">Statut</th>
                  <th className="px-6 py-4 text-left">Dernière Activité</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={getTableClasses(theme, 'row')}>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'text')}`}>{user.name}</td>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)} bg-opacity-10 text-${getRoleColor(user.role).split('-')[0]}-700`}>
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>{user.lastActive}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleUserDetails(user)}
                        className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
                      >
                        <Eye className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
                      </button>
                      <button className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}>
                        <Edit className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
                      </button>
                      <button className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logs Table */}
      {activeTab === 'logs' && (
        <div className={`${getThemeClasses(theme, 'card')} rounded-xl overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={getTableClasses(theme, 'header')}>
                <tr>
                  <th className="px-6 py-4 text-left">Utilisateur</th>
                  <th className="px-6 py-4 text-left">Action</th>
                  <th className="px-6 py-4 text-left">Date et Heure</th>
                  <th className="px-6 py-4 text-left">Adresse IP</th>
                  <th className="px-6 py-4 text-left">Appareil</th>
                  <th className="px-6 py-4 text-left">Localisation</th>
                </tr>
              </thead>
              <tbody>
                {userLogs.map((log) => (
                  <tr key={log.id} className={getTableClasses(theme, 'row')}>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'text')}`}>{log.userName}</td>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>{log.action}</td>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>{log.timestamp}</td>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>{log.ip}</td>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>{log.device}</td>
                    <td className={`px-6 py-4 ${getThemeClasses(theme, 'textSecondary')}`}>{log.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${getThemeClasses(theme, 'scrollbar')}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>Détails de l'Utilisateur</h2>
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
              >
                <X className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className={`${getThemeClasses(theme, 'backgroundTertiary')} rounded-lg p-4`}>
                <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>Informations Personnelles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>Nom</p>
                    <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>Email</p>
                    <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>Téléphone</p>
                    <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>Département</p>
                    <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>{selectedUser.department}</p>
                  </div>
                  <div className="col-span-2">
                    <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>Adresse</p>
                    <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>{selectedUser.address}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>Activité Récente</h3>
                <div className="space-y-3">
                  {logs.filter(log => log.userId === selectedUser.id).map((log) => (
                    <div key={log.id} className={`${getThemeClasses(theme, 'backgroundTertiary')} rounded-lg p-4`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${getThemeClasses(theme, 'text')}`}>{log.action}</p>
                          <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>{log.device}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>{log.timestamp}</p>
                          <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>{log.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className={`${getButtonClasses(theme, 'secondary')} px-4 py-2 rounded-lg`}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>Ajouter un Utilisateur</h2>
              <button
                onClick={() => setShowNewUserModal(false)}
                className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
              >
                <X className={`w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                  Nom
                </label>
                <input
                  type="text"
                  className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                  placeholder="Entrez le nom"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                  placeholder="Entrez l'email"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                  Rôle
                </label>
                <select className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}>
                  <option value="guard">Agent</option>
                  <option value="supervisor">Superviseur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className={`flex-1 ${getButtonClasses(theme, 'primary')} py-2 rounded-lg`}
                >
                  Créer l'Utilisateur
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  className={`flex-1 ${getButtonClasses(theme, 'secondary')} py-2 rounded-lg`}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;