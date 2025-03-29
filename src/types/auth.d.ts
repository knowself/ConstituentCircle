declare module '@/types/auth' {
  export interface User {
    _id: string;
    email: string;
    role: string;
    name?: string;
    displayname?: string;
  }

  export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }
}