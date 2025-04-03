import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic'; // Import dynamic
import { useAuth } from '../../context/AuthContext';  // Updated to use Supabase auth context

// Dynamically import ProtectedRoute only on the client-side
const ProtectedRoute = dynamic(() => import('../auth/ProtectedRoute'), { ssr: false });

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();  // Updated to use logout instead of signOut
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration mismatch by only rendering user-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();  // Updated to use logout from Supabase context
      router.push('/auth/signin');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: 'HomeIcon' },
    { name: 'Communications', href: '/dashboard/communications', icon: 'ChatBubbleLeftIcon' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: 'ChartBarIcon' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'Cog6ToothIcon' },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/dashboard/profile' },
    { name: 'Settings', href: '/dashboard/settings' },
  ];

  // If not mounted yet, return a minimal layout to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex flex-col ml-0">
          <header className="bg-white shadow">
            <div className="flex h-16 items-center justify-between px-4"></div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
            {/* Don't render children during server-side rendering to prevent hydration issues */}
          </main>
        </div>
      </div>
    );
  }

  // If no user is available yet, show a loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-700 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="flex h-16 items-center justify-between px-4">
              <div className="text-xl font-bold text-white">Constituent Circle</div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <span className="sr-only">Close sidebar</span>
                {/* X icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
        
          {/* User menu */}
          <div className="border-t border-indigo-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="User avatar" className="mr-3 h-8 w-8 rounded-full" />
                ) : (
                  <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
                    <span className="text-xs font-medium leading-none text-white">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                        : user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.name || user?.email || 'User'}
                </p>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-indigo-200 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`flex flex-col ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Top header */}
          <header className="bg-white shadow">
            <div className="flex h-16 items-center justify-between px-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`text-gray-500 hover:text-gray-700 ${
                  isSidebarOpen ? 'hidden' : 'block'
                }`}
              >
                <span className="sr-only">Open sidebar</span>
                {/* Menu icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center">
                {/* Add any header content here */}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
