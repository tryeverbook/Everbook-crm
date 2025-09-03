import React from 'react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { mockDashboardStats } from '../data/mockData';
import { Users, Calendar, Clock, DollarSign, Plus, TrendingUp, Heart } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2">
            Good morning, Sarah ✨
          </h1>
          <p className="text-lg text-gray-600">
            You have <span className="font-medium text-blush">{stats.upcomingDeadlines} upcoming deadlines</span> and <span className="font-medium text-blush">{stats.activeEvents} active events</span> this week.
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="h-5 w-5 mr-2" />
            New Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clients"
          value={stats.totalClients}
          change="+12%"
          changeType="increase"
          icon={Users}
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        <StatsCard
          title="Active Events"
          value={stats.activeEvents}
          change="+8%"
          changeType="increase"
          icon={Calendar}
          gradient="bg-gradient-to-br from-blush to-mauve"
        />
        <StatsCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlines}
          icon={Clock}
          gradient="bg-gradient-to-br from-orange-400 to-orange-600"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}k`}
          change="+15%"
          changeType="increase"
          icon={DollarSign}
          gradient="bg-gradient-to-br from-green-400 to-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activities={stats.recentActivities} />
        
        <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-semibold text-charcoal">Quick Actions</h3>
              <Heart className="h-5 w-5 text-blush" />
            </div>
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blush/10 to-mauve/10 border border-blush/20 rounded-2xl p-5 text-left hover:bg-gradient-to-r hover:from-blush/20 hover:to-mauve/20 hover:border-blush/30 transition-all duration-200 group">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blush to-mauve rounded-xl mr-4 group-hover:scale-105 transition-transform duration-200">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-serif font-medium text-charcoal text-lg">Add New Client</span>
                    <p className="text-sm text-gray-600 mt-1">Create a beautiful client profile</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-5 text-left hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300/50 transition-all duration-200 group">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mr-4 group-hover:scale-105 transition-transform duration-200">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-serif font-medium text-charcoal text-lg">Schedule Event</span>
                    <p className="text-sm text-gray-600 mt-1">Plan the perfect celebration</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl p-5 text-left hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:border-green-300/50 transition-all duration-200 group">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl mr-4 group-hover:scale-105 transition-transform duration-200">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-serif font-medium text-charcoal text-lg">View Analytics</span>
                    <p className="text-sm text-gray-600 mt-1">Track business performance</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
