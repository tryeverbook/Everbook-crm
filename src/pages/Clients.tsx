import React, { useState } from 'react';
import { mockClients } from '../data/mockData';
import { Client } from '../types';
import { Plus, Search, Filter, Phone, Mail, Calendar, Heart, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export const Clients: React.FC = () => {
  const [clients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'lead':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'consultation':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'booked':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'planning':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEventTypeColor = (type: Client['eventType']) => {
    switch (type) {
      case 'wedding':
        return 'bg-gradient-to-r from-blush/20 to-mauve/20 text-charcoal border-blush/30';
      case 'corporate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'birthday':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'anniversary':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2 flex items-center">
            Cherished Clients <Heart className="h-8 w-8 text-blush ml-3" />
          </h1>
          <p className="text-lg text-gray-600">
            Nurture relationships and create magical moments together.
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for your perfect clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush/50 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block px-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush/50 transition-all duration-200"
            >
              <option value="all">All Journeys</option>
              <option value="lead">New Leads</option>
              <option value="consultation">Consultation</option>
              <option value="booked">Booked</option>
              <option value="planning">Planning</option>
              <option value="completed">Celebrated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredClients.map((client, index) => (
            <div key={client.id} className="bg-white shadow-soft rounded-2xl border border-champagne/20 hover:shadow-elegant transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blush to-mauve flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
                        <span className="text-lg font-serif font-semibold text-white">
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-serif font-semibold text-charcoal group-hover:text-blush transition-colors duration-200">
                          {client.name}
                        </h3>
                        {client.partnerName && (
                          <>
                            <Heart className="h-4 w-4 text-blush" />
                            <span className="text-lg font-serif text-charcoal">{client.partnerName}</span>
                          </>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {client.phone}
                        </div>
                        {client.eventDate && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {format(new Date(client.eventDate), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end lg:space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(client.eventType)}`}>
                        {client.eventType === 'wedding' ? '💒' : '🎉'} {client.eventType}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-serif font-semibold text-charcoal">
                        ${(client.budget / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-gray-500">Budget</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
