
import { Coupon } from './dataTypes';

export interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<Coupon>;
  updateCoupon: (coupon: Coupon) => Promise<Coupon>;
  deleteCoupon: (id: string) => Promise<void>;
  getCouponsForPlan: (planId: string) => Promise<Coupon[]>;
  validateCoupon: (code: string, planId: string) => Promise<Coupon | null | undefined>;
}
