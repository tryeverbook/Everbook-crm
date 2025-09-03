import React from 'react';
import { Bell, Search, User, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-champagne/30 sticky top-0 z-10">
      <div className="px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center md:hidden">
              <h1 className="text-xl font-serif font-semibold text-charcoal">EventCRM</h1>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end lg:max-w-md">
            <div className="w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-12 pr-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blush/30 focus:border-blush/50 transition-all duration-200 text-sm"
                  placeholder="Search clients, events, vendors..."
                  type="search"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-2xl text-gray-400 hover:text-blush hover:bg-blush/10 focus:outline-none focus:ring-2 focus:ring-blush/30 transition-all duration-200">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blush"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-champagne/50">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blush to-mauve flex items-center justify-center shadow-card">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-charcoal font-serif">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Wedding Planner</p>
              </div>
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
