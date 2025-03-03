"use client";

import Navbar from '@/components/Navbar';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { debounce } from 'lodash';

// Step components will be defined here
const ImageUploadStep = ({ formData, setFormData, preview, setPreview, onNext }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Some files were rejected. Please check file type and size.');
    }
    setFormData(prev => ({
      ...prev,
      medicineImages: [...prev.medicineImages, ...acceptedFiles]
    }));

    // Create preview URLs
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreview(prev => [...prev, ...newPreviews]);

    // Simulate OCR processing
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Processing image with OCR...',
        success: 'Image processed successfully!',
        error: 'Failed to process image',
      }
    );

    // Auto-fill form after delay (simulating OCR)
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        medicineName: 'Detected Medicine Name',
        category: 'pain-relief',
        expiryDate: '2024-12-31',
      }));
    }, 2000);
  }, [setFormData, setPreview, onNext]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true
  });

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      medicineImages: prev.medicineImages.filter((_, i) => i !== index)
    }));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      preview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [preview]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Medicine Images</h3>
        
        {/* Image Upload Tips */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Tips for Good Photos:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure good lighting</li>
            <li>• Focus on the medicine label</li>
            <li>• Avoid glare on the package</li>
            <li>• Include expiry date clearly</li>
          </ul>
        </div>

        {/* Dropzone */}
        <div 
          {...getRootProps()} 
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
          } border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors`}
        >
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col items-center text-sm text-gray-600">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-primary">Drop the files here ...</p>
              ) : (
                <>
                  <p className="font-medium text-primary hover:text-primary-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Image Preview */}
        {preview.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {preview.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg ring-1 ring-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            disabled={preview.length === 0}
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

const MedicineDetailsStep = ({ formData, setFormData, onNext, onBack }) => {
  const categories = [
    'Pain Relief',
    'Antibiotics',
    'Cardiovascular',
    'Diabetes',
    'Respiratory',
    'Gastrointestinal',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isStepValid = () => {
    return formData.medicineName && formData.category && formData.quantity && formData.expiryDate;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medicine Details</h3>
        
        {/* Medicine Name */}
        <div className="mb-4">
          <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name *
          </label>
          <input
            type="text"
            id="medicineName"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter medicine name"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity and Expiry Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Available *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
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

const PricingConditionStep = ({ formData, setFormData, onNext, onBack }) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isStepValid = () => {
    return formData.condition && (formData.isDonation || formData.price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Condition</h3>

        {/* Condition */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicine Condition *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['new', 'like-new', 'good'].map((condition) => (
              <div
                key={condition}
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  formData.condition === condition
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => handleInputChange({ target: { name: 'condition', value: condition } })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      formData.condition === condition
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`} />
                    <label className="ml-3 block text-sm font-medium capitalize">
                      {condition.replace('-', ' ')}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Toggle */}
        <div className="mb-6">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="isDonation"
                name="isDonation"
                checked={formData.isDonation}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isDonation" className="font-medium text-gray-700">Free Donation</label>
              <p className="text-gray-500">Check this if you want to donate the medicine for free</p>
            </div>
          </div>
        </div>

        {/* Price Input */}
        {!formData.isDonation && (
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full pl-7 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )}

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

const LocationDescriptionStep = ({ formData, setFormData, onNext, onBack }) => {
  const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India's center
  const [locationPermission, setLocationPermission] = useState('prompt');
  const mapRef = useRef(null);
  const [showLocationButton, setShowLocationButton] = useState(true);

  // Define handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check location permission on component mount
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setLocationPermission(result.state);
          result.onchange = () => {
            setLocationPermission(result.state);
          };
        });
    }
  }, []);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        // Use a free geocoding service like Nominatim
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
    if (!navigator.geolocation) {
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

  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Custom Control Component for Location Button
  const LocationControl = () => {
    return (
      <div className="leaflet-control leaflet-bar" style={{ 
        margin: '10px',
        position: 'absolute',
        right: '10px',
        top: '10px', // Position below zoom controls
        zIndex: 1000 // Ensure it's above other controls
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

  // Add rate limiting
  const geocodeLocation = debounce(async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (!response.ok) throw new Error('Geocoding failed');
      // ... rest of the code
    } catch (error) {
      toast.error('Failed to get address. Please try again later.');
    }
  }, 1000);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Additional Details</h3>

        {/* Location Permission Alert */}
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

        {/* Location Input with Current Location Button */}
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

        {/* Map */}
        <div className="mb-6 relative">
          <MapContainer 
            center={position} 
            zoom={13} 
            style={{ height: '300px', width: '100%' }}
            className="rounded-lg shadow-md z-0"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker 
              position={position}
              icon={customIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  setPosition([position.lat, position.lng]);
                  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
                    .then(res => res.json())
                    .then(data => {
                      setFormData(prev => ({
                        ...prev,
                        location: data.display_name,
                        coordinates: { lat: position.lat, lng: position.lng }
                      }));
                    });
                }
              }}
            />
            {showLocationButton && <LocationControl />}
          </MapContainer>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Add any additional details about the medicine..."
          />
          <p className="mt-2 text-sm text-gray-500">
            Include any special storage requirements or usage instructions
          </p>
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
            Review
            <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ReviewStep = ({ formData, onBack, onSubmit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Donation</h3>

        {/* Review Sections */}
        <div className="space-y-6">
          {/* Medicine Details */}
          <div className="border-b border-gray-200 pb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Medicine Information</h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-sm font-medium text-gray-900">{formData.medicineName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Category</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">{formData.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Quantity</dt>
                <dd className="text-sm font-medium text-gray-900">{formData.quantity} units</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Expiry Date</dt>
                <dd className="text-sm font-medium text-gray-900">{formatDate(formData.expiryDate)}</dd>
              </div>
            </dl>
          </div>

          {/* Condition & Price */}
          <div className="border-b border-gray-200 pb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Condition & Price</h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm text-gray-500">Condition</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">{formData.condition.replace('-', ' ')}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Price</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formData.isDonation ? 'Free Donation' : `₹${formData.price}`}
                </dd>
              </div>
            </dl>
          </div>

          {/* Location & Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Pickup Location</dt>
                <dd className="text-sm font-medium text-gray-900">{formData.location}</dd>
              </div>
              {formData.description && (
                <div>
                  <dt className="text-sm text-gray-500">Additional Details</dt>
                  <dd className="text-sm font-medium text-gray-900">{formData.description}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I confirm that all the information provided is accurate
              </label>
              <p className="text-gray-500">
                By submitting this donation, you agree to our terms and conditions regarding medicine donations.
              </p>
            </div>
          </div>
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
            onClick={onSubmit}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Submit Donation
            <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Add this new component for progress steps
const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background Line */}
          <div className="absolute top-1/4 transform -translate-y-1/2 h-1 bg-gray-200 w-full"></div>
          
          {/* Progress Line */}
          <div 
            className="absolute top-1/4 transform -translate-y-1/2 h-1 bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full 
                    transition-all duration-500 ease-in-out
                    ${index <= currentStep 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                    }
                    ${index < currentStep && 'scale-90'}
                  `}
                >
                  {index < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-base font-semibold">{index + 1}</span>
                  )}
                </div>
                <span 
                  className={`
                    mt-2 text-xs font-medium text-center
                    ${index <= currentStep ? 'text-primary' : 'text-gray-500'}
                  `}
                  style={{ width: '80px', marginLeft: '.5rem' }}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="block md:hidden">
        <div className="flex items-center px-2">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-md">
            <span className="text-sm font-semibold">{currentStep + 1}</span>
          </div>
          <div className="flex-1 ml-3">
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">{steps[currentStep].title}</span>
                <span className="text-xs text-gray-500">
                  {currentStep + 1}/{steps.length}
                </span>
              </div>
              <div className="mt-2 flex items-center">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Steps Indicator */}
        <div className="flex justify-between px-2 mt-3">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-1 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main component
const DonatePage = () => {
  // Initialize with default values first
  const defaultFormData = {
    medicineName: '',
    category: '',
    quantity: '',
    expiryDate: '',
    condition: 'new',
    price: '',
    isDonation: false,
    medicineImages: [],
    description: '',
    location: ''
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);
  const [preview, setPreview] = useState([]);
  const [initialFormData, setInitialFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved data from localStorage after component mounts
  useEffect(() => {
    const savedStep = localStorage.getItem('donateFormStep');
    const savedFormData = localStorage.getItem('donateFormData');
    const savedPreviews = localStorage.getItem('donateFormPreviews');

    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
      setInitialFormData(parsedData);
    }
    if (savedPreviews) {
      setPreview(JSON.parse(savedPreviews));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    setIsSaving(true);
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('donateFormData', JSON.stringify(formData));
      localStorage.setItem('donateFormStep', currentStep.toString());
      localStorage.setItem('donateFormPreviews', JSON.stringify(preview));
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [formData, currentStep, preview]);

  // Add beforeunload event listener
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formHasChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, initialFormData]);

  const formHasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const resetForm = () => {
    localStorage.removeItem('donateFormStep');
    localStorage.removeItem('donateFormData');
    localStorage.removeItem('donateFormPreviews');
    setCurrentStep(0);
    setFormData(defaultFormData);
    setInitialFormData(defaultFormData);
    setPreview([]);
  };

  const handleSubmit = async () => {
    try {
      await toast.promise(
        // Replace with actual API call
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: 'Submitting your donation...',
          success: 'Donation submitted successfully!',
          error: 'Failed to submit donation. Please try again.',
        }
      );
      resetForm();
    } catch (error) {
      console.error('Error submitting donation:', error);
    }
  };

  // Define steps array after the handler functions
  const steps = [
    {
      title: 'Upload Images',
      component: <ImageUploadStep 
        formData={formData} 
        setFormData={setFormData} 
        preview={preview} 
        setPreview={setPreview}
        onNext={handleNext}
      />
    },
    {
      title: 'Medicine Details',
      component: <MedicineDetailsStep
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    },
    {
      title: 'Pricing & Condition',
      component: <PricingConditionStep
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    },
    {
      title: 'Location',
      component: <LocationDescriptionStep
        formData={formData}
        setFormData={setFormData}
        onNext={handleNext}
        onBack={handleBack}
      />
    },
    {
      title: 'Review',
      component: <ReviewStep
        formData={formData}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />
    }
  ];

  const validateExpiryDate = (date) => {
    const today = new Date();
    const expiryDate = new Date(date);
    return expiryDate > today;
  };

  const validatePrice = (price) => {
    return !isNaN(price) && price >= 0 && price <= 999999;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleNext();
    }
  };

  const saveFormData = (data) => {
    try {
      localStorage.setItem('donateFormData', JSON.stringify(data));
    } catch (error) {
      toast.error('Failed to save form data. Please clear some browser data.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Optional Reset Button */}
          <div className="flex justify-end mb-4">
            <button
              aria-label="Reset form"
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Form
            </button>
          </div>
          
          {/* Progress Steps */}
          <ProgressSteps steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {steps[currentStep].component}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default DonatePage; 