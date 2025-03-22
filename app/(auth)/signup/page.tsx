'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import AuthInput from '../../../components/auth/AuthInput';
import { PlusIcon } from '@heroicons/react/24/outline';
import Header from '../../../components/Header';
import { Role } from '../../../lib/types/roles';

type UserType = 'constituent' | 'representative';
type RepresentativeLevel = 'federal' | 'state' | 'county' | 'city' | 'judge' | 'other';

export default function SignUp() {
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
  
  const [mounted, setMounted] = useState(false);
  const { signUp, error: authError, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    try {
      // Create metadata based on user type
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

      // Call the signUp method with appropriate parameters
      await signUp(email, password, userType as Role, metadata);
      router.push('/dashboard');
    } catch (err) {
      console.error('Sign up error:', err);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header showMobileMenu={true} />
      
      <div className="flex flex-grow flex-col justify-center py-12 sm:px-6 lg:px-8 pt-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <PlusIcon className="h-12 w-12 text-indigo-600 dark:text-blue-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Are you a Constituent or a Representative?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link href="/signin" className="font-medium text-indigo-600 dark:text-blue-500 hover:text-indigo-500 dark:hover:text-blue-400">
              Sign In to Your Account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {authError && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-4" role="alert">
                <span className="block sm:inline">{authError}</span>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* User Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-600 dark:text-blue-500"
                      name="userType"
                      value="constituent"
                      checked={userType === 'constituent'}
                      onChange={() => setUserType('constituent')}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Constituent</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">I am a private citizen</p>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-indigo-600 dark:text-blue-500"
                      name="userType"
                      value="representative"
                      checked={userType === 'representative'}
                      onChange={() => setUserType('representative')}
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Representative</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">I hold public office</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Common Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">Passwords do not match</p>
                  )}
                </div>
                
                {/* Conditional Fields Based on User Type */}
                {userType === 'constituent' ? (
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Location Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This helps us connect you with your elected representatives.</p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        City/Town
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        County
                      </label>
                      <input
                        type="text"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        State
                      </label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        required
                      >
                        <option value="">Select a state</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Office Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tell us about the office you hold.</p>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Government Level
                      </label>
                      <select
                        value={representativeLevel}
                        onChange={(e) => setRepresentativeLevel(e.target.value as RepresentativeLevel)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        required
                      >
                        <option value="federal">Federal</option>
                        <option value="state">State</option>
                        <option value="county">County</option>
                        <option value="city">City/Local</option>
                        <option value="judge">Judicial</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Office Type
                      </label>
                      <select
                        value={officeType}
                        onChange={(e) => setOfficeType(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        required
                      >
                        {representativeLevel === 'federal' && (
                          <>
                            <option value="Senator">U.S. Senator</option>
                            <option value="Representative">U.S. Representative</option>
                          </>
                        )}
                        {representativeLevel === 'state' && (
                          <>
                            <option value="Governor">Governor</option>
                            <option value="State Senator">State Senator</option>
                            <option value="State Representative">State Representative</option>
                            <option value="Attorney General">Attorney General</option>
                            <option value="Secretary of State">Secretary of State</option>
                          </>
                        )}
                        {representativeLevel === 'county' && (
                          <>
                            <option value="County Executive">County Executive</option>
                            <option value="County Commissioner">County Commissioner</option>
                            <option value="County Clerk">County Clerk</option>
                            <option value="Sheriff">Sheriff</option>
                          </>
                        )}
                        {representativeLevel === 'city' && (
                          <>
                            <option value="Mayor">Mayor</option>
                            <option value="City Council">City Council Member</option>
                            <option value="Alderman">Alderman</option>
                            <option value="City Manager">City Manager</option>
                          </>
                        )}
                        {representativeLevel === 'judge' && (
                          <>
                            <option value="Supreme Court Justice">Supreme Court Justice</option>
                            <option value="Appeals Court Judge">Appeals Court Judge</option>
                            <option value="District Court Judge">District Court Judge</option>
                            <option value="Probate Judge">Probate Judge</option>
                          </>
                        )}
                        {representativeLevel === 'other' && (
                          <>
                            <option value="School Board">School Board Member</option>
                            <option value="Special District">Special District Official</option>
                            <option value="Other">Other Elected Position</option>
                          </>
                        )}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        District or Jurisdiction
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        placeholder={representativeLevel === 'city' ? 'City name' : 'District number or area'}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Party Affiliation
                      </label>
                      <select
                        value={party}
                        onChange={(e) => setParty(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 dark:focus:ring-blue-500 focus:border-indigo-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
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
                  disabled={loading || password !== confirmPassword}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="font-medium text-indigo-600 dark:text-blue-500 hover:text-indigo-500 dark:hover:text-blue-400">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-indigo-600 dark:text-blue-500 hover:text-indigo-500 dark:hover:text-blue-400">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500 dark:text-gray-300">
            &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
