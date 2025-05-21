
import { useDataContext } from './useDataContext';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/dataTypes';

export const useOrders = () => {
  const {
    orders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders
  } = useDataContext();
  
  const isOrderExpired = async (orderId: string) => {
    const order = await getOrder(orderId);
    if (!order) return false;
    return orderService.isOrderExpired(order);
  };
  
  return {
    orders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders,
    isOrderExpired
  };
};
