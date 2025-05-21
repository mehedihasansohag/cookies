
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Order } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserOrders } = useData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const userOrders = await getUserOrders(user.id);
        console.log("my order",userOrders)
        setOrders(userOrders);
        
        setApprovedOrders(userOrders.filter(order => order.status === 'approved'));
        setPendingOrders(userOrders.filter(order => order.status === 'pending'));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, getUserOrders]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Please Login to Access Your Dashboard</h1>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.name}</p>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <DashboardContent 
          user={user} 
          orders={orders} 
          approvedOrders={approvedOrders} 
          pendingOrders={pendingOrders} 
        />
      )}
    </div>
  );
};

export default Dashboard;
