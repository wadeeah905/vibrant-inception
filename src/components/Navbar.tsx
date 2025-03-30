
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, User, LogOut, Moon, Sun, Search, Menu, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses } from '../config/theme';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 5000); // 5 seconds delay
  };

  // Close dropdown when clicking outside of it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown') && showDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className={`${getThemeClasses(theme, 'backgroundSecondary')} border-b ${getThemeClasses(theme, 'border')} shadow-sm transition-colors duration-200`}>
      <div className="max-w-[2000px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button 
            className={`lg:hidden p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
            onClick={onMenuClick}
          >
            <Menu className={`w-5 h-5 ${getThemeClasses(theme, 'text')}`} />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
              SecureGuard
            </span>
          </Link>

          {/* Search - hidden on mobile, can be toggled */}
          <div className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg ${getThemeClasses(theme, 'backgroundTertiary')}`}>
            <Search className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
            <input
              type="text"
              placeholder="Rechercher..."
              className={`bg-transparent border-none outline-none w-48 ${getThemeClasses(theme, 'text')} placeholder:${getThemeClasses(theme, 'textSecondary')}`}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Search toggle for mobile */}
          <button 
            className={`md:hidden p-2 rounded-lg transition-colors ${getThemeClasses(theme, 'hover')}`}
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className={`w-5 h-5 ${getThemeClasses(theme, 'text')}`} />
          </button>

          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${getThemeClasses(theme, 'hover')}`}
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {theme === 'dark' ? (
              <Sun className={`w-5 h-5 ${getThemeClasses(theme, 'text')}`} />
            ) : (
              <Moon className={`w-5 h-5 ${getThemeClasses(theme, 'text')}`} />
            )}
          </button>

          <button 
            className={`p-2 rounded-lg transition-colors ${getThemeClasses(theme, 'hover')}`}
            title="Notifications"
          >
            <div className="relative">
              <Bell className={`w-5 h-5 ${getThemeClasses(theme, 'text')}`} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                3
              </span>
            </div>
          </button>
          
          <div 
            className="relative user-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${getThemeClasses(theme, 'hover')}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className={`w-8 h-8 rounded-full ${getThemeClasses(theme, 'backgroundTertiary')} flex items-center justify-center`}>
                <User className={`w-4 h-4 ${getThemeClasses(theme, 'text')}`} />
              </div>
              <span className={`hidden md:block ${getThemeClasses(theme, 'text')}`}>
                {user?.name}
              </span>
            </button>

            {showDropdown && (
              <div className={`absolute right-0 top-full mt-2 w-48 ${getThemeClasses(theme, 'backgroundSecondary')} rounded-lg shadow-lg border ${getThemeClasses(theme, 'border')} py-1 z-50`}>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 ${getThemeClasses(theme, 'hover')} ${getThemeClasses(theme, 'text')}`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className={`w-full flex items-center space-x-2 px-4 py-2 ${getThemeClasses(theme, 'hover')} text-red-500`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className={`md:hidden p-2 pb-3 ${getThemeClasses(theme, 'backgroundSecondary')}`}>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getThemeClasses(theme, 'backgroundTertiary')}`}>
            <Search className={`w-4 h-4 ${getThemeClasses(theme, 'textSecondary')}`} />
            <input
              type="text"
              placeholder="Rechercher..."
              className={`bg-transparent border-none outline-none w-full ${getThemeClasses(theme, 'text')} placeholder:${getThemeClasses(theme, 'textSecondary')}`}
            />
          </div>
        </div>
      )}
    </nav>
  );
}
