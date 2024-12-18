import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import AuthInput from '../../components/auth/AuthInput';
import { 
  Role, 
  CompanyRole, 
  RepRole,
  TemporaryRepRole,
  PermanentRepRole,
  EmploymentType 
} from '../../lib/firebase/firestore/types';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('representative');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('permanent');
  const [district, setDistrict] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [campaign, setCampaign] = useState('');
  const { signUp, error: authError, loading } = useAuth();
  const router = useRouter();

  // Check if the role is a company role
  const isCompanyStaff = (role: Role): role is CompanyRole => {
    return role.startsWith('company_');
  };

  // Check if the role is a temporary role
  const isTemporaryRole = (role: Role): role is TemporaryRepRole => {
    return [
      'campaign_manager',
      'campaign_coordinator',
      'field_organizer',
      'volunteer_coordinator',
      'temp_staff',
      'intern',
      'volunteer'
    ].includes(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    try {
      const metadata = {
        ...(isCompanyStaff(role as Role) ? { 
          department, 
          title 
        } : {}),
        ...(role === 'representative' ? { 
          district 
        } : {}),
        ...(!isCompanyStaff(role as Role) && role !== 'representative' ? {
          inviteCode,
          employment: {
            type: employmentType,
            startDate,
            ...(employmentType !== 'permanent' && { endDate }),
            ...(employmentType === 'campaign' && { campaign })
          }
        } : {})
      };

      await signUp(email, password, role as Role, metadata);
      router.push('/dashboard');
    } catch (err) {
      console.error('Sign up error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {role === 'representative' 
              ? 'Create your Representative Account'
              : isCompanyStaff(role as Role)
              ? 'Create your Company Staff Account'
              : 'Join a Representative Office'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {authError && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
              <span className="block sm:inline">{authError}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <AuthInput
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
            />

            <AuthInput
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              error={
                confirmPassword && password !== confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I am a...
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="representative">Representative</option>
                
                <optgroup label="Permanent Staff">
                  <option value="chief_of_staff">Chief of Staff</option>
                  <option value="communications_director">Communications Director</option>
                  <option value="office_admin">Office Administrator</option>
                  <option value="staff_member">Staff Member</option>
                </optgroup>

                <optgroup label="Campaign & Temporary Staff">
                  <option value="campaign_manager">Campaign Manager</option>
                  <option value="campaign_coordinator">Campaign Coordinator</option>
                  <option value="field_organizer">Field Organizer</option>
                  <option value="volunteer_coordinator">Volunteer Coordinator</option>
                  <option value="temp_staff">Temporary Staff</option>
                  <option value="intern">Intern</option>
                  <option value="volunteer">Volunteer</option>
                </optgroup>

                <optgroup label="Company Staff">
                  <option value="company_admin">Company Admin</option>
                  <option value="company_manager">Company Manager</option>
                  <option value="company_support">Support Staff</option>
                  <option value="company_analyst">Data Analyst</option>
                </optgroup>
              </select>
            </div>

            {!isCompanyStaff(role as Role) && role !== 'representative' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {!isTemporaryRole(role as Role) && (
                    <option value="permanent">Permanent</option>
                  )}
                  <option value="temporary">Temporary</option>
                  <option value="campaign">Campaign</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
            )}

            {role === 'representative' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  District Number
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your district number"
                  required
                />
              </div>
            )}

            {!isCompanyStaff(role as Role) && role !== 'representative' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Office Invite Code
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the invite code from your office"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Contact your representative's office to get an invite code
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {employmentType !== 'permanent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}

                {employmentType === 'campaign' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={campaign}
                      onChange={(e) => setCampaign(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {isCompanyStaff(role as Role) && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your department"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your job title"
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
