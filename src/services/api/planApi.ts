
import apiClient from './apiClient';
import { Plan } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export interface PlanCreateRequest {
  name: string;
  description?: string;
  price: number;
  platforms: string[];
  durationValue?: number;
  durationType?: string;
  stickerText?: string;
  stickerColor?: string;
  showOnHomepage?: boolean;
  homepageOrder?: number;
}

export const planApi = {
  getAll: async (): Promise<Plan[]> => {
    try {
      const response = await apiClient.get<Plan[]>('/plans');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch plans';
      toast.error(message);
      throw new Error(message);
    }
  },

  getById: async (id: string): Promise<Plan> => {
    try {
      const response = await apiClient.get<Plan>(`/plans/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch plan';
      toast.error(message);
      throw new Error(message);
    }
  },

  create: async (data: PlanCreateRequest): Promise<Plan> => {
    try {
      const response = await apiClient.post<Plan>('/plans', data);
      toast.success('Plan created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create plan';
      toast.error(message);
      throw new Error(message);
    }
  },

  update: async (id: string, data: Partial<Plan>): Promise<Plan> => {
    try {
      const response = await apiClient.put<Plan>(`/plans/${id}`, data);
      toast.success('Plan updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update plan';
      toast.error(message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/plans/${id}`);
      toast.success('Plan deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete plan';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default planApi;
