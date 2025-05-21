
import { useState } from 'react';
import { Order } from '@/types/dataTypes';
import orderApi from '@/services/api/orderApi';

export const useOrderData = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Order methods
  const createOrder = async (
    userId: string,
    userName: string,
    planId: string,
    planName: string,
    originalPrice: number,
    lastFourDigits: string,
    couponCode?: string,
    couponDiscount?: number
  ) => {
    try {
      const orderData = {
        planId,
        originalPrice,
        lastFourDigits,
        couponCode,
        couponDiscount
      };
      
      const newOrder = await orderApi.create(orderData);
      setOrders([...orders, newOrder]);
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await orderApi.updateStatus(orderId, { status });
      const updatedOrders = orders.map(o => o.id === orderId ? updatedOrder : o);
      setOrders(updatedOrders);
      return updatedOrder;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  };

  const getOrder = async (id: string) => {
    try {
      return await orderApi.getById(id);
    } catch (error) {
      console.error('Failed to get order:', error);
      return undefined;
    }
  };

  const getUserOrders = async (userId: string) => {
    try {
      return await orderApi.getUserOrders();
    } catch (error) {
      console.error('Failed to get user orders:', error);
      return [];
    }
  };

  return {
    orders,
    setOrders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders
  };
};
