
import { DataContextType } from '@/types/dataTypes';
import { useEffect } from 'react';
import { usePlatformData } from './data/usePlatformData';
import { usePlanData } from './data/usePlanData';
import { useCouponData } from './data/useCouponData';
import { useCredentialData } from './data/useCredentialData';
import { useOrderData } from './data/useOrderData';
import { useCookieData } from './data/useCookieData';
import { useNotificationData } from './data/useNotificationData';
import platformApi from '@/services/api/platformApi';
import planApi from '@/services/api/planApi';

export const useDataProvider = (): DataContextType => {
  // Use the individual data hooks
  const platformData = usePlatformData();
  const planData = usePlanData();
  const couponData = useCouponData();
  const credentialData = useCredentialData();
  const orderData = useOrderData();
  const cookieData = useCookieData();
  const notificationData = useNotificationData();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load platforms
        const platformsData = await platformApi.getAll();
        platformData.setPlatforms(platformsData);
        
        // Load plans
        const plansData = await planApi.getAll();
        planData.setPlans(plansData);
        
        // We'll load other data as needed
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  // Combine all the data and methods from the individual hooks
  return {
    // Platform data
    platforms: platformData.platforms,
    addPlatform: platformData.addPlatform,
    updatePlatform: platformData.updatePlatform,
    deletePlatform: platformData.deletePlatform,

    // Plan data
    plans: planData.plans,
    addPlan: planData.addPlan,
    updatePlan: planData.updatePlan,
    deletePlan: planData.deletePlan,
    getPlanById: planData.getPlanById,
    formatPlanDuration: planData.formatPlanDuration,

    // Coupon data
    coupons: couponData.coupons,
    addCoupon: couponData.addCoupon,
    updateCoupon: couponData.updateCoupon,
    deleteCoupon: couponData.deleteCoupon,
    getCouponsForPlan: couponData.getCouponsForPlan,
    validateCoupon: couponData.validateCoupon,

    // Credential data
    credentials: credentialData.credentials,
    addCredential: credentialData.addCredential,
    updateCredential: credentialData.updateCredential,
    deleteCredential: credentialData.deleteCredential,
    getCredentialsForPlan: credentialData.getCredentialsForPlan,

    // Order data
    orders: orderData.orders,
    createOrder: orderData.createOrder,
    updateOrderStatus: orderData.updateOrderStatus,
    getOrder: orderData.getOrder,
    getUserOrders: orderData.getUserOrders,

    // Cookie data
    cookies: cookieData.cookies,
    addCookie: cookieData.addCookie,
    updateCookie: cookieData.updateCookie,
    deleteCookie: cookieData.deleteCookie,
    getCookiesForPlan: cookieData.getCookiesForPlan,
    togglePinnedStatus: cookieData.togglePinnedStatus,

    // Notification data
    notifications: notificationData.notifications,
    addNotification: notificationData.addNotification,
    updateNotification: notificationData.updateNotification,
    deleteNotification: notificationData.deleteNotification,
    markNotificationAsRead: notificationData.markNotificationAsRead,
  };
};
