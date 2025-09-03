import React from 'react';
import { Activity } from '../../types';
import { format } from 'date-fns';
import { Users, Calendar, CheckSquare, Building, Sparkles } from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'client_added':
      return Users;
    case 'event_created':
      return Calendar;
    case 'task_completed':
      return CheckSquare;
    case 'vendor_contacted':
      return Building;
    default:
      return CheckSquare;
  }
};

const getActivityGradient = (type: Activity['type']) => {
  switch (type) {
    case 'client_added':
      return 'bg-gradient-to-br from-blue-400 to-blue-600';
    case 'event_created':
      return 'bg-gradient-to-br from-blush to-mauve';
    case 'task_completed':
      return 'bg-gradient-to-br from-green-400 to-emerald-600';
    case 'vendor_contacted':
      return 'bg-gradient-to-br from-purple-400 to-purple-600';
    default:
      return 'bg-gradient-to-br from-gray-400 to-gray-600';
  }
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-semibold text-charcoal">Recent Activity</h3>
          <Sparkles className="h-5 w-5 text-gold" />
        </div>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const gradientClass = getActivityGradient(activity.type);
              
              return (
                <li key={activity.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative pb-8">
                    {index !== activities.length - 1 && (
                      <span
                        className="absolute top-6 left-6 -ml-px h-full w-0.5 bg-gradient-to-b from-champagne to-transparent"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-4">
                      <div>
                        <span className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-soft ${gradientClass}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-2">
                        <div className="flex justify-between space-x-4">
                          <div>
                            <p className="text-sm font-medium text-charcoal">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Related to {activity.relatedEntity}</p>
                          </div>
                          <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                            {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
