import React, { useState } from 'react';
import { mockEvents } from '../data/mockData';
import { Task } from '../types';
import { Plus, Calendar, User, Flag, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const Tasks: React.FC = () => {
  const allTasks = mockEvents.flatMap(event => 
    event.tasks.map(task => ({ ...task, eventName: event.name }))
  );
  const [tasks] = useState<(Task & { eventName: string })[]>(allTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => filter === 'all' || task.status === filter);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle2;
      case 'in-progress':
        return Clock;
      case 'pending':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getStatusGradient = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-br from-green-400 to-emerald-600';
      case 'in-progress':
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'pending':
        return 'bg-gradient-to-br from-orange-400 to-orange-600';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'venue':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'catering':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'decoration':
        return 'bg-gradient-to-r from-blush/20 to-mauve/20 text-charcoal border-blush/30';
      case 'photography':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'music':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2 flex items-center">
            Task Symphony <Sparkles className="h-8 w-8 text-gold ml-3" />
          </h1>
          <p className="text-lg text-gray-600">
            Orchestrate every detail to perfection with grace and elegance.
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
        <div className="flex flex-wrap gap-3 mb-8">
          {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                filter === status
                  ? 'bg-gradient-to-r from-blush to-mauve text-white shadow-soft'
                  : 'text-gray-600 hover:text-charcoal bg-champagne/30 hover:bg-champagne/50 border border-champagne/50'
              }`}
            >
              {status === 'all' ? 'All Tasks' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <span className="ml-2 text-xs opacity-75">
                ({status === 'all' ? tasks.length : tasks.filter(t => t.status === status).length})
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task, index) => {
            const StatusIcon = getStatusIcon(task.status);
            const statusGradient = getStatusGradient(task.status);
            
            return (
              <div key={task.id} className="bg-white shadow-soft rounded-2xl border border-champagne/20 hover:shadow-elegant transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl shadow-soft ${statusGradient} group-hover:scale-105 transition-transform duration-200`}>
                      <StatusIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-lg font-serif font-semibold text-charcoal group-hover:text-blush transition-colors duration-200">
                          {task.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(task.category)}`}>
                          {task.category === 'decoration' ? '🎨' : '📋'} {task.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{task.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{task.assignedTo}</span>
                        </div>
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-gold" />
                          <span className="font-medium">{task.eventName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button className="text-sm font-medium text-blush hover:text-mauve transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-blush/10">
                        Edit
                      </button>
                      {task.status !== 'completed' && (
                        <button className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200 px-4 py-2 rounded-xl hover:bg-green-50">
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
