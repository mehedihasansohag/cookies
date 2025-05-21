
import apiClient from './apiClient';
import { Notification } from '@/types/notification';
import { toast } from '@/components/ui/sonner';

export interface NotificationCreateRequest {
  title: string;
  message: string;
  priority?: 'high' | 'medium' | 'low';
  expiresAt?: string;
  userId?: string;
}

export const notificationApi = {
  getAllAdmin: async (): Promise<Notification[]> => {
    try {
      const response = await apiClient.get<Notification[]>('/notifications/admin');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      toast.error(message);
      throw new Error(message);
    }
  },

  getUserNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await apiClient.get<Notification[]>('/notifications/user');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      toast.error(message);
      throw new Error(message);
    }
  },

  create: async (data: NotificationCreateRequest): Promise<Notification> => {
    try {
      const response = await apiClient.post<Notification>('/notifications', data);
      toast.success('Notification created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create notification';
      toast.error(message);
      throw new Error(message);
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to mark notification as read';
      toast.error(message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      toast.success('Notification deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete notification';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default notificationApi;
