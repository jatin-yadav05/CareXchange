"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';
import 'leaflet/dist/leaflet.css';

// Dynamically import map components with no SSR
const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Initialize Leaflet icon configuration
const initializeLeafletIcon = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    return {
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    };
  } catch (error) {
    console.error('Error initializing Leaflet icon:', error);
    return null;
  }
};

const LocationDescriptionStep = ({ formData, setFormData, onNext, onBack }) => {
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const mapRef = useRef(null);
  const [showLocationButton, setShowLocationButton] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const L = require('leaflet');
        setCustomIcon(new L.Icon(initializeLeafletIcon()));
      } catch (error) {
        console.error('Error setting up Leaflet:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setLocationPermission(result.state);
          result.onchange = () => {
            setLocationPermission(result.state);
          };
        })
        .catch(error => {
          console.error('Error querying location permission:', error);
          setLocationPermission('prompt');
        });
    }
  }, [isClient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCurrentLocation = () => {
    if (!isClient || !navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            setFormData(prev => ({
              ...prev,
              location: data.display_name,
              coordinates: { lat: latitude, lng: longitude }
            }));
            toast.dismiss();
            toast.success('Location updated successfully!');
          })
          .catch(() => {
            toast.dismiss();
            toast.error('Failed to get address. Please enter manually.');
          });
      },
      (error) => {
        toast.dismiss();
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Please allow location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('Failed to get location. Please enter manually');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const centerToCurrentLocation = () => {
    if (!isClient || !navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Finding your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
          setPosition([latitude, longitude]);
          toast.dismiss();
          toast.success('Map centered to your location!');
        }
      },
      (error) => {
        toast.dismiss();
        toast.error('Could not get your location. Please try again.');
      }
    );
  };

  const LocationControl = () => {
    return (
      <div className="leaflet-control leaflet-bar" style={{ 
        margin: '10px',
        position: 'absolute',
        right: '10px',
        top: '80px',
        zIndex: 1000
      }}>
        <button
          onClick={centerToCurrentLocation}
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none transition-colors duration-200"
          title="Center to my location"
        >
          <svg 
            className="w-6 h-6 text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>
    );
  };

  const isStepValid = () => {
    return formData.location;
  };

  const geocodeLocation = debounce(async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (!response.ok) throw new Error('Geocoding failed');
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        location: data.display_name,
        coordinates: { lat, lng }
      }));
    } catch (error) {
      toast.error('Failed to get address. Please try again later.');
    }
  }, 1000);

  if (!isClient) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading location component...</h3>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Additional Details</h3>

        {locationPermission === 'denied' && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Location Access Required</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Please enable location access in your browser settings to use the current location feature.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Pickup Location *
            </label>
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={locationPermission === 'denied'}
              className={`inline-flex items-center px-3 py-1 text-sm ${
                locationPermission === 'denied'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary hover:text-primary-600'
              } focus:outline-none`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use Current Location
            </button>
          </div>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter your location"
          />
          <p className="mt-2 text-sm text-gray-500">
            This will help recipients find medicines near them
          </p>
        </div>

        <div className="mb-6 relative h-[400px] rounded-lg overflow-hidden">
          {Map && (
            <Map
              center={position}
              zoom={13}
              ref={mapRef}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {customIcon && (
                <Marker
                  position={position}
                  icon={customIcon}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      setPosition([position.lat, position.lng]);
                      geocodeLocation(position.lat, position.lng);
                    },
                  }}
                />
              )}
              {showLocationButton && <LocationControl />}
            </Map>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Add any additional details about pickup location or timing"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!isStepValid()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationDescriptionStep; 