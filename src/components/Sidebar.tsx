
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  MessageSquare, 
  LineChart, 
  Settings,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses } from '../config/theme';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/rounds', icon: MapPin, label: 'Rondes' },
  { to: '/users', icon: Users, label: 'Utilisateurs' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/administration', icon: LineChart, label: 'Administration' },
  { to: '/mobile', icon: Smartphone, label: 'Application Mobile' },
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

export default function Sidebar() {
  const { theme } = useTheme();

  return (
    <aside className={`w-64 ${getThemeClasses(theme, 'backgroundSecondary')} min-h-[calc(100vh-4rem)] p-4 transition-colors duration-200`}>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-900/20 text-primary-400' 
                  : `${getThemeClasses(theme, 'textSecondary')} ${getThemeClasses(theme, 'hover')}`
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
