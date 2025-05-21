
import { useParams } from 'react-router-dom';
import { usePlanDetail } from '@/hooks/usePlanDetail';
import PlanDetailsSection from '@/components/plans/PlanDetailsSection';
import PlanPurchaseSidebar from '@/components/plans/PlanPurchaseSidebar';
import CheckoutDialog from '@/components/plans/CheckoutDialog';
import { Button } from '@/components/ui/button';

const PlanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    isLoading,
    plan,
    platformNames,
    isCheckoutOpen,
    setIsCheckoutOpen,
    discount,
    discountedPrice,
    formatDuration,
    handleBuyNow,
    user,
    validateCoupon,
    createOrder
  } = usePlanDetail(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading plan details...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
        <p className="mb-4">The plan you are looking for does not exist.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan Details Section */}
        <PlanDetailsSection 
          plan={plan} 
          platformNames={platformNames} 
          formatDuration={formatDuration} 
        />
        
        {/* Purchase Sidebar */}
        <PlanPurchaseSidebar 
          plan={plan} 
          platformNames={platformNames} 
          formatDuration={formatDuration} 
          onBuyNow={handleBuyNow} 
        />
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        plan={plan}
        discountedPrice={discountedPrice}
        discount={discount}
        user={user}
        validateCoupon={validateCoupon}
        createOrder={createOrder}
      />
    </div>
  );
};

export default PlanDetail;
