'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Role } from '../../../lib/types/roles';

type UserType = 'constituent' | 'representative';
type RepresentativeLevel = 'federal' | 'state' | 'county' | 'city' | 'judge' | 'other';

// Inner component containing the signup form logic and useAuth hook
const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<UserType>('constituent');

  // Constituent fields
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [state, setState] = useState('');

  // Representative fields
  const [representativeLevel, setRepresentativeLevel] = useState<RepresentativeLevel>('federal');
  const [district, setDistrict] = useState('');
  const [officeType, setOfficeType] = useState('State Representative');
  const [party, setParty] = useState('');
  
  const [success, setSuccess] = useState(false);
  const { signUp, error: authError, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // Consider adding user feedback here
      return;
    }

    try {
      const metadata = {
        firstName,
        lastName,
        ...(userType === 'constituent' ? {
          city,
          county,
          state,
          employmentType: 'citizen'
        } : {
          district,
          officeType,
          party,
          employmentType: 'elected',
          governmentLevel: representativeLevel
        })
      };

      await signUp(email, password, userType as Role, metadata); // Ensure userType is cast to Role if necessary
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000); // Redirect after success
    } catch (err) {
      console.error('Sign up error:', err);
      // Consider showing a generic error message to the user
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      {success ? (
        <div className="mt-8 bg-white py-8 px-4 shadow rounded-lg sm:px-10 text-center">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Account created successfully! Redirecting to dashboard...
                </h3>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {authError && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{authError}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  minLength={8} // Basic password strength indicator
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${password !== confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
              </div>
              {password !== confirmPassword && confirmPassword !== '' && (
                <p className="mt-2 text-sm text-red-600">Passwords do not match.</p>
              )}
            </div>

            <fieldset className="mt-6">
              <legend className="block text-sm font-medium text-gray-700">Account Type</legend>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="constituent"
                    name="userType"
                    type="radio"
                    value="constituent"
                    checked={userType === 'constituent'}
                    onChange={() => setUserType('constituent')}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="constituent" className="ml-3 block text-sm text-gray-700">
                    I am a Constituent
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="representative"
                    name="userType"
                    type="radio"
                    value="representative"
                    checked={userType === 'representative'}
                    onChange={() => setUserType('representative')}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="representative" className="ml-3 block text-sm text-gray-700">
                    I am an Elected Representative / Staff
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Conditional Fields */}
            <div className="mt-6 space-y-6">
              {userType === 'constituent' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">County</label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select State</option>
                      {/* Add all US states here - truncated for brevity */}
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      {/* ... other states ... */}
                      <option value="WY">Wyoming</option>
                    </select>
                  </div>
                </div>
              )}

              {userType === 'representative' && (
                <div className="space-y-6">
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Level of Government</label>
                      <select
                        value={representativeLevel}
                        onChange={(e) => setRepresentativeLevel(e.target.value as RepresentativeLevel)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="federal">Federal (e.g., US Senator, US Representative)</option>
                        <option value="state">State (e.g., Governor, State Senator/Rep)</option>
                        <option value="county">County (e.g., Commissioner, Sheriff)</option>
                        <option value="city">City/Municipal (e.g., Mayor, Council Member)</option>
                        <option value="judge">Judicial</option>
                        <option value="other">Other (e.g., School Board)</option>
                      </select>
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Office / Position Title
                    </label>
                    <input 
                      type="text"
                      value={officeType}
                      onChange={(e) => setOfficeType(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., State Representative, Mayor, Judge"
                      required
                    />
                  </div>

                  {/* Show different placeholder text based on level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      District or Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder={representativeLevel === 'city' ? 'City name' : (representativeLevel === 'county' ? 'County name' : (representativeLevel === 'federal' || representativeLevel === 'state' ? 'District number' : 'Area of Jurisdiction'))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Party Affiliation
                    </label>
                    <select
                      value={party}
                      onChange={(e) => setParty(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select party (optional)</option>
                      <option value="Democratic">Democratic</option>
                      <option value="Republican">Republican</option>
                      <option value="Independent">Independent</option>
                      <option value="Libertarian">Libertarian</option>
                      <option value="Green">Green</option>
                      <option value="Other">Other</option>
                      <option value="Nonpartisan">Nonpartisan</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading || password !== confirmPassword}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-gray-600">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Main SignUp page component
export default function SignUp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // No cleanup needed here as we rely on mounted state
  }, []);

  if (!mounted) {
    // Render a placeholder or null during SSR/initial load
    // Or a more sophisticated loading skeleton
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 justify-center items-center">
        <p>Loading signup form...</p>
      </div>
    );
  }

  // Render the form component only when mounted on the client
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-grow flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignUpForm />
      </div>
    </div>
  );
}
