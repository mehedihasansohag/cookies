
import apiClient from './apiClient';
import { Order } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export interface OrderCreateRequest {
  planId: string;
  originalPrice: number;
  lastFourDigits: string;
  couponCode?: string;
  couponDiscount?: number;
  paymentMethod?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      toast.error(message);
      throw new Error(message);
    }
  },

  getUserOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders/user');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch orders';
      toast.error(message);
      throw new Error(message);
    }
  },

  getById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch order';
      toast.error(message);
      throw new Error(message);
    }
  },

  create: async (data: OrderCreateRequest): Promise<Order> => {
    try {
      const response = await apiClient.post<Order>('/orders', data);
      toast.success('Order created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create order';
      toast.error(message);
      throw new Error(message);
    }
  },

  updateStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<Order> => {
    try {
      const response = await apiClient.patch<Order>(`/orders/${id}/status`, data);
      toast.success(`Order status updated to ${data.status}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default orderApi;
