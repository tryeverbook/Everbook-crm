import React from 'react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { mockDashboardStats, mockEvents } from '../data/mockData';
import { Users, Calendar, Clock, DollarSign, Plus, TrendingUp, Heart, BadgeDollarSign } from 'lucide-react';
import { KeyActions, KeyActionItem } from '../components/Dashboard/KeyActions';
import { UpcomingList } from '../components/Dashboard/UpcomingList';
import { Event } from '../types';

export const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;
  const events: Event[] = mockEvents;

  const pipelineAmount = events
    .filter(e => ['planning', 'confirmed', 'in-progress'].includes(e.status))
    .reduce((sum, e) => sum + e.budget, 0);

  const confirmedAmount = events
    .filter(e => ['confirmed', 'in-progress', 'completed'].includes(e.status))
    .reduce((sum, e) => sum + e.budget, 0);

  const keyActions: KeyActionItem[] = [
    {
      id: '1',
      title: 'Reply to lead: Emma R.',
      description: 'AI drafted a reply asking for guest count and budget. Review and send.',
      category: 'lead_response',
      dueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Approve tour follow-up template',
      description: 'New follow-up template for no-shows. Requires approval.',
      category: 'template',
    },
    {
      id: '3',
      title: 'Review yesterday’s tours',
      description: 'Add notes and mark outcomes for 2 completed tours.',
      category: 'tour_review',
    },
  ];

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
          title="Pipeline ($)"
          value={`$${(pipelineAmount / 1000).toFixed(0)}k`}
          change="+12%"
          changeType="increase"
          icon={BadgeDollarSign}
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        <StatsCard
          title="Confirmed ($)"
          value={`$${(confirmedAmount / 1000).toFixed(0)}k`}
          change="+8%"
          changeType="increase"
          icon={Calendar}
          gradient="bg-gradient-to-br from-blush to-mauve"
        />
        <StatsCard
          title="Active Events"
          value={stats.activeEvents}
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
        <KeyActions actions={keyActions} />
        <UpcomingList events={events} />
      </div>

      <RecentActivity activities={stats.recentActivities} />
    </div>
  );
};
