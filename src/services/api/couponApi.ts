
import apiClient from './apiClient';
import { Coupon } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export interface CouponCreateRequest {
  code: string;
  discount: number;
  planId?: string;
  expirationDate?: string;
  active?: boolean;
}

export interface ValidateCouponRequest {
  code: string;
  planId: string;
}

export const couponApi = {
  getAll: async (): Promise<Coupon[]> => {
    try {
      const response = await apiClient.get<Coupon[]>('/coupons');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch coupons';
      toast.error(message);
      throw new Error(message);
    }
  },

  getByPlanId: async (planId: string): Promise<Coupon[]> => {
    try {
      const response = await apiClient.get<Coupon[]>(`/coupons/plan/${planId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch coupons';
      toast.error(message);
      throw new Error(message);
    }
  },

  validateCoupon: async (data: ValidateCouponRequest): Promise<Coupon | null> => {
    try {
      const response = await apiClient.post<Coupon>('/coupons/validate', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 404) {
        const message = error.response?.data?.message || 'Failed to validate coupon';
        toast.error(message);
      }
      return null;
    }
  },

  create: async (data: CouponCreateRequest): Promise<Coupon> => {
    try {
      const response = await apiClient.post<Coupon>('/coupons', data);
      toast.success('Coupon created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create coupon';
      toast.error(message);
      throw new Error(message);
    }
  },

  update: async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
    try {
      const response = await apiClient.put<Coupon>(`/coupons/${id}`, data);
      toast.success('Coupon updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update coupon';
      toast.error(message);
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/coupons/${id}`);
      toast.success('Coupon deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete coupon';
      toast.error(message);
      throw new Error(message);
    }
  }
};

export default couponApi;
