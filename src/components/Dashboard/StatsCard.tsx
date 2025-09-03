import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  gradient: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  gradient,
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm overflow-hidden shadow-card rounded-3xl border border-champagne/30 hover:shadow-elegant transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`inline-flex p-3 rounded-2xl ${gradient} shadow-soft group-hover:scale-105 transition-transform duration-200`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="mt-4">
              <dt className="text-sm font-medium text-gray-600 mb-1">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-3xl font-serif font-semibold text-charcoal">{value}</div>
                {change && (
                  <div className={`ml-3 flex items-center text-sm font-medium ${
                    changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      changeType === 'increase' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {change}
                    </span>
                  </div>
                )}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
