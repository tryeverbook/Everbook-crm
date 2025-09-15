import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Plus, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Tour {
  id: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  date: string;
  venue: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: string;
}

export const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([
    {
      id: '1',
      leadName: 'Sarah Johnson',
      leadEmail: 'sarah@example.com',
      leadPhone: '(555) 123-4567',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
      venue: 'Main Hall',
      status: 'scheduled',
      notes: 'Interested in garden ceremony',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      leadName: 'Michael Chen',
      leadEmail: 'michael@example.com',
      leadPhone: '(555) 234-5678',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // Day after tomorrow
      venue: 'Garden Pavilion',
      status: 'scheduled',
      notes: 'Corporate event, 200 guests',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      leadName: 'Emily Rodriguez',
      leadEmail: 'emily@example.com',
      leadPhone: '(555) 345-6789',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
      venue: 'Rooftop Terrace',
      status: 'completed',
      notes: 'Loved the space, booking soon',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      leadName: 'David Thompson',
      leadEmail: 'david@example.com',
      leadPhone: '(555) 456-7890',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      venue: 'Main Hall',
      status: 'no-show',
      notes: 'Did not show up for scheduled tour',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Tour['status']>('all');

  const filteredTours = tours.filter(tour => {
    const matchesSearch = 
      tour.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.leadEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const addTour = () => {
    const id = Math.random().toString(36).slice(2);
    const newTour: Tour = {
      id,
      leadName: 'New Lead',
      leadEmail: `lead-${id}@example.com`,
      leadPhone: '(555) 000-0000',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
      venue: 'Main Hall',
      status: 'scheduled',
      notes: '',
      createdAt: new Date().toISOString(),
    };
    setTours([newTour, ...tours]);
  };

  const updateTourStatus = (id: string, status: Tour['status']) => {
    setTours(tours.map(tour => 
      tour.id === id ? { ...tour, status } : tour
    ));
  };

  const getStatusIcon = (status: Tour['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'no-show':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: Tour['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'no-show':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2">Tours</h1>
          <p className="text-lg text-gray-600">Schedule and manage venue tours for potential clients.</p>
        </div>
        <div className="mt-6 lg:mt-0 flex gap-3">
          <button onClick={addTour} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transition-all">
            <Plus className="h-5 w-5 mr-2" /> Schedule Tour
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Tours</div>
          <div className="text-3xl font-serif font-semibold text-charcoal">{tours.length}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
          <div className="text-sm text-gray-600 mb-1">Scheduled</div>
          <div className="text-3xl font-serif font-semibold text-blue-600">
            {tours.filter(t => t.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-3xl font-serif font-semibold text-green-600">
            {tours.filter(t => t.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
          <div className="text-sm text-gray-600 mb-1">No Shows</div>
          <div className="text-3xl font-serif font-semibold text-orange-600">
            {tours.filter(t => t.status === 'no-show').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush/50 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="block px-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush/50 transition-all"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </div>

        {/* Tours List */}
        <div className="space-y-4">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="bg-white shadow-soft rounded-2xl border border-champagne/20 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-serif font-semibold text-charcoal">{tour.leadName}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tour.status)}`}>
                      {getStatusIcon(tour.status)}
                      <span className="ml-1 capitalize">{tour.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {format(new Date(tour.date), 'EEEE, MMMM d, yyyy • h:mm a')}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {tour.venue}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {tour.leadEmail}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {tour.leadPhone}
                    </div>
                  </div>

                  {tour.notes && (
                    <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
                      <strong>Notes:</strong> {tour.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {tour.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => updateTourStatus(tour.id, 'completed')}
                        className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl hover:bg-green-100 transition-colors text-sm"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => updateTourStatus(tour.id, 'no-show')}
                        className="px-3 py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors text-sm"
                      >
                        No Show
                      </button>
                      <button
                        onClick={() => updateTourStatus(tour.id, 'cancelled')}
                        className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {tour.status !== 'scheduled' && (
                    <button
                      onClick={() => updateTourStatus(tour.id, 'scheduled')}
                      className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-sm"
                    >
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
