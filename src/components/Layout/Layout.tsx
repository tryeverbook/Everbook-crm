import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  return (
    <div className="h-screen bg-pearl flex overflow-hidden">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 relative overflow-y-auto focus:outline-none md:ml-72">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
              <div className="animate-fade-in">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
