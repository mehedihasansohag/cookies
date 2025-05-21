
import apiClient from './apiClient';
import { Cookie } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export interface CookieCreateRequest {
  platformId?: string;
  planId: string;
  name?: string;
  value?: string;
  domain?: string;
  expirationDate?: string;
  cookieData?: string;
  platform?: string;
  isPinned?: boolean;
}

export const cookieApi = {
  getAll: async (): Promise<Cookie[]> => {
    try {
      const response = await apiClient.get<Cookie[]>('/cookies');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch cookies';
      toast.error(message);
      throw new Error(message);
    }
  },

  getByPlanId: async (planId: string): Promise<Cookie[]> => {
    try {
      const response = await apiClient.get<Cookie[]>(`/cookies/plan/${planId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch cookies';
      toast.error(message);
      throw new Error(message);
    }
  },

  getById: async (id: string): Promise<Cookie> => {
    try {
      const response = await apiClient.get<Cookie>(`/cookies/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch cookie';
      toast.error(message);
      throw new Error(message);
    }
  },

  create: async (data: CookieCreateRequest): Promise<Cookie> => {
    try {
      const response = await apiClient.post<Cookie>('/cookies', data);
      toast.success('Cookie created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create cookie';
      toast.error(message);
      throw new Error(message);
    }
  },

  update: async (id: string, data: Partial<Cookie>): Promise<Cookie> => {
    try {
      const response = await apiClient.put<Cookie>(`/cookies/${id}`, data);
      toast.success('Cookie updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cookie';
      toast.error(message);
      throw new Error(message);
    }
  },

  togglePinned: async (id: string): Promise<Cookie> => {
    try {
      const response = await apiClient.patch<Cookie>(`/cookies/${id}/pin`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to toggle pin status';
      toast.error(message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/cookies/${id}`);
      toast.success('Cookie deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete cookie';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default cookieApi;
