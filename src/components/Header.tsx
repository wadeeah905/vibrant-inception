import React from 'react';
import { Search, Home, Users2, Briefcase, MessageSquare, Bell, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <Users2 className="h-8 w-8 text-blue-500" />
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-800 text-gray-200 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem icon={<Home />} label="Home" active />
            <NavItem icon={<Users2 />} label="Network" />
            <NavItem icon={<Briefcase />} label="Jobs" />
            <NavItem icon={<MessageSquare />} label="Messages" />
            <NavItem icon={<Bell />} label="Notifications" />
          </nav>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-800">
            <Menu className="h-6 w-6 text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 ${active ? 'text-blue-500' : 'text-gray-300'}`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}