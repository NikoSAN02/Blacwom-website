'use client';

import { useState } from 'react';

export default function FilterBar({ onFilter }) {
  const [filters, setFilters] = useState({
    brand: [],
    category: [],
    priceRange: '',
    skinType: [],
    concerns: []
  });

  const priceRanges = [
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹2000', value: '1000-2000' },
    { label: 'Above ₹2000', value: '2000+' }
  ];

  const categories = ['skin', 'hair', 'beauty', 'body', 'face'];
  
  const handleFilterChange = (type, value) => {
    let newFilters;
    if (type === 'priceRange') {
      newFilters = { ...filters, [type]: value };
    } else {
      newFilters = {
        ...filters,
        [type]: filters[type].includes(value)
          ? filters[type].filter(item => item !== value)
          : [...filters[type], value]
      };
    }
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="font-medium mb-2">Category</h4>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.category.includes(category)}
                  onChange={() => handleFilterChange('category', category)}
                  className="mr-2"
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Prices</option>
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add more filter sections as needed */}
      </div>
    </div>
  );
}