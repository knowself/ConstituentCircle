import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import SignIn from '../pages/auth/signin';
import SignUp from '../pages/auth/signup';
import Dashboard from '../pages/dashboard/index';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnValue({ error: null }),
      update: jest.fn().mockReturnValue({ error: null }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { role: 'representative' }, error: null }),
        }),
      }),
    })),
  })),
}));

// Mock component to test useAuth hook
const AuthConsumer = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user">{auth.user ? 'Authenticated' : 'Not authenticated'}</div>
      <button onClick={() => auth.signIn('test@example.com', 'password')}>Login</button>
      <button onClick={() => auth.signUp('test@example.com', 'password', 'representative', {})}>Sign Up</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('Authentication', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup router mock
    const mockRouter = {
      push: jest.fn(),
      pathname: '/',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('AuthContext', () => {
    it('provides authentication context to consumers', () => {
      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );
      
      expect(screen.getByTestId('user')).toHaveTextContent('Not authenticated');
    });

    it('handles sign in', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({});
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createClientComponentClient().auth;
      supabaseAuth.signInWithPassword.mockImplementation(mockSignIn);

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );
      
      fireEvent.click(screen.getByText('Sign In'));
      
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('handles sign up', async () => {
      const mockSignUp = jest.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null });
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createClientComponentClient().auth;
      supabaseAuth.signUp.mockImplementation(mockSignUp);

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );
      
      fireEvent.click(screen.getByText('Sign Up'));
      
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options: {
          data: {
            role: 'representative',
          }
        }
      });
    });

    it('handles logout', async () => {
      const mockSignOut = jest.fn().mockResolvedValue({});
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createClientComponentClient().auth;
      supabaseAuth.signOut.mockImplementation(mockSignOut);

      render(
        <AuthProvider>
          <AuthConsumer />
        </AuthProvider>
      );
      
      fireEvent.click(screen.getByText('Logout'));
      
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('SignIn Page', () => {
    it('renders the sign in form', () => {
      render(<SignIn />);
      
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });

    it('handles form submission', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({});
      const mockRouter = { push: jest.fn() };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      
      // Mock the useAuth hook
      jest.mock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: () => ({
          signIn: mockSignIn,
          loading: false,
          error: null,
        }),
      }));

      render(<SignIn />);
      
      fireEvent.change(screen.getByLabelText(/Email address/i), {
        target: { value: 'test@example.com' },
      });
      
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
      
      // Wait for the redirect after successful login
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password');
      });
    });

    it('displays error messages', async () => {
      // Mock the useAuth hook to return an error
      jest.mock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: () => ({
          signIn: jest.fn().mockRejectedValue(new Error('Invalid email or password')),
          loading: false,
          error: 'Invalid email or password',
        }),
      }));

      render(<SignIn />);
      
      fireEvent.change(screen.getByLabelText(/Email address/i), {
        target: { value: 'test@example.com' },
      });
      
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrong-password' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
      
      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });
    });
  });

  describe('ProtectedRoute Component', () => {
    it('redirects to login when not authenticated', async () => {
      const mockRouter = { push: jest.fn() };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      
      // Mock the useAuth hook to return no user
      jest.mock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: () => ({
          user: null,
          loading: false,
        }),
      }));

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
      });
    });

    it('renders children when authenticated', async () => {
      // Mock the useAuth hook to return a user
      jest.mock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: () => ({
          user: { id: '123', email: 'test@example.com' },
          loading: false,
        }),
      }));

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });

    it('checks role requirements', async () => {
      const mockRouter = { push: jest.fn() };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      
      // Mock the useAuth hook to return a user with a different role
      jest.mock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: () => ({
          user: { id: '123', email: 'test@example.com' },
          loading: false,
        }),
      }));

      // Mock Supabase query to return a different role
      const supabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
      supabase.from().select().eq().single.mockResolvedValue({
        data: { role: 'staff' },
        error: null,
      });

      render(
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );
      
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/unauthorized');
      });
    });
  });

  describe('Integration Tests', () => {
    it('redirects to dashboard after successful login', async () => {
      const mockRouter = { push: jest.fn() };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      
      // Mock successful sign in
      const mockSignIn = jest.fn().mockResolvedValue({});
      jest.mock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: () => ({
          signIn: mockSignIn,
          loading: false,
          error: null,
        }),
      }));

      render(<SignIn />);
      
      fireEvent.change(screen.getByLabelText(/Email address/i), {
        target: { value: 'test@example.com' },
      });
      
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password' },
      });
      
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));
      
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('dashboard is protected and requires authentication', async () => {
      const mockRouter = { push: jest.fn() };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      
      // Mock the useAuth hook to return no user
      jest.mock('../context/AuthContext', () => ({
        ...jest.requireActual('../context/AuthContext'),
        useAuth: () => ({
          user: null,
          loading: false,
        }),
      }));

      render(<Dashboard />);
      
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
      });
    });
  });
});
