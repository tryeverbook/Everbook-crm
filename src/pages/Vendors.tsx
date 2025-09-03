import React, { useState } from 'react';
import { mockVendors } from '../data/mockData';
import { Vendor } from '../types';
import { Plus, Search, Filter, Star, Phone, Mail, Globe, Building, Heart } from 'lucide-react';

export const Vendors: React.FC = () => {
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: Vendor['category']) => {
    switch (category) {
      case 'venue':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'catering':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'photography':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'videography':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'music':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'flowers':
        return 'bg-gradient-to-r from-blush/20 to-mauve/20 text-charcoal border-blush/30';
      case 'decoration':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriceRangeColor = (range: Vendor['priceRange']) => {
    switch (range) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const categories = ['all', ...Array.from(new Set(vendors.map(v => v.category)))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-serif font-semibold text-charcoal mb-2 flex items-center">
            Trusted Partners <Building className="h-8 w-8 text-blush ml-3" />
          </h1>
          <p className="text-lg text-gray-600">
            Your curated network of exceptional service providers.
          </p>
        </div>
        <div className="mt-6 lg:mt-0">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blush to-mauve text-white font-medium rounded-2xl shadow-elegant hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="h-5 w-5 mr-2" />
            Add Vendor
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm shadow-card rounded-3xl border border-champagne/30 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Discover amazing vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush/50 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block px-4 py-3 bg-champagne/30 border border-champagne/50 rounded-2xl text-charcoal focus:outline-none focus:ring-2 focus:ring-blush/30 focus:border-blush/50 transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredVendors.map((vendor, index) => (
            <div key={vendor.id} className="bg-white shadow-soft rounded-2xl border border-champagne/20 hover:shadow-elegant transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-2 group-hover:text-blush transition-colors duration-200">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vendor.rating)
                                ? 'text-gold fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-charcoal">
                        {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(vendor.category)}`}>
                    {vendor.category === 'flowers' ? '🌸' : '🏢'} {vendor.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {vendor.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    {vendor.phone}
                  </div>
                  {vendor.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-3 text-gray-400" />
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blush hover:text-mauve truncate transition-colors duration-200">
                        {vendor.website.replace('https://', '').replace('www.', '')}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-champagne/30">
                  <div className="flex flex-wrap gap-1">
                    {vendor.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-champagne/50 text-charcoal">
                        {tag}
                      </span>
                    ))}
                    {vendor.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{vendor.tags.length - 2}</span>
                    )}
                  </div>
                  <span className={`text-sm font-serif font-semibold ${getPriceRangeColor(vendor.priceRange)}`}>
                    {vendor.priceRange.charAt(0).toUpperCase() + vendor.priceRange.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-champagne/30 to-champagne/50 px-6 py-4 border-t border-champagne/30">
                <div className="flex justify-between items-center">
                  <button className="inline-flex items-center text-sm font-medium text-blush hover:text-mauve transition-colors duration-200">
                    <Heart className="h-4 w-4 mr-1" />
                    Contact
                  </button>
                  <button className="text-sm font-medium text-gray-600 hover:text-charcoal transition-colors duration-200">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
