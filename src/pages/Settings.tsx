import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Image, 
  Bell, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Shield, 
  Save, 
  X,
  Globe,
  Volume2,
  Lock,
  BellRing,
  Database,
  FileText,
  Printer,
  Languages,
  Clock,
  Keyboard,
  Palette
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getThemeClasses, getButtonClasses } from '../config/theme';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  department: string;
  address: string;
  language: string;
  timezone: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
  desktop: boolean;
  roundStart: boolean;
  roundEnd: boolean;
  incidents: boolean;
  updates: boolean;
}

interface ReportSettings {
  logo: string;
  format: 'pdf' | 'excel';
  header: string;
  footer: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  template: string;
}

interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeout: number;
  passwordExpiration: number;
  ipWhitelist: boolean;
  deviceHistory: boolean;
  loginNotifications: boolean;
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'reports'>('general');

  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+33 6 12 34 56 78',
    department: 'Sécurité',
    address: '123 Rue de la Paix, Paris',
    language: 'fr',
    timezone: 'Europe/Paris'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sound: true,
    desktop: true,
    roundStart: true,
    roundEnd: true,
    incidents: true,
    updates: false
  });

  const [reportSettings, setReportSettings] = useState<ReportSettings>({
    logo: '',
    format: 'pdf',
    header: 'Rapport de Sécurité',
    footer: '© 2024 SecureGuard',
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
    template: 'standard'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactor: false,
    sessionTimeout: 30,
    passwordExpiration: 90,
    ipWhitelist: false,
    deviceHistory: true,
    loginNotifications: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Settings */}
            <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-primary-500" />
                <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                  Paramètres du Compte
                </h2>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Nom Complet
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <input
                        type="text"
                        value={userSettings.name}
                        onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Email
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <input
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <input
                        type="tel"
                        value={userSettings.phone}
                        onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Département
                    </label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <input
                        type="text"
                        value={userSettings.department}
                        onChange={(e) => setUserSettings({ ...userSettings, department: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Langue
                    </label>
                    <div className="relative">
                      <Globe className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <select
                        value={userSettings.language}
                        onChange={(e) => setUserSettings({ ...userSettings, language: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Fuseau Horaire
                    </label>
                    <div className="relative">
                      <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <select
                        value={userSettings.timezone}
                        onChange={(e) => setUserSettings({ ...userSettings, timezone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
                      >
                        <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                        <option value="Europe/London">Europe/London (UTC)</option>
                        <option value="America/New_York">America/New_York (UTC-5)</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${getThemeClasses(theme, 'textSecondary')}`} />
                      <input
                        type="text"
                        value={userSettings.address}
                        onChange={(e) => setUserSettings({ ...userSettings, address: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg ${getThemeClasses(theme, 'input')}`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full ${getButtonClasses(theme, 'primary')} py-2 rounded-lg flex items-center justify-center space-x-2`}
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Modifications</span>
                </button>
              </form>
            </div>

            {/* Theme Settings */}
            <div className="space-y-6">
              <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
                <div className="flex items-center space-x-3 mb-6">
                  <Palette className="w-6 h-6 text-primary-500" />
                  <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                    Apparence
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      theme === 'light'
                        ? 'bg-primary-500 text-white'
                        : `${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'hover')}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Sun className="w-5 h-5" />
                      <span>Mode Clair</span>
                    </div>
                    {theme === 'light' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>

                  <button
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-primary-500 text-white'
                        : `${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'hover')}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Moon className="w-5 h-5" />
                      <span>Mode Sombre</span>
                    </div>
                    {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
                <div className="flex items-center space-x-3 mb-6">
                  <Keyboard className="w-6 h-6 text-primary-500" />
                  <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                    Raccourcis Clavier
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={getThemeClasses(theme, 'text')}>Nouvelle Ronde</span>
                    <kbd className={`px-2 py-1 rounded ${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'textSecondary')}`}>
                      ⌘ + N
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={getThemeClasses(theme, 'text')}>Rechercher</span>
                    <kbd className={`px-2 py-1 rounded ${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'textSecondary')}`}>
                      ⌘ + K
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={getThemeClasses(theme, 'text')}>Aide</span>
                    <kbd className={`px-2 py-1 rounded ${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'textSecondary')}`}>
                      ?
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-primary-500" />
                <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                  Notifications
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>
                    Canaux de Notification
                  </h3>
                  <div className="space-y-4">
                    {Object.entries({
                      email: 'Notifications par Email',
                      push: 'Notifications Push',
                      sound: 'Sons de Notification',
                      desktop: 'Notifications Bureau'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className={getThemeClasses(theme, 'text')}>{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[key as keyof NotificationSettings]}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>
                    Types de Notification
                  </h3>
                  <div className="space-y-4">
                    {Object.entries({
                      roundStart: 'Début de Ronde',
                      roundEnd: 'Fin de Ronde',
                      incidents: 'Incidents',
                      updates: 'Mises à jour Système'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className={getThemeClasses(theme, 'text')}>{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[key as keyof NotificationSettings]}
                            onChange={(e) => setNotificationSettings(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className={`w-full ${getButtonClasses(theme, 'primary')} py-2 rounded-lg flex items-center justify-center space-x-2`}
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Préférences</span>
                </button>
              </div>
            </div>

            <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <BellRing className="w-6 h-6 text-primary-500" />
                <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                  Aperçu des Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                        Nouvelle Ronde Assignée
                      </h4>
                      <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                        Vous avez été assigné à la ronde "Périmètre Nord"
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                        Incident Détecté
                      </h4>
                      <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                        Alerte de sécurité dans la Zone B
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                        Ronde Terminée
                      </h4>
                      <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                        La ronde "Périmètre Sud" a été complétée
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-6 h-6 text-primary-500" />
                <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                  Sécurité du Compte
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>
                    Authentification
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`block ${getThemeClasses(theme, 'text')}`}>
                          Authentification à Deux Facteurs
                        </span>
                        <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                          Ajoute une couche de sécurité supplémentaire
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactor}
                          onChange={(e) => setSecuritySettings(prev => ({
                            ...prev,
                            twoFactor: e.target.checked
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${getThemeClasses(theme, 'text')} mb-2`}>
                        Expiration du Mot de Passe (jours)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.passwordExpiration}
                        onChange={(e) => setSecuritySettings(prev => ({
                          ...prev,
                          passwordExpiration: parseInt(e.target.value)
                        }))}
                        className={`w-full ${getThemeClasses(theme, 'input')}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${getThemeClasses(theme, 'text')} mb-2`}>
                        Délai d'Expiration de Session (minutes)
                      </label>
                      <input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings(prev => ({
                          ...prev,
                          sessionTimeout: parseInt(e.target.value)
                        }))}
                        className={`w-full ${getThemeClasses(theme, 'input')}`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>
                    Sécurité Avancée
                  </h3>
                  <div className="space-y-4">
                    {Object.entries({
                      ipWhitelist: 'Liste Blanche IP',
                      deviceHistory: 'Historique des Appareils',
                      loginNotifications: 'Notifications de Connexion'
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className={getThemeClasses(theme, 'text')}>{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings[key as keyof SecuritySettings]}
                            onChange={(e) => setSecuritySettings(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className={`w-full ${getButtonClasses(theme, 'primary')} py-2 rounded-lg flex items-center justify-center space-x-2`}
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Paramètres de Sécurité</span>
                </button>
              </div>
            </div>

            <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-primary-500" />
                <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                  Activité Récente
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    action: 'Connexion réussie',
                    device: 'Chrome sur Windows',
                    location: 'Paris, France',
                    time: 'Il y a 2 heures',
                    ip: '192.168.1.1'
                  },
                  {
                    action: 'Modification du mot de passe',
                    device: 'Firefox sur MacOS',
                    location: 'Lyon, France',
                    time: 'Il y a 3 jours',
                    ip: '192.168.1.2'
                  },
                  {
                    action: 'Activation 2FA',
                    device: 'Safari sur iPhone',
                    location: 'Marseille, France',
                    time: 'Il y a 1 semaine',
                    ip: '192.168.1.3'
                  }
                ].map((activity, index) => (
                  <div key={index} className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${getThemeClasses(theme, 'text')}`}>
                          {activity.action}
                        </h4>
                        <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                          {activity.device}
                        </p>
                        <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                          {activity.location} • {activity.ip}
                        </p>
                      </div>
                      <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-primary-500" />
                <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                  Paramètres des Rapports
                </h2>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                    Logo de l'Entreprise
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 ${getThemeClasses(theme, 'backgroundTertiary')} rounded-lg flex items-center justify-center`}>
                      <Image className="w-8 h-8 text-primary-500" />
                    </div>
                    <button
                      type="button"
                      className={`${getButtonClasses(theme, 'secondary')} px-4 py-2 rounded-lg`}
                    >
                      Changer le Logo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Format des Rapports
                    </label>
                    <select
                      value={reportSettings.format}
                      onChange={(e) => setReportSettings({ ...reportSettings, format: e.target.value as 'pdf' | 'excel' })}
                      className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Modèle
                    </label>
                    <select
                      value={reportSettings.template}
                      onChange={(e) => setReportSettings({ ...reportSettings, template: e.target.value })}
                      className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                    >
                      <option value="standard">Standard</option>
                      <option value="detailed">Détaillé</option>
                      <option value="compact">Compact</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Langue
                    </label>
                    <select
                      value={reportSettings.language}
                      onChange={(e) => setReportSettings({ ...reportSettings, language: e.target.value })}
                      className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Format de Date
                    </label>
                    <select
                      value={reportSettings.dateFormat}
                      onChange={(e) => setReportSettings({ ...reportSettings, dateFormat: e.target.value })}
                      className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      En-tête du Rapport
                    </label>
                    <input
                      type="text"
                      value={reportSettings.header}
                      onChange={(e) => setReportSettings({ ...reportSettings, header: e.target.value })}
                      className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Pied de Page
                    </label>
                    <input
                      type="text"
                      value={reportSettings.footer}
                      onChange={(e) => setReportSettings({ ...reportSettings, footer: e.target.value })}
                      className={`w-full rounded-lg ${getThemeClasses(theme, 'input')}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full ${getButtonClasses(theme, 'primary')} py-2 rounded-lg flex items-center justify-center space-x-2`}
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Paramètres</span>
                </button>
              </form>
            </div>

            <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
              <div className="flex items-center space-x-3 mb-6">
                <Printer className="w-6 h-6 text-primary-500" />
                <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                  Aperçu du Rapport
                </h2>
              </div>

              <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-6 rounded-lg`}>
                <div className="flex justify-between items-center mb-6">
                  <div className={`w-16 h-16 ${getThemeClasses(theme, 'backgroundSecondary')} rounded-lg flex items-center justify-center`}>
                    <Image className="w-8 h-8 text-primary-500" />
                  </div>
                  <div className={`text-right ${getThemeClasses(theme, 'textSecondary')}`}>
                    <p>Date: 28/02/2024</p>
                    <p>Ref: SEC-2024-001</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className={`text-xl font-bold ${getThemeClasses(theme, 'text')} mb-2`}>
                    {reportSettings.header}
                  </h3>
                  <p className={getThemeClasses(theme, 'textSecondary')}>
                    Rapport de surveillance et de sécurité
                  </p>
                </div>

                <div className={`${getThemeClasses(theme, 'backgroundSecondary')} p-4 rounded-lg mb-6`}>
                  <h4 className={`font-medium ${getThemeClasses(theme, 'text')} mb-2`}>
                    Résumé des Activités
                  </h4>
                  <div className="space-y-2">
                    <p className={getThemeClasses(theme, 'textSecondary')}>• Rondes effectuées: 12</p>
                    <p className={getThemeClasses(theme, 'textSecondary')}>• Incidents signalés: 2</p>
                    <p className={getThemeClasses(theme, 'textSecondary')}>• Points de contrôle: 48</p>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                    {reportSettings.footer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>Paramètres</h1>
          <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
            Gérez vos préférences et paramètres de sécurité
          </p>
        </div>
        {showSaveSuccess && (
          <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
            <Save className="w-4 h-4" />
            <span>Modifications enregistrées</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 border-b border-inherit">
        {[
          { id: 'general', label: 'Général', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Sécurité', icon: Lock },
          { id: 'reports', label: 'Rapports', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 -mb-px flex items-center space-x-2 ${
              activeTab === tab.id
                ? `border-b-2 border-primary-500 ${getThemeClasses(theme, 'text')}`
                : getThemeClasses(theme, 'textSecondary')
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}

