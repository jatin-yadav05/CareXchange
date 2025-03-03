"use client";

import Navbar from '@/components/Navbar';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';

// Dynamically import all map components with no SSR
const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Dynamically import the LocationDescriptionStep with no SSR
const LocationDescriptionStep = dynamic(
  () => import('./LocationDescriptionStep'),
  { ssr: false }
);

// Initialize defaultFormData outside of component to avoid window reference
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

// Step components will be defined here
const ImageUploadStep = ({ formData, setFormData, preview, setPreview, onNext }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Some files were rejected. Please check file type and size.');
    }
    setFormData(prev => ({
      ...prev,
      medicineImages: [...prev.medicineImages, ...acceptedFiles]
    }));

    // Create preview URLs only on client side
    if (isClient) {
      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setPreview(prev => [...prev, ...newPreviews]);
    }

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
  }, [setFormData, setPreview, isClient]);

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

  // Clean up object URLs
  useEffect(() => {
    if (!isClient) return;
    return () => {
      preview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [preview, isClient]);

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

const ReviewStep = ({ formData, onBack, onSubmit }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString) => {
    if (!isClient) return dateString;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);
  const [preview, setPreview] = useState([]);
  const [initialFormData, setInitialFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved data from localStorage after component mounts
  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isClient) return;

    setIsSaving(true);
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('donateFormData', JSON.stringify(formData));
      localStorage.setItem('donateFormStep', currentStep.toString());
      localStorage.setItem('donateFormPreviews', JSON.stringify(preview));
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [formData, currentStep, preview, isClient]);

  // Add beforeunload event listener
  useEffect(() => {
    if (!isClient) return;

    const handleBeforeUnload = (e) => {
      if (formHasChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Only add event listener if we're in the browser
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [formData, initialFormData, isClient]);

  const formHasChanges = () => {
    if (!isClient) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const resetForm = () => {
    if (!isClient) return;
    
    localStorage.removeItem('donateFormStep');
    localStorage.removeItem('donateFormData');
    localStorage.removeItem('donateFormPreviews');
    setCurrentStep(0);
    setFormData(defaultFormData);
    setInitialFormData(defaultFormData);
    setPreview([]);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
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