import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Events } from './pages/Events';
import { Tasks } from './pages/Tasks';
import { Vendors } from './pages/Vendors';
import { Finances } from './pages/Finances';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="events" element={<Events />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="finances" element={<Finances />} />
          <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings page coming soon...</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
