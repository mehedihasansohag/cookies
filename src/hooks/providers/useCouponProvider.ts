
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Coupon } from '@/types/dataTypes';
import { INITIAL_COUPONS } from '@/data/initialData';
import { couponService } from '@/services/couponService';

/**
 * Hook for managing coupon data
 */
export const useCouponProvider = () => {
  // Use our custom localStorage hook
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('accessVaultCoupons', INITIAL_COUPONS);

  // Coupon methods
  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const newCoupon = couponService.addCoupon(coupons, coupon);
    setCoupons([...coupons, newCoupon]);
  };

  const updateCoupon = (coupon: Coupon) => {
    setCoupons(couponService.updateCoupon(coupons, coupon));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(couponService.deleteCoupon(coupons, id));
  };

  const getCouponsForPlan = (planId: string) => {
    return couponService.getCouponsForPlan(coupons, planId);
  };

  const validateCoupon = (code: string, planId: string) => {
    return couponService.validateCoupon(coupons, code, planId);
  };

  return {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponsForPlan,
    validateCoupon
  };
};
