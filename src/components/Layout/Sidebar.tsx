import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  Building, 
  DollarSign, 
  Settings,
  Heart
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Vendors', href: '/vendors', icon: Building },
  { name: 'Finances', href: '/finances', icon: DollarSign },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-white shadow-elegant border-r border-champagne/30">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-10">
            <div className="p-2 bg-gradient-to-br from-blush to-mauve rounded-2xl shadow-soft">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-serif font-semibold text-charcoal">EventCRM</span>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blush/20 to-mauve/20 text-charcoal border border-blush/30 shadow-card'
                      : 'text-gray-600 hover:bg-blush/10 hover:text-charcoal'
                  }`
                }
              >
                <item.icon className={`mr-4 h-5 w-5 flex-shrink-0 transition-colors ${
                  window.location.pathname === item.href ? 'text-blush' : 'text-gray-400 group-hover:text-blush'
                }`} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="flex-shrink-0 border-t border-champagne/50 p-4">
          <div className="flex items-center px-4 py-3 text-sm text-gray-500">
            <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
            All systems operational
          </div>
        </div>
      </div>
    </div>
  );
};
