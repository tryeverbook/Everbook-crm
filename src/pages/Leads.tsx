import React, { useMemo, useState } from 'react';
import { mockClients } from '../data/mockData';
import { Client } from '../types';
import { TrendingUp, UserPlus, UserMinus, Search, Filter, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Client[]>(
    mockClients.map(c => ({ ...c, status: c.status === 'completed' ? 'lead' : c.status }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Client['status']>('all');

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const conversion = useMemo(() => {
    const total = leads.length || 1;
    const toConsult = leads.filter(l => ['consultation', 'booked', 'planning', 'completed'].includes(l.status)).length;
    const toBooked = leads.filter(l => ['booked', 'planning', 'completed'].includes(l.status)).length;
    return {
      leadToConsultRate: Math.round((toConsult / total) * 100),
      consultToBookedRate: Math.round((toBooked / Math.max(toConsult, 1)) * 100),
      totalLeads: leads.length,
    };
  }, [leads]);

  const addLead = () => {
    const id = Math.random().toString(36).slice(2);
    const newLead: Client = {
      id,
      name: 'New Lead',
      email: `lead-${id}@example.com`,
      phone: '—',
      eventType: 'wedding',
      budget: 0,
      status: 'lead',
      notes: '',
      createdAt: new Date().toISOString(),
    };
    setLeads([newLead, ...leads]);
  };

  const removeLead = (id: string) => setLeads(leads.filter(l => l.id !== id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2">Leads</h1>
          <p className="text-lg text-gray-600">Analytics and all inbound inquiries.</p>
        </div>
        <div className="mt-6 lg:mt-0 flex gap-3">
          <button onClick={addLead} className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transition-all">
            <UserPlus className="h-5 w-5 mr-2" /> Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Leads</div>
          <div className="text-3xl font-serif font-semibold text-charcoal">{conversion.totalLeads}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Lead → Consult</div>
              <div className="text-3xl font-serif font-semibold text-charcoal">{conversion.leadToConsultRate}%</div>
            </div>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Consult → Booked</div>
              <div className="text-3xl font-serif font-semibold text-charcoal">{conversion.consultToBookedRate}%</div>
            </div>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
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
              <option value="all">All</option>
              <option value="lead">Lead</option>
              <option value="consultation">Consultation</option>
              <option value="booked">Booked</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((l) => (
            <div key={l.id} className="bg-white shadow-soft rounded-2xl border border-champagne/20 p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-serif font-semibold text-charcoal truncate">{l.name}</h3>
                  <span className="text-xs text-gray-500">{l.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                  <div className="flex items-center"><Mail className="h-4 w-4 mr-2 text-gray-400" />{l.email}</div>
                  <div className="flex items-center"><Phone className="h-4 w-4 mr-2 text-gray-400" />{l.phone}</div>
                  {l.createdAt && (
                    <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-gray-400" />{format(new Date(l.createdAt), 'MMM d, yyyy')}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => removeLead(l.id)} className="inline-flex items-center px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors">
                  <UserMinus className="h-4 w-4 mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



