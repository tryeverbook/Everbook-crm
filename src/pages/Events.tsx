import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { mockEvents } from '../data/mockData';
import { Event } from '../types';
import { Plus, Calendar, Users, MapPin, DollarSign, Sparkles, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const API_URL = useMemo(() => ((import.meta as any)?.env?.VITE_API_URL as string) || 'http://localhost:4000', []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(`${API_URL}/api/state`);
        const bookings: any[] = resp.data?.bookings || [];
        const leads: any[] = resp.data?.leads || [];
        const mapped: Event[] = bookings.map((b) => {
          const lead = leads.find((l) => l.id === b.leadId);
          const name = lead?.name || b.leadName || 'Booked Event';
          return {
            id: b.id,
            clientId: b.leadId,
            clientName: name,
            name: `${name} Wedding`,
            type: 'wedding',
            date: new Date(`${b.date}T12:00:00`).toISOString(),
            venue: 'The Rowan House',
            guestCount: b.guestCount || 120,
            budget: 45000,
            status: 'confirmed',
            progress: 25,
            tasks: [],
            createdAt: b.createdAt || new Date().toISOString(),
          } as Event;
        });
        if (mapped.length) {
          // Prepend server bookings to the mock list for visibility
          setEvents((prev) => [...mapped, ...prev]);
        }
      } catch {}
    })();
  }, [API_URL]);

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-400 to-emerald-500';
    if (progress >= 50) return 'from-blue-400 to-blue-500';
    if (progress >= 25) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2 flex items-center">
            Magical Events <Sparkles className="h-8 w-8 text-gold ml-3" />
          </h1>
          <p className="text-lg text-gray-600">
            Orchestrate unforgettable celebrations and precious moments.
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {events.map((event, index) => (
          <div key={event.id} className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-card rounded-3xl border border-champagne/30 hover:shadow-elegant transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative p-6">
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-serif font-semibold text-charcoal mb-2 group-hover:text-blush transition-colors duration-200 pr-20">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600">with {event.clientName}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-2 bg-gradient-to-br from-blush/20 to-mauve/20 rounded-xl mr-3">
                    <Calendar className="h-4 w-4 text-blush" />
                  </div>
                  <div>
                    <span className="font-medium text-charcoal">{format(new Date(event.date), 'EEEE, MMMM d')}</span>
                    <div className="text-xs text-gray-500">{format(new Date(event.date), 'yyyy')}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mr-3">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-medium text-charcoal truncate">{event.venue}</span>
                    <div className="text-xs text-gray-500">Venue</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mr-3">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium text-charcoal">{event.guestCount}</span>
                      <div className="text-xs text-gray-500">Guests</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mr-3">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium text-charcoal">${(event.budget / 1000).toFixed(0)}k</span>
                      <div className="text-xs text-gray-500">Budget</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Progress</span>
                    <span className="font-serif font-semibold text-charcoal">{event.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${getProgressColor(event.progress)}`}
                      style={{ width: `${event.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-champagne/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.tasks.length} tasks</span>
                    </div>
                    <span className="text-green-600 font-medium">
                      {event.tasks.filter(t => t.status === 'completed').length} completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-champagne/30 to-champagne/50 px-6 py-4 border-t border-champagne/30">
              <div className="flex justify-between items-center">
                <button className="text-sm font-medium text-blush hover:text-mauve transition-colors duration-200">
                  View Details
                </button>
                <button className="text-sm font-medium text-gray-600 hover:text-charcoal transition-colors duration-200">
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
