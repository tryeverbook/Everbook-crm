import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Sparkles, PiggyBank } from 'lucide-react';

export const Finances: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2 flex items-center">
            Financial Elegance <Sparkles className="h-8 w-8 text-gold ml-3" />
          </h1>
          <p className="text-lg text-gray-600">
            Track your prosperity and celebrate financial milestones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-card rounded-3xl border border-champagne/30 hover:shadow-elegant transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-soft group-hover:scale-105 transition-transform duration-200">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-600 mb-1">Total Revenue</dt>
                  <dd className="text-3xl font-serif font-semibold text-charcoal">$127,500</dd>
                  <div className="mt-2">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      +18% this month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-card rounded-3xl border border-champagne/30 hover:shadow-elegant transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-soft group-hover:scale-105 transition-transform duration-200">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-600 mb-1">Monthly Growth</dt>
                  <dd className="text-3xl font-serif font-semibold text-charcoal">+15%</dd>
                  <div className="mt-2">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Trending up
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-card rounded-3xl border border-champagne/30 hover:shadow-elegant transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-soft group-hover:scale-105 transition-transform duration-200">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-600 mb-1">Expenses</dt>
                  <dd className="text-3xl font-serif font-semibold text-charcoal">$23,400</dd>
                  <div className="mt-2">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      -5% vs last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-card rounded-3xl border border-champagne/30 hover:shadow-elegant transition-all duration-300 group">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blush to-mauve shadow-soft group-hover:scale-105 transition-transform duration-200">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-600 mb-1">Pending Payments</dt>
                  <dd className="text-3xl font-serif font-semibold text-charcoal">$12,800</dd>
                  <div className="mt-2">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      8 invoices
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30">
        <div className="px-8 py-8">
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gradient-to-br from-champagne/50 to-champagne/70 rounded-3xl mb-6">
              <PiggyBank className="h-12 w-12 text-blush" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-charcoal mb-3">Financial Dashboard Coming Soon</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Connect your accounting system to unlock beautiful financial insights and reports.
            </p>
            <div className="space-y-4">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <Sparkles className="h-5 w-5 mr-2" />
                Connect Accounting
              </button>
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <span>• QuickBooks</span>
                <span>• Xero</span>
                <span>• FreshBooks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
