
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OrderSummary } from '@/components/admin/OrderSummary';
import { OrderActions } from '@/components/admin/OrderActions';
import { OrderDetailHeader } from '@/components/admin/OrderDetailHeader';
import OrderNotFound from '@/components/admin/OrderNotFound';
import { useOrderDetail } from '@/hooks/useOrderDetail';
import { formatDate } from '@/utils/formatUtils';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin, isManager, isSupport } = useAuth();
  const navigate = useNavigate();
  
  const {
    order,
    orderUser,
    plan,
    isLoading,
    isUpdating,
    handleStatusChange
  } = useOrderDetail({ id });

  // Check authentication
  React.useEffect(() => {
    // Only allow admin, manager, or support roles
    if (!user || (!isAdmin && !isManager && !isSupport)) {
      navigate('/login');
      return;
    }
  }, [user, isAdmin, isManager, isSupport, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return <OrderNotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <OrderDetailHeader 
        order={order} 
        isLoading={isLoading} 
      />
      
      {/* Back to Admin Dashboard Button */}
      <BackToAdminButton />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-2 space-y-6">
          <OrderSummary 
            order={order} 
            plan={plan} 
            formatDate={formatDate} 
            orderUser={orderUser} 
          />
        </div>
        
        {/* Order Actions */}
        <div>
          <OrderActions 
            order={order}
            isUpdating={isUpdating}
            handleStatusChange={handleStatusChange}
            plan={plan}
            orderUser={orderUser}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
