'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function ConstituentProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Get constituent data
  const constituentData = useQuery(api.constituents.getByUserId, {
    userId: user?._id || ''
  });

  // Update constituent data
  const updateConstituent = useMutation(api.constituents.update);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    county: '',
    town: '',
    contactPreference: 'email',
    interests: [] as string[],
    notificationFrequency: 'daily',
    subscribedTopics: [] as string[]
  });

  // Initialize form data when constituent data is loaded
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes for interests
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

  // Handle checkbox changes for subscribed topics
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Format data for API
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

  // Available interests and topics
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Profile Header */}
      <div className="bg-blue-600 dark:bg-blue-800 p-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold">
            {formData.fullName.charAt(0) || user?.email?.charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{formData.fullName || 'Constituent'}</h1>
            <p className="text-blue-200">{formData.email || user?.email || 'No email provided'}</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 mb-4">
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Profile Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Personal Information</h2>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Personal Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Contact Details</h3>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.fullName || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.email || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.address || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Location Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Location Details</h3>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.city || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.state || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label htmlFor="county" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  County
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.county || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label htmlFor="town" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Town/Township
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="town"
                    name="town"
                    value={formData.town}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{formData.town || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Communication Preferences</h3>
            
            <div>
              <label htmlFor="contactPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preferred Contact Method
              </label>
              {isEditing ? (
                <select
                  id="contactPreference"
                  name="contactPreference"
                  value={formData.contactPreference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="in-app">In-App Notification</option>
                  <option value="mail">Physical Mail</option>
                </select>
              ) : (
                <p className="text-gray-800 dark:text-gray-200">
                  {formData.contactPreference === 'email' ? 'Email' :
                   formData.contactPreference === 'phone' ? 'Phone' :
                   formData.contactPreference === 'in-app' ? 'In-App Notification' :
                   formData.contactPreference === 'mail' ? 'Physical Mail' : 'Not specified'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="notificationFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notification Frequency
              </label>
              {isEditing ? (
                <select
                  id="notificationFrequency"
                  name="notificationFrequency"
                  value={formData.notificationFrequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="asap">As Soon As Possible</option>
                </select>
              ) : (
                <p className="text-gray-800 dark:text-gray-200">
                  {formData.notificationFrequency === 'daily' ? 'Daily' :
                   formData.notificationFrequency === 'weekly' ? 'Weekly' :
                   formData.notificationFrequency === 'asap' ? 'As Soon As Possible' : 'Not specified'}
                </p>
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
  );
}
