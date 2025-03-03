'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { 
  UserCircleIcon, 
  CogIcon, 
  ClockIcon, 
  HeartIcon,
  PencilIcon,
  CheckIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/profile');
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await res.json();
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      toast.error('Error fetching profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations and requests
  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        if (user) {
          // Fetch donations
          const donationsRes = await fetch('/api/donations/user');
          if (donationsRes.ok && isMounted) {
            const donationsData = await donationsRes.json();
            setDonations(donationsData);
          }

          // Fetch requests
          const requestsRes = await fetch('/api/requests/user');
          if (requestsRes.ok && isMounted) {
            const requestsData = await requestsRes.json();
            setRequests(requestsData);
          }
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        if (isMounted) {
          toast.error('Failed to load transaction history');
        }
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedProfile.name,
          phone: editedProfile.phone,
          address: editedProfile.address,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch('/api/users/avatar', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload avatar');

        const data = await response.json();
        setProfile(prev => ({
          ...prev,
          avatar: data.avatarUrl
        }));
        setEditedProfile(prev => ({
          ...prev,
          avatar: data.avatarUrl
        }));

        toast.success('Avatar updated successfully');
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error('Failed to upload avatar');
      }
    }
  };

  const handleNotificationChange = (type) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
          <div className="mb-6">
            <UserCircleIcon className="h-20 w-20 text-primary/80 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your profile and manage your account.</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-xl overflow-hidden mb-4 sm:mb-8">
          <div className="relative h-24 sm:h-48">
            {/* Cool Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary-600/90 to-primary/90">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '12px 12px sm:24px 24px'
              }}></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)`,
                backgroundSize: '36px 36px sm:64px 64px',
                opacity: 0.3
              }}></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30"></div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-3 sm:px-6 py-3 sm:py-8 -mt-12 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative group">
                <div className="h-20 w-20 sm:h-32 sm:w-32 rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-lg sm:shadow-xl bg-white hover:rotate-6 transition-transform duration-300">
                  {profile?.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-full w-full text-gray-300" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary hover:bg-primary-600 text-white rounded-full p-1 sm:p-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <PencilIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </label>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-8 text-center sm:text-left">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-2">
                  {profile?.name}
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 mb-2 sm:mb-4">
                  {profile?.email}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-3">
                  <span className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary-800 capitalize">
                    <ShieldCheckIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    {profile?.role}
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                    <div className="h-1 w-1 sm:h-2 sm:w-2 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg mb-4 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'profile', icon: UserCircleIcon, label: 'Profile' },
                { id: 'activity', icon: ClockIcon, label: 'Activity' },
                { id: 'settings', icon: CogIcon, label: 'Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 sm:py-4 px-2 sm:px-6 text-center border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    {tab.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4 sm:space-y-8">
          {/* Profile Details */}
          {activeTab === 'profile' && profile && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-8">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                  <UserCircleIcon className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-primary" />
                  Profile Info
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isEditing
                      ? 'bg-primary text-white hover:bg-primary-600'
                      : 'text-primary hover:bg-primary/10'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  {[
                    { label: 'Name', key: 'name' },
                    { label: 'Email', key: 'email', readonly: true },
                    { label: 'Phone', key: 'phone' },
                    { label: 'Address', key: 'address' }
                  ].map((field) => (
                    <div key={field.key} className="relative">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        {field.label}
                      </label>
                      {isEditing && !field.readonly ? (
                        <input
                          type={field.key === 'phone' ? 'tel' : 'text'}
                          value={editedProfile[field.key]}
                          onChange={(e) => setEditedProfile({ 
                            ...editedProfile, 
                            [field.key]: e.target.value 
                          })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 text-sm sm:text-base"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-gray-900 text-sm sm:text-base">
                          {profile[field.key] || 'Not provided'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 sm:space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                      }}
                      className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg text-xs sm:text-sm hover:bg-primary-600 transition-all duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-4 sm:space-y-8">
              {/* Donations Section */}
              {profile?.role === 'donor' && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-8">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                      <HeartIcon className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-primary" />
                      Your Donations
                    </h2>
                    <span className="px-3 sm:px-4 py-1 sm:py-2 bg-primary/10 rounded-lg text-xs sm:text-sm text-primary font-medium">
                      {donations.length} Total
                    </span>
                  </div>
                  
                  {donations.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {donations.map((donation) => (
                        <div
                          key={donation._id}
                          className="group relative bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:bg-gray-100 transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                            <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-0">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                                {donation.medicineId?.name || 'Medicine Deleted'}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center">
                                  <ArrowPathIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                                  Qty: {donation.quantity}
                                </span>
                                <span className="flex items-center">
                                  <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                                  Exp: {new Date(donation.medicineId?.expiryDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <span className={`inline-block px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(donation.status)}`}>
                              {donation.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <HeartIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-lg text-gray-500">No donations yet</p>
                      <button
                        onClick={() => router.push('/donate')}
                        className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-xs sm:text-sm rounded-lg hover:bg-primary-600 transition-all duration-200"
                      >
                        Make Your First Donation
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Requests Section */}
              {profile?.role === 'recipient' && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-8">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center">
                      <ClockIcon className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-primary" />
                      Your Requests
                    </h2>
                    <span className="px-3 sm:px-4 py-1 sm:py-2 bg-primary/10 rounded-lg text-xs sm:text-sm text-primary font-medium">
                      {requests.length} Total
                    </span>
                  </div>
                  
                  {requests.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {requests.map((request) => (
                        <div
                          key={request._id}
                          className="group relative bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:bg-gray-100 transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                            <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-0">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                                {request.medicineId?.name || 'Medicine Deleted'}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center">
                                  <ArrowPathIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                                  Qty: {request.quantity}
                                </span>
                                <span className="flex items-center">
                                  <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                                  Requested: {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <span className={`inline-block px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <ClockIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-lg text-gray-500">No requests yet</p>
                      <button
                        onClick={() => router.push('/request')}
                        className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-xs sm:text-sm rounded-lg hover:bg-primary-600 transition-all duration-200"
                      >
                        Make Your First Request
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 flex items-center">
                <CogIcon className="h-5 w-5 sm:h-7 sm:w-7 mr-2 sm:mr-3 text-primary" />
                Account Settings
              </h2>
              
              <div className="space-y-4 sm:space-y-8">
                {/* Notification Preferences */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <BellIcon className="h-4 w-4 sm:h-6 sm:w-6 mr-1.5 sm:mr-2 text-primary" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { id: 'email', label: 'Email Notifications', description: 'Receive updates about your donations and requests' },
                      { id: 'sms', label: 'SMS Notifications', description: 'Get instant updates on your mobile phone' }
                    ].map((notification) => (
                      <label
                        key={notification.id}
                        className="flex items-start p-3 sm:p-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center h-5 sm:h-6">
                          <input
                            type="checkbox"
                            className="h-4 w-4 sm:h-5 sm:w-5 text-primary rounded border-gray-300 focus:ring-primary"
                            checked={profile?.notifications?.[notification.id]}
                            onChange={() => handleNotificationChange(notification.id)}
                          />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-sm sm:text-base font-medium text-gray-900">{notification.label}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{notification.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Account Actions */}
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <ShieldCheckIcon className="h-4 w-4 sm:h-6 sm:w-6 mr-1.5 sm:mr-2 text-primary" />
                    Account Security
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <button
                      onClick={() => router.push('/change-password')}
                      className="w-full flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white text-xs sm:text-sm rounded-lg hover:bg-primary-600 transition-all duration-200"
                    >
                      <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      Change Password
                    </button>
                    <button
                      onClick={() => {
                        toast.error('Account deletion is not implemented yet');
                      }}
                      className="w-full flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-red-200 text-xs sm:text-sm text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 