'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { useDropzone } from 'react-dropzone';

const RequestPage = () => {
  const [formData, setFormData] = useState({
    medicineName: '',
    category: '',
    quantity: '',
    prescriptionImage: null,
    prescriptionPreview: null,
    deliveryMethod: 'pickup',
    address: '',
    urgency: 'normal',
    additionalNotes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        prescriptionImage: file,
        prescriptionPreview: URL.createObjectURL(file)
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const categories = [
    'Pain Relief',
    'Antibiotics',
    'Cardiovascular',
    'Diabetes',
    'Respiratory',
    'Gastrointestinal',
    'Other'
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Request Medicine</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Please provide details about the medicine you need and upload your prescription.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                {/* Medicine Name */}
                <div>
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
                <div>
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

                {/* Quantity and Urgency Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity Needed *
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
                      placeholder="Enter quantity needed"
                    />
                  </div>
                  <div>
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                      Urgency Level *
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                {/* Prescription Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Prescription *
                  </label>
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
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Prescription Preview */}
                  {formData.prescriptionPreview && (
                    <div className="mt-4">
                      <div className="relative inline-block">
                        <img
                          src={formData.prescriptionPreview}
                          alt="Prescription preview"
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            prescriptionImage: null,
                            prescriptionPreview: null
                          }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Method *
                  </label>
                  <div className="mt-2 space-y-4">
                    {['pickup', 'delivery'].map((method) => (
                      <div key={method} className="flex items-center">
                        <input
                          type="radio"
                          id={method}
                          name="deliveryMethod"
                          value={method}
                          checked={formData.deliveryMethod === method}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <label htmlFor={method} className="ml-3 capitalize">
                          {method}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address (shown only if delivery is selected) */}
                {formData.deliveryMethod === 'delivery' && (
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter your complete delivery address"
                    />
                  </div>
                )}

                {/* Additional Notes */}
                <div>
                  <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Any additional information about your request..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* AI Processing Status */}
          <div className="mt-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Our AI is processing your prescription. Details will be automatically filled once complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RequestPage;