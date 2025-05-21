
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Order, Plan } from '@/types/dataTypes';
import { orderService } from '@/services/orderService';

/**
 * Hook for managing order data
 */
export const useOrderProvider = (planProvider: {
  getPlanById: (id: string) => Plan | undefined;
}) => {
  // Use our custom localStorage hook
  const [orders, setOrders] = useLocalStorage<Order[]>('accessVaultOrders', []);

  // Order methods
  const createOrder = (
    userId: string, 
    userName: string, 
    planId: string, 
    planName: string,
    originalPrice: number,
    lastFourDigits: string, 
    couponCode?: string,
    couponDiscount?: number
  ) => {
    // Get the plan to calculate expiration date based on duration
    const plan = planProvider.getPlanById(planId);
    
    const newOrder = orderService.createOrder(
      orders, userId, userName, planId, planName, 
      originalPrice, lastFourDigits, couponCode, couponDiscount, plan
    );
    
    setOrders([...orders, newOrder]);
    
    // Broadcast that we've made a change to orders
    const event = new CustomEvent('ordersUpdated', { detail: { orders: [...orders, newOrder] } });
    window.dispatchEvent(event);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orderService.updateOrderStatus(orders, orderId, status);
    setOrders(updatedOrders);
    
    // Broadcast the change
    const event = new CustomEvent('ordersUpdated', { detail: { orders: updatedOrders } });
    window.dispatchEvent(event);
  };

  const getOrder = (id: string): Order | undefined => {
    return orderService.getOrder(orders, id);
  };

  const getUserOrders = (userId: string) => {
    return orderService.getUserOrders(orders, userId);
  };

  return {
    orders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders
  };
};
