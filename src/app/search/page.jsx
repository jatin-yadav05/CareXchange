'use client';
import { useState } from 'react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    location: '',
    availability: true
  });
  
  // Dummy medicine data for demonstration
  const medicines = [
    { id: 1, name: 'Paracetamol', category: 'Pain Relief', price: 10, location: 'New York', available: true },
    { id: 2, name: 'Amoxicillin', category: 'Antibiotics', price: 25, location: 'Los Angeles', available: true },
    // Add more dummy data as needed
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchQuery, filters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Medicines</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for medicines..."
              className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="pain-relief">Pain Relief</option>
            <option value="antibiotics">Antibiotics</option>
            <option value="cardiovascular">Cardiovascular</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Price Range</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="500-2000">₹500 - ₹2000</option>
            <option value="2000+">₹2000+</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Locations</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.checked})}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Available Only</span>
          </label>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{medicine.name}</h3>
              <p className="text-gray-600 mb-2">Category: {medicine.category}</p>
              <p className="text-gray-600 mb-2">Price: ₹{medicine.price}</p>
              <p className="text-gray-600 mb-2">Location: {medicine.location}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                medicine.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {medicine.available ? 'Available' : 'Not Available'}
              </span>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Request Medicine
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 