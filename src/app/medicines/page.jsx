'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MedicineCard from '@/components/MedicineCard';
import { toast } from 'react-hot-toast';

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    condition: '',
    availability: true
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/medicines', {
          headers: {
            'Accept': 'application/json'
          }
        });

        let data;
        try {
          const textResponse = await response.text();
          data = JSON.parse(textResponse);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error(`Invalid JSON response: ${parseError.message}`);
        }

        if (!response.ok) {
          throw new Error(data.error || `Server error: ${response.status}`);
        }

        if (!Array.isArray(data)) {
          console.error('Invalid data format:', data);
          throw new Error('Server returned invalid data format');
        }

        console.log('Fetched medicines:', data); // Debug log
        setMedicines(data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        toast.error(`Failed to load medicines: ${error.message}`);
        setMedicines([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Force grid view on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setView('grid');
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Filter medicines based on search query and filters
  const filteredMedicines = medicines.filter(medicine => {
    if (!medicine || typeof medicine !== 'object') return false;
    
    try {
      const matchesSearch = searchQuery === '' || 
        (medicine.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (medicine.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (medicine.donor?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      const matchesCategory = filters.category === '' || 
        (medicine.category?.toLowerCase() || '') === filters.category.toLowerCase();

      const matchesCondition = filters.condition === '' || 
        medicine.condition === filters.condition;

      const matchesAvailability = !filters.availability || medicine.status === 'available';

      const matchesPriceRange = filters.priceRange === '' || (() => {
        if (filters.priceRange === 'free') return medicine.isFree;
        const [min, max] = filters.priceRange.split('-').map(Number);
        const price = medicine.originalPrice || 0;
        if (!max) return price >= min;
        return price >= min && price <= max;
      })();

      return matchesSearch && matchesCategory && matchesCondition && 
             matchesAvailability && matchesPriceRange;
    } catch (error) {
      console.error('Error filtering medicine:', error, medicine);
      return false;
    }
  });

  // Sort filtered medicines
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return 0;
    
    try {
      switch (sortBy) {
        case 'price-low':
          return (a.originalPrice || 0) - (b.originalPrice || 0);
        case 'price-high':
          return (b.originalPrice || 0) - (a.originalPrice || 0);
        case 'trust-score':
          const aScore = Array.isArray(a.ratings) && a.ratings.length > 0 
            ? a.ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0) / a.ratings.length 
            : 0;
          const bScore = Array.isArray(b.ratings) && b.ratings.length > 0 
            ? b.ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0) / b.ratings.length 
            : 0;
          return bScore - aScore;
        default: // 'latest'
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    } catch (error) {
      console.error('Error sorting medicines:', error, { a, b });
      return 0;
    }
  });

  const categories = [
    'All Categories',
    'Pain Relief',
    'Antibiotics',
    'Cardiovascular',
    'Diabetes',
    'Respiratory',
    'Gastrointestinal'
  ];

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: '₹0 - ₹500', value: '0-500' },
    { label: '₹500 - ₹2000', value: '500-2000' },
    { label: '₹2000+', value: '2000+' },
    { label: 'Free Donations', value: 'free' }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Medicines</h1>
            <p className="mt-2 text-sm text-gray-600">Browse through our collection of available medicines</p>
          </div>
          
          {/* View Toggle and Sort */}
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="latest">Latest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="trust-score">Trust Score</option>
            </select>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, categories, locations, or donors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
            </select>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="availability"
                checked={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.checked)}
                className="h-5 w-5 text-primary focus:ring-primary rounded"
              />
              <label htmlFor="availability" className="text-sm text-gray-700">
                Available Only
              </label>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : sortedMedicines.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No medicines found</h3>
            <p className="mt-2 text-sm text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className={view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'flex flex-col gap-4'
          }>
            {sortedMedicines.map((medicine) => (
              <MedicineCard 
                key={medicine._id} 
                medicine={medicine} 
                view={view}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MedicinesPage; 