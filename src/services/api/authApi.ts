
import apiClient from './apiClient';
import { toast } from '@/components/ui/sonner';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'support' | 'user';
  };
  token: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      // Store token in localStorage
      localStorage.setItem('accessToken', response.data.token);
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to login';
      toast.error(message);
      throw new Error(message);
    }
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', data);
      // Store token in localStorage
      localStorage.setItem('accessToken', response.data.token);
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to sign up';
      toast.error(message);
      throw new Error(message);
    }
  },

  logout: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch user data');
      }
      throw error;
    }
  },

  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    try {
      await apiClient.put('/users/password', data);
      toast.success('Password updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      throw new Error(message);
    }
  },

  updateProfile: async (data: { name: string; email: string }): Promise<void> => {
    try {
      const response = await apiClient.put('/users/profile', data);
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw new Error(message);
    }
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    try {
      await apiClient.post('/auth/forgot-password', data);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to process request';
      toast.error(message);
      throw new Error(message);
    }
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    try {
      await apiClient.post('/auth/reset-password', data);
      toast.success('Password reset successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      throw new Error(message);
    }
  },
};

export default authApi;
