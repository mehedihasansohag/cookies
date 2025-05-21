
// Coupon-related service functions

import { Coupon } from "@/types/dataTypes";

/**
 * Coupon service functions for managing coupons
 */
export const couponService = {
  /**
   * Add a new coupon
   */
  addCoupon: (coupons: Coupon[], coupon: Omit<Coupon, 'id'>): Coupon => {
    const newCoupon = { ...coupon, id: crypto.randomUUID() };
    return newCoupon;
  },

  /**
   * Update existing coupon
   */
  updateCoupon: (coupons: Coupon[], coupon: Coupon): Coupon[] => {
    return coupons.map(c => c.id === coupon.id ? coupon : c);
  },

  /**
   * Delete coupon
   */
  deleteCoupon: (coupons: Coupon[], id: string): Coupon[] => {
    return coupons.filter(c => c.id !== id);
  },

  /**
   * Get coupons for a specific plan
   */
  getCouponsForPlan: (coupons: Coupon[], planId: string): Coupon[] => {
    return coupons.filter(c => c.planId === planId && (c.active === undefined || c.active === true));
  },

  /**
   * Validate a coupon code
   */
  validateCoupon: (coupons: Coupon[], code: string, planId: string): Coupon | null => {
    const coupon = coupons.find(c => c.code === code && c.planId === planId && (c.active === undefined || c.active === true));
    return coupon || null;
  }
};
