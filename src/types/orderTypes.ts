
import { Order } from './dataTypes';

export interface OrderContextType {
  orders: Order[];
  createOrder: (
    userId: string,
    userName: string,
    planId: string,
    planName: string,
    originalPrice: number,
    lastFourDigits: string,
    couponCode?: string,
    couponDiscount?: number
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<Order>;
  getOrder: (id: string) => Promise<Order | undefined>;
  getUserOrders: (userId: string) => Promise<Order[]>;
}
