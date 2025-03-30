
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeClasses } from '../config/theme';
import { X } from 'lucide-react';

export default function Layout() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen ${getThemeClasses(theme, 'background')} ${getThemeClasses(theme, 'text')} transition-colors duration-200`}>
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex relative">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30 lg:z-auto
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          ${getThemeClasses(theme, 'backgroundSecondary')} 
          w-64 min-h-[calc(100vh-4rem)] overflow-y-auto
        `}>
          <div className="lg:hidden absolute right-0 p-2">
            <button 
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-lg ${getThemeClasses(theme, 'hover')}`}
            >
              <X className={`w-5 h-5 ${getThemeClasses(theme, 'text')}`} />
            </button>
          </div>
          <Sidebar />
        </div>
        
        <main className="flex-1 p-4 md:p-6 w-full lg:w-auto min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
