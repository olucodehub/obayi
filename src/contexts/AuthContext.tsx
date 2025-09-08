import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthContextType, RegisterData } from '../types/auth';
import { AuthService } from '../services/serviceFactory';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize default admin user if needed
        const { AuthService: LocalAuthService } = await import('../utils/auth');
        LocalAuthService.initializeDefaultUsers();
        
        // Check if user is already logged in
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        // Clear any invalid auth state
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const user = await AuthService.login(email, password);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const user = await AuthService.register(userData);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    
    // Add a small delay for user feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await AuthService.logout();
    setUser(null);
    setIsLoggingOut(false);
    
    // Redirect to home page
    window.location.href = '/';
  };

  const isAuthenticated = user !== null;

  const hasRole = (role: UserRole): boolean => {
    return user?.userType === role;
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    isLoading,
    isLoggingOut,
    refreshProfile,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (isLoggingOut) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Logging out...</h2>
          <p className="text-gray-600">Redirecting to home page</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};