
import { useState } from 'react';
import { Routes, Route, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { MapPin, History } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../config/theme';

export default function Rounds() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<'map' | 'history'>(
    location.pathname.includes('history') ? 'history' : 'map'
  );

  const handleViewChange = (view: 'map' | 'history') => {
    setActiveView(view);
    navigate(view === 'map' ? '/rounds' : '/rounds/history');
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${getThemeClasses(theme, 'text')}`}>Gestion des Rondes</h1>
          <p className={`mt-1 ${getThemeClasses(theme, 'textSecondary')}`}>
            Créez et gérez vos rondes de sécurité
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => handleViewChange('map')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'map'
                ? `bg-primary-500 text-white`
                : `${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'hover')}`
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>Carte des Rondes</span>
          </button>
          <button
            onClick={() => handleViewChange('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === 'history'
                ? `bg-primary-500 text-white`
                : `${getThemeClasses(theme, 'backgroundTertiary')} ${getThemeClasses(theme, 'hover')}`
            }`}
          >
            <History className="w-5 h-5" />
            <span>Voir l'historique</span>
          </button>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
