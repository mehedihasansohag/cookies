
import apiClient from './apiClient';
import { Platform } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export interface PlatformCreateRequest {
  name: string;
  url: string;
  description?: string;
  logo?: string;
  domain?: string;
  redirect?: string;
}

export const platformApi = {
  getAll: async (): Promise<Platform[]> => {
    try {
      const response = await apiClient.get<Platform[]>('/platforms');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch platforms';
      toast.error(message);
      throw new Error(message);
    }
  },

  getById: async (id: string): Promise<Platform> => {
    try {
      const response = await apiClient.get<Platform>(`/platforms/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch platform';
      toast.error(message);
      throw new Error(message);
    }
  },

  getLatestCookies: async (platform: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/cookies/latest?platform=${platform}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch latest cookies';
      toast.error(message);
      throw new Error(message);
    }
  },

  create: async (data: PlatformCreateRequest): Promise<Platform> => {
    try {
      const response = await apiClient.post<Platform>('/platforms', data);
      toast.success('Platform created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create platform';
      toast.error(message);
      throw new Error(message);
    }
  },

  update: async (id: string, data: Partial<Platform>): Promise<Platform> => {
    try {
      const response = await apiClient.put<Platform>(`/platforms/${id}`, data);
      toast.success('Platform updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update platform';
      toast.error(message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/platforms/${id}`);
      toast.success('Platform deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete platform';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default platformApi;
