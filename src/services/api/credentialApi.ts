
import apiClient from './apiClient';
import { Credential } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export interface CredentialCreateRequest {
  platformId: string;
  planId: string;
  username?: string;
  password?: string;
  email?: string;
  notes?: string;
  domain?: string;
  platform?: string; // For backward compatibility
}

export const credentialApi = {
  getAll: async (): Promise<Credential[]> => {
    try {
      const response = await apiClient.get<Credential[]>('/credentials');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch credentials';
      toast.error(message);
      throw new Error(message);
    }
  },

  getByPlanId: async (planId: string): Promise<Credential[]> => {
    try {
      const response = await apiClient.get<Credential[]>(`/credentials/plan/${planId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch credentials';
      toast.error(message);
      throw new Error(message);
    }
  },

  getById: async (id: string): Promise<Credential> => {
    try {
      const response = await apiClient.get<Credential>(`/credentials/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch credential';
      toast.error(message);
      throw new Error(message);
    }
  },

  create: async (data: CredentialCreateRequest): Promise<Credential> => {
    try {
      const response = await apiClient.post<Credential>('/credentials', data);
      toast.success('Credential created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create credential';
      toast.error(message);
      throw new Error(message);
    }
  },

  update: async (id: string, data: Partial<Credential>): Promise<Credential> => {
    try {
      const response = await apiClient.put<Credential>(`/credentials/${id}`, data);
      toast.success('Credential updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update credential';
      toast.error(message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/credentials/${id}`);
      toast.success('Credential deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete credential';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default credentialApi;
