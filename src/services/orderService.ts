
// Order-related service functions

import { Order, Plan, DurationType } from "@/types/dataTypes";
import { addDays, addHours, addMinutes, addMonths, addYears, format } from "date-fns";
import { formatService } from "./formatServices";

/**
 * Calculate the expiration date based on plan duration
 */
export const calculateExpirationDate = (purchaseDate: Date, plan: Plan): Date => {
  const { durationType, durationValue } = plan;
  
  switch(durationType as DurationType) {
    case 'minutes':
      return addMinutes(purchaseDate, durationValue || 0);
    case 'hours':
      return addHours(purchaseDate, durationValue || 0);
    case 'days':
      return addDays(purchaseDate, durationValue || 0);
    case 'weeks':
      return addDays(purchaseDate, (durationValue || 0) * 7);
    case 'months':
      return addMonths(purchaseDate, durationValue || 0);
    case 'years':
      return addYears(purchaseDate, durationValue || 0);
    default:
      // Default to 30 days if no valid duration type is provided
      return addDays(purchaseDate, 30);
  }
};

/**
 * Format the duration of a plan for display
 */
export const formatPlanDuration = (plan: Plan): string => {
  return formatService.formatPlanDuration(plan.durationType, plan.durationValue);
};

/**
 * Order service functions for managing orders
 */
export const orderService = {
  /**
   * Create a new order
   */
  createOrder: (
    orders: Order[],
    userId: string,
    userName: string,
    planId: string,
    planName: string,
    originalPrice: number,
    lastFourDigits: string,
    couponCode?: string,
    couponDiscount?: number,
    plan?: Plan
  ): Order => {
    // Ensure we have a coupon code and discount
    if (!couponCode || typeof couponDiscount !== 'number') {
      throw new Error('Coupon code and discount are required');
    }
    
    let finalPrice = originalPrice;
    
    // Apply discount from coupon
    finalPrice = originalPrice * (1 - couponDiscount / 100);
    
    // Set purchase date
    const purchaseDate = new Date();
    
    // Calculate expiration date based on plan duration if provided
    let expirationDate;
    if (plan) {
      expirationDate = calculateExpirationDate(purchaseDate, plan);
    } else {
      // Default to 30 days if no plan is provided
      expirationDate = addDays(purchaseDate, 30);
    }
    
    const newOrder = {
      id: crypto.randomUUID(),
      userId,
      userName,
      planId,
      planName,
      date: purchaseDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      lastFourDigits,
      couponCode,
      couponDiscount,
      originalPrice,
      finalPrice,
      status: 'pending' as const
    };
    
    return newOrder;
  },

  /**
   * Update order status
   */
  updateOrderStatus: (
    orders: Order[],
    orderId: string,
    status: Order['status']
  ): Order[] => {
    return orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
  },

  /**
   * Get order by ID
   */
  getOrder: (orders: Order[], id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  },

  /**
   * Get orders for a specific user
   */
  getUserOrders: (orders: Order[], userId: string): Order[] => {
    return orders.filter(o => o.userId === userId);
  },
  
  /**
   * Check if order subscription is expired
   */
  isOrderExpired: (order: Order): boolean => {
    if (!order.expirationDate) return false;
    const expirationDate = new Date(order.expirationDate);
    const currentDate = new Date();
    return currentDate > expirationDate;
  }
};
