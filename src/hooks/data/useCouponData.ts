
import { useState } from 'react';
import { Coupon } from '@/types/dataTypes';
import couponApi from '@/services/api/couponApi';

export const useCouponData = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Coupon methods
  const addCoupon = async (coupon: Omit<Coupon, 'id'>) => {
    try {
      const newCoupon = await couponApi.create(coupon);
      setCoupons([...coupons, newCoupon]);
      return newCoupon;
    } catch (error) {
      console.error('Failed to add coupon:', error);
      throw error;
    }
  };

  const updateCoupon = async (coupon: Coupon) => {
    try {
      const updatedCoupon = await couponApi.update(coupon.id, coupon);
      setCoupons(coupons.map(c => c.id === coupon.id ? updatedCoupon : c));
      return updatedCoupon;
    } catch (error) {
      console.error('Failed to update coupon:', error);
      throw error;
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await couponApi.delete(id);
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete coupon:', error);
      throw error;
    }
  };

  const getCouponsForPlan = async (planId: string) => {
    try {
      const planCoupons = await couponApi.getByPlanId(planId);
      return planCoupons;
    } catch (error) {
      console.error('Failed to get coupons for plan:', error);
      return [];
    }
  };

  const validateCoupon = async (code: string, planId: string) => {
    try {
      const coupon = await couponApi.validateCoupon({ code, planId });
      return coupon || undefined;
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      return undefined;
    }
  };

  return {
    coupons,
    setCoupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponsForPlan,
    validateCoupon
  };
};
