"use client";

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import Image from 'next/image';

const MedicinePage = ({ params }) => {
  const { user } = useAuth();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);
  const medicineId = use(params).id;

  useEffect(() => {
    if (medicineId) {
      fetchMedicine();
    }
  }, [medicineId]);

  const fetchMedicine = async () => {
    try {
      const res = await fetch(`/api/medicines/${medicineId}`);
      if (!res.ok) throw new Error('Failed to fetch medicine');
      const data = await res.json();
      setMedicine(data);
      
      // Set user's rating if they've rated before
      if (user && data.ratings) {
        const userRating = data.ratings.find(r => r.userId === user._id);
        if (userRating) {
          setUserRating(userRating.value);
        }
      }
    } catch (error) {
      toast.error('Error fetching medicine details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleRating = async (rating) => {
    try {
      if (!user) {
        toast.error('Please login to rate this medicine');
        return;
      }

      const res = await fetch(`/api/medicines/${medicineId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (!res.ok) throw new Error('Failed to submit rating');
      
      const data = await res.json();
      setUserRating(rating);
      setMedicine(prev => ({
        ...prev,
        averageRating: data.averageRating
      }));
      
      toast.success('Rating submitted successfully');
    } catch (error) {
      toast.error('Error submitting rating');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Medicine Not Found</h3>
          <p className="mt-2 text-gray-600">The medicine you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-primary to-primary-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {medicine.images?.[0] ? (
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64">
                  <Image
                    src={medicine.images[0]}
                    alt={medicine.name}
                    fill
                    className="object-contain rounded-lg shadow-xl"
                    onError={(e) => {
                      e.target.src = '/images/medicine-placeholder.png';
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gray-100 rounded-lg shadow-xl flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{medicine.name}</h1>
                <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">{medicine.category}</p>
              </div>
              <div className="flex items-center gap-2 bg-primary-50 px-3 sm:px-4 py-2 rounded-full self-start sm:self-center">
                <StarSolid className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-sm sm:text-base font-semibold text-primary">
                  Trust Score: {medicine.trustScore || 0}/5
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Description</h3>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">{medicine.description}</p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Composition</h3>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">{medicine.composition}</p>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Usage Instructions</h3>
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">{medicine.usage}</p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Additional Information</h3>
                  <dl className="mt-2 space-y-2 sm:space-y-3">
                    {[
                      { label: 'Manufacturer', value: medicine.manufacturer },
                      { label: 'Expiry Date', value: new Date(medicine.expiryDate).toLocaleDateString() },
                      { label: 'Batch Number', value: medicine.batchNumber },
                      { label: 'Storage Instructions', value: medicine.storage }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-sm sm:text-base text-gray-500">{item.label}</dt>
                        <dd className="text-sm sm:text-base font-medium text-gray-900">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Rating Section */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Rate this Medicine</h3>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRating(rating)}
                        onMouseEnter={() => setHoverRating(rating)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        {rating <= (hoverRating || userRating) ? (
                          <StarSolid className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                        ) : (
                          <StarOutline className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  {!user && (
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      Please login to rate this medicine
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Safety Information */}
            <div className="mt-6 sm:mt-8 bg-red-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold text-red-700">Safety Information</h3>
              <ul className="mt-2 space-y-2 text-sm sm:text-base text-red-600">
                {[
                  'Store in a cool, dry place away from direct sunlight',
                  'Keep out of reach of children',
                  'Do not use after expiry date',
                  'Consult a healthcare professional before use'
                ].map((info, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-600 rounded-full"></span>
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinePage; 