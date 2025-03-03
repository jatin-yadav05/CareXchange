'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BeakerIcon, 
  CalendarIcon, 
  TagIcon,
  BuildingOfficeIcon,
  StarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function MedicineCard({ medicine, view = 'grid' }) {
  const isListView = view === 'list';
  const [imageError, setImageError] = useState(false);

  // Format date to readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      donated: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate trust score
  const trustScore = medicine.ratings?.length > 0
    ? (medicine.ratings.reduce((acc, curr) => acc + curr.rating, 0) / medicine.ratings.length).toFixed(1)
    : 'N/A';

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
      isListView ? 'flex' : 'block'
    }`}>
      <div className={`relative ${isListView ? 'w-64 flex-shrink-0' : 'h-48'}`}>
        {medicine.images?.[0] && !imageError ? (
          <Image
            src={medicine.images[0]}
            alt={medicine.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <BeakerIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {medicine.verificationStatus === 'verified' && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <CheckBadgeIcon className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
            <p className="text-sm text-gray-600">{medicine.category}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(medicine.status)}`}>
            {medicine.status}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Expires: {formatDate(medicine.expiryDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            <span>{medicine.manufacturer}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <TagIcon className="h-4 w-4 mr-2" />
            <span>{medicine.dosageForm} • {medicine.strength}</span>
          </div>

          {medicine.prescriptionRequired && (
            <div className="flex items-center text-sm text-amber-600">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              <span>Prescription Required</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{trustScore}</span>
            </div>
            
            <div className="flex items-center">
              {medicine.isFree ? (
                <span className="text-green-600 text-sm font-medium">Free</span>
              ) : (
                <div className="flex items-center text-gray-700">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">₹{medicine.originalPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Link
          href={`/medicine/${medicine._id}`}
          className="mt-4 block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 