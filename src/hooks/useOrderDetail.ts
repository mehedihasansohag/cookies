
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Order } from '@/contexts/DataContext';
import { User } from '@/types/auth';

interface UseOrderDetailProps {
  id: string | undefined;
}

interface UseOrderDetailReturn {
  order: Order | null;
  orderUser: any;
  plan: any;
  isLoading: boolean;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
  handleStatusChange: (newStatus: Order['status']) => Promise<void>;
}

export const useOrderDetail = ({ id }: UseOrderDetailProps): UseOrderDetailReturn => {
  const { user, isAdmin, isManager, isSupport, getUserById } = useAuth();
  const { orders, getOrder, plans, updateOrderStatus } = useData();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderUser, setOrderUser] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Validate user role - only admin, manager, or support can access
    if (!user || (!isAdmin && !isManager && !isSupport)) {
      navigate('/login');
      return;
    }
    
    if (!id) return;
    
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      
      // Get the order
      const foundOrder = await getOrder(id);
      
      if (!foundOrder) {
        // Redirect based on user role
        if (isAdmin || isManager || isSupport) {
          navigate('/admin/orders');
        } else {
          navigate('/dashboard');
        }
        return;
      }
      
      setOrder(foundOrder);
      
      // Get the plan
      const foundPlan = plans.find(p => p.id === foundOrder.planId);
      setPlan(foundPlan || null);
      
      // Get the user
      const foundUser = getUserById(foundOrder.userId);
      setOrderUser(foundUser || null);
      
      setIsLoading(false);
    };
    
    fetchOrderDetails();
    
    // Set up a listener to handle order updates from other tabs/devices
    const handleOrdersUpdate = async () => {
      if (id) {
        const updatedOrder = await getOrder(id);
        if (updatedOrder) setOrder(updatedOrder);
      }
    };
    
    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    window.addEventListener('storage', handleOrdersUpdate);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
      window.removeEventListener('storage', handleOrdersUpdate);
    };
  }, [user, isAdmin, isManager, isSupport, id, navigate, getOrder, plans, getUserById]);

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order || !id) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      
      // Update local state
      const updatedOrder = await getOrder(id);
      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    order,
    orderUser,
    plan,
    isLoading,
    isUpdating,
    setIsUpdating,
    handleStatusChange
  };
};
