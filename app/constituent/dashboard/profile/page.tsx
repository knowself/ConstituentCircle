'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import ConstituentDashboardLayout from '@/components/constituent/ConstituentDashboardLayout';

interface ConstituentMetadata {
  phone?: string;
  address?: string;
}

interface ConstituentPreferences {
  contact_preference?: 'email' | 'phone' | 'in-app' | 'mail';
  interests?: string[];
  notification_frequency?: 'daily' | 'weekly' | 'asap';
  subscribed_topics?: string[];
}

interface ConstituentData {
  _id: string;
  userId: string;
  fullName?: string;
  email?: string;
  city?: string;
  state?: string;
  county?: string;
  town?: string;
  metadata?: ConstituentMetadata;
  preferences?: ConstituentPreferences;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  county: string;
  town: string;
  contactPreference: string;
  interests: string[];
  notificationFrequency: string;
  subscribedTopics: string[];
}

const availableInterests = [
  'education', 'healthcare', 'infrastructure', 'environment', 
  'public_safety', 'taxes', 'transportation', 'economy', 'veterans',
  'housing', 'immigration', 'civil_rights', 'agriculture'
];

const availableTopics = [
  'budget', 'elections', 'local_issues', 'education_reform',
  'public_safety', 'infrastructure', 'jobs', 'veterans_affairs',
  'healthcare_reform', 'environmental_policy', 'tax_policy'
];

const ConstituentProfilePageContent = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const constituentData = useQuery(api.constituents.getByUserId, {
    userId: user?._id || ''
  });

  const updateConstituent = useMutation(api.constituents.update);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    county: '',
    town: '',
    contactPreference: 'email',
    interests: [],
    notificationFrequency: 'daily',
    subscribedTopics: []
  });

  useEffect(() => {
    if (constituentData) {
      setFormData({
        fullName: constituentData.fullName || '',
        email: constituentData.email || '',
        phone: constituentData.metadata?.phone || '',
        address: constituentData.metadata?.address || '',
        city: constituentData.city || '',
        state: constituentData.state || '',
        county: constituentData.county || '',
        town: constituentData.town || '',
        contactPreference: constituentData.preferences?.contact_preference || 'email',
        interests: constituentData.preferences?.interests || [],
        notificationFrequency: constituentData.preferences?.notification_frequency || 'daily',
        subscribedTopics: constituentData.preferences?.subscribed_topics || []
      });
    }
  }, [constituentData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return {
        ...prev,
        interests: newInterests
      };
    });
  };

  const handleTopicChange = (topic: string) => {
    setFormData(prev => {
      const newTopics = prev.subscribedTopics.includes(topic)
        ? prev.subscribedTopics.filter(t => t !== topic)
        : [...prev.subscribedTopics, topic];
      return {
        ...prev,
        subscribedTopics: newTopics
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateConstituent({
        id: constituentData?._id || '',
        fullName: formData.fullName,
        email: formData.email,
        metadata: {
          phone: formData.phone,
          address: formData.address,
          // Preserve other metadata fields
          ...constituentData?.metadata,
        },
        city: formData.city,
        state: formData.state,
        county: formData.county,
        town: formData.town,
        preferences: {
          contact_preference: formData.contactPreference as 'email' | 'phone' | 'in-app' | 'mail',
          interests: formData.interests,
          notification_frequency: formData.notificationFrequency as 'daily' | 'weekly' | 'asap',
          subscribed_topics: formData.subscribedTopics
        }
      });

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !constituentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
           {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium transition-colors dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.fullName || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.email || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Street Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.address || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.city || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  State / Province
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.state || 'Not provided'}</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="county" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  County
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="county"
                    id="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.county || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="town" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Town / Township
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="town"
                    id="town"
                    value={formData.town}
                    onChange={handleInputChange}
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.town || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Preferences</h3>

              {/* Contact Preference */}
              <div>
                <label htmlFor="contactPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Contact Method
                </label>
                {isEditing ? (
                  <select
                    id="contactPreference"
                    name="contactPreference"
                    value={formData.contactPreference}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="in-app">In-App Notification</option>
                    <option value="mail">Postal Mail</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.contactPreference.charAt(0).toUpperCase() + formData.contactPreference.slice(1)}</p>
                )}
              </div>

              {/* Notification Frequency */}
              <div>
                <label htmlFor="notificationFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notification Frequency
                </label>
                {isEditing ? (
                  <select
                    id="notificationFrequency"
                    name="notificationFrequency"
                    value={formData.notificationFrequency}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="asap">As Soon As Possible</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.notificationFrequency.charAt(0).toUpperCase() + formData.notificationFrequency.slice(1)}</p>
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Areas of Interest
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableInterests.map(interest => (
                      <div key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`interest-${interest}`}
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          {interest.replace('_', ' ').charAt(0).toUpperCase() + interest.replace('_', ' ').slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.length > 0 ? (
                      formData.interests.map(interest => (
                        <span key={interest} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {interest.replace('_', ' ').charAt(0).toUpperCase() + interest.replace('_', ' ').slice(1)}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No interests selected</p>
                    )}
                  </div>
                )}
              </div>

              {/* Subscribed Topics */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subscribed Topics
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableTopics.map(topic => (
                      <div key={topic} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`topic-${topic}`}
                          checked={formData.subscribedTopics.includes(topic)}
                          onChange={() => handleTopicChange(topic)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`topic-${topic}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          {topic.replace('_', ' ').charAt(0).toUpperCase() + topic.replace('_', ' ').slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.subscribedTopics.length > 0 ? (
                      formData.subscribedTopics.map(topic => (
                        <span key={topic} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {topic.replace('_', ' ').charAt(0).toUpperCase() + topic.replace('_', ' ').slice(1)}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No topics subscribed</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default function ConstituentProfilePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <ConstituentDashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading profile page...</p>
        </div>
      </ConstituentDashboardLayout>
    );
  }

  return (
    <ConstituentDashboardLayout>
      <ConstituentProfilePageContent />
    </ConstituentDashboardLayout>
  );
}
