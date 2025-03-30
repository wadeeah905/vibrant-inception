import React, { useState } from 'react';
import { 
  Smartphone, 
  QrCode, 
  Copy, 
  Download, 
  Upload, 
  Server, 
  Shield, 
  CheckCircle,
  Info,
  Settings,
  RefreshCw,
  Trash2,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses, getButtonClasses } from '../config/theme';

interface AppVersion {
  version: string;
  platform: 'ios' | 'android';
  uploadDate: string;
  size: string;
  status: 'active' | 'pending' | 'deprecated';
}

const versions: AppVersion[] = [
  {
    version: '2.1.0',
    platform: 'ios',
    uploadDate: '2024-02-28',
    size: '45.2 MB',
    status: 'active'
  },
  {
    version: '2.1.0',
    platform: 'android',
    uploadDate: '2024-02-28',
    size: '42.8 MB',
    status: 'active'
  },
  {
    version: '2.0.9',
    platform: 'ios',
    uploadDate: '2024-02-15',
    size: '44.8 MB',
    status: 'deprecated'
  },
  {
    version: '2.0.9',
    platform: 'android',
    uploadDate: '2024-02-15',
    size: '42.5 MB',
    status: 'deprecated'
  }
];

export default function Mobile() {
  const { theme } = useTheme();
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'settings'>('overview');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const downloadLink = 'https://guardon.app/download';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadLink);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusColor = (status: AppVersion['status']) => {
    switch (status) {
      case 'active':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'deprecated':
        return 'text-red-500 bg-red-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>
            Application Mobile
          </h1>
          <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
            Gestion et déploiement de l'application mobile
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-inherit">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Smartphone },
          { id: 'versions', label: 'Versions', icon: RefreshCw },
          { id: 'settings', label: 'Paramètres', icon: Settings }
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Download Section */}
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <Download className="w-6 h-6 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Téléchargement
              </h2>
            </div>

            <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-6 rounded-lg text-center mb-6`}>
              <QrCode className="w-32 h-32 mx-auto mb-4 text-primary-500" />
              <p className={`font-medium ${getThemeClasses(theme, 'text')} mb-2`}>
                Scannez pour télécharger
              </p>
              <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')} mb-4`}>
                Version 2.1.0 disponible
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={downloadLink}
                  readOnly
                  className={`flex-1 ${getThemeClasses(theme, 'input')}`}
                />
                <button
                  onClick={handleCopyLink}
                  className={`${getButtonClasses(theme, 'secondary')} p-2 rounded-lg`}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              {showCopiedAlert && (
                <div className="flex items-center space-x-2 text-emerald-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Lien copié !</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <Upload className="w-6 h-6 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Mise à jour de l'Application
              </h2>
            </div>

            <div className="space-y-6">
              <div className={`${getThemeClasses(theme, 'backgroundTertiary')} p-6 rounded-lg`}>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-700/10 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-primary-500" />
                      <p className={`mb-2 text-sm font-semibold ${getThemeClasses(theme, 'text')}`}>
                        Cliquez pour uploader
                      </p>
                      <p className={`text-xs ${getThemeClasses(theme, 'textSecondary')}`}>
                        APK ou IPA (MAX. 100MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".apk,.ipa"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={getThemeClasses(theme, 'text')}>Progression</span>
                    <span className={getThemeClasses(theme, 'text')}>{uploadProgress}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${getThemeClasses(theme, 'backgroundTertiary')}`}>
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Server Info */}
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6 lg:col-span-2`}>
            <div className="flex items-center space-x-3 mb-6">
              <Server className="w-6 h-6 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Informations Serveur
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Sécurité',
                  value: 'SSL/TLS Activé',
                  status: 'Sécurisé'
                },
                {
                  icon: RefreshCw,
                  title: 'Mise à jour',
                  value: 'Auto-update v2.1.0',
                  status: 'Activé'
                },
                {
                  icon: AlertCircle,
                  title: 'Statut API',
                  value: '99.9% Uptime',
                  status: 'Opérationnel'
                }
              ].map((item, index) => (
                <div key={index} className={`${getThemeClasses(theme, 'backgroundTertiary')} p-4 rounded-lg`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <item.icon className="w-5 h-5 text-primary-500" />
                    <h3 className={`font-medium ${getThemeClasses(theme, 'text')}`}>{item.title}</h3>
                  </div>
                  <p className={`text-sm ${getThemeClasses(theme, 'textSecondary')} mb-2`}>{item.value}</p>
                  <span className="text-emerald-500 text-sm">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={getThemeClasses(theme, 'textSecondary')}>
                  <th className="text-left py-3 px-4">Version</th>
                  <th className="text-left py-3 px-4">Plateforme</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Taille</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version, index) => (
                  <tr 
                    key={index}
                    className={`border-t ${getThemeClasses(theme, 'border')} ${getThemeClasses(theme, 'hover')}`}
                  >
                    <td className={`py-4 px-4 ${getThemeClasses(theme, 'text')}`}>
                      {version.version}
                    </td>
                    <td className={`py-4 px-4 ${getThemeClasses(theme, 'text')}`}>
                      {version.platform === 'ios' ? 'iOS' : 'Android'}
                    </td>
                    <td className={`py-4 px-4 ${getThemeClasses(theme, 'textSecondary')}`}>
                      {version.uploadDate}
                    </td>
                    <td className={`py-4 px-4 ${getThemeClasses(theme, 'textSecondary')}`}>
                      {version.size}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(version.status)}`}>
                        {version.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}>
                          <Download className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
                        </button>
                        <button className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}>
                          <Info className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
                        </button>
                        {version.status !== 'active' && (
                          <button className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Configuration de l'Application
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>
                  Paramètres Généraux
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Mise à jour automatique',
                      description: 'Les utilisateurs recevront automatiquement les mises à jour'
                    },
                    {
                      label: 'Mode hors-ligne',
                      description: 'Autoriser l\'utilisation sans connexion internet'
                    },
                    {
                      label: 'Géolocalisation en arrière-plan',
                      description: 'Suivre la position même en arrière-plan'
                    }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className={`block ${getThemeClasses(theme, 'text')}`}>
                          {setting.label}
                        </span>
                        <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                          {setting.description}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
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
                  API et Intégrations
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      URL de l'API
                    </label>
                    <input
                      type="text"
                      defaultValue="https://api.guardon.app/v1"
                      className={`w-full ${getThemeClasses(theme, 'input')}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Clé API
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        defaultValue="sk_live_xxxxxxxxxxxxx"
                        className={`flex-1 ${getThemeClasses(theme, 'input')}`}
                      />
                      <button className={`${getButtonClasses(theme, 'secondary')} px-4 rounded-lg`}>
                        Régénérer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${getThemeClasses(theme, 'card')} rounded-xl p-6`}>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-primary-500" />
              <h2 className={`text-xl font-semibold ${getThemeClasses(theme, 'text')}`}>
                Sécurité et Conformité
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-medium ${getThemeClasses(theme, 'text')} mb-4`}>
                  Authentification
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Authentification biométrique',
                      description: 'Utiliser Face ID / Touch ID pour la connexion'
                    },
                    {
                      label: 'Double authentification',
                      description: 'Exiger une validation en deux étapes'
                    },
                    {
                      label: 'Verrouillage automatique',
                      description: 'Verrouiller l\'app après 5 minutes d\'inactivité'
                    }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className={`block ${getThemeClasses(theme, 'text')}`}>
                          {setting.label}
                        </span>
                        <span className={`text-sm ${getThemeClasses(theme, 'textSecondary')}`}>
                          {setting.description}
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
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
                  Stockage et Données
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Rétention des données
                    </label>
                    <select className={`w-full ${getThemeClasses(theme, 'input')}`}>
                      <option value="30">30 jours</option>
                      <option value="60">60 jours</option>
                      <option value="90">90 jours</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses(theme, 'textSecondary')} mb-2`}>
                      Chiffrement
                    </label>
                    <select className={`w-full ${getThemeClasses(theme, 'input')}`}>
                      <option value="aes">AES-256</option>
                      <option value="rsa">RSA</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}