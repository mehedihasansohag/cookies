
import apiClient from './apiClient';
import { TutorialVideo } from '@/types/access';
import { toast } from '@/components/ui/sonner';

export interface TutorialCreateRequest {
  title: string;
  description?: string;
  type: 'login' | 'login-mobile' | 'cookie' | 'cookie-mobile';
  thumbnailUrl?: string;
  contentUrl: string;
}

export const tutorialApi = {
  getAll: async (): Promise<TutorialVideo[]> => {
    try {
      const response = await apiClient.get<TutorialVideo[]>('/tutorials');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch tutorials';
      toast.error(message);
      throw new Error(message);
    }
  },

  getById: async (id: string): Promise<TutorialVideo> => {
    try {
      const response = await apiClient.get<TutorialVideo>(`/tutorials/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch tutorial';
      toast.error(message);
      throw new Error(message);
    }
  },

  create: async (data: TutorialCreateRequest): Promise<TutorialVideo> => {
    try {
      const response = await apiClient.post<TutorialVideo>('/tutorials', data);
      toast.success('Tutorial created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create tutorial';
      toast.error(message);
      throw new Error(message);
    }
  },

  update: async (id: string, data: Partial<TutorialCreateRequest>): Promise<TutorialVideo> => {
    try {
      const response = await apiClient.put<TutorialVideo>(`/tutorials/${id}`, data);
      toast.success('Tutorial updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update tutorial';
      toast.error(message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/tutorials/${id}`);
      toast.success('Tutorial deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete tutorial';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default tutorialApi;
