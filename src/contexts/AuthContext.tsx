
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import authApi from '@/services/api/authApi';
import { toast } from '@/components/ui/sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from local storage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      
      if (storedUser && token) {
        try {
          // Parse the stored user
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Validate token by fetching current user (happens silently)
          await authApi.getCurrentUser();
        } catch (error) {
          console.error('Failed to validate user token:', error);
          logout(); // Clear invalid user/token
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup({ name, email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword({ email, token, password: newPassword });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (name: string, email: string) => {
    setIsLoading(true);
    try {
      await authApi.updateProfile({ name, email });
      // Update user state with new profile info
      if (user) {
        setUser({ ...user, name, email });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
    } finally {
      setIsLoading(false);
    }
  };

  const blockUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Not implemented in API yet - to be added
      toast.error("This feature is not fully implemented yet");
    } finally {
      setIsLoading(false);
    }
  };

  const unblockUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Not implemented in API yet - to be added
      toast.error("This feature is not fully implemented yet");
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserRole = async (userId: string, newRole: 'admin' | 'manager' | 'support' | 'user') => {
    setIsLoading(true);
    try {
      // Not implemented in API yet - to be added
      toast.error("This feature is not fully implemented yet");
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = () => {
    // Not implemented in API yet - to be added
    toast.error("This feature is not fully implemented yet");
    return [];
  };

  const getUserById = (id: string) => {
    // Not implemented in API yet - to be added
    toast.error("This feature is not fully implemented yet");
    return undefined;
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isSupport = user?.role === 'support';

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAdmin,
        isManager,
        isSupport,
        login, 
        signup, 
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        blockUser,
        unblockUser,
        changeUserRole,
        getUsers,
        getUserById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
