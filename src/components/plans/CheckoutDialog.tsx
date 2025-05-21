
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PaymentDetailsSection from './checkout/PaymentDetailsSection';
import CouponSection from './checkout/CouponSection';
import OrderSummary from './checkout/OrderSummary';

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any;
  discountedPrice: number;
  discount: number;
  user: any;
  validateCoupon: (code: string, planId: string) => any;
  createOrder: (
    userId: string,
    userName: string,
    planId: string,
    planName: string,
    originalPrice: number,
    lastFourDigits: string,
    couponCode?: string,
    couponDiscount?: number
  ) => void;
}

const CheckoutDialog = ({
  isOpen,
  onOpenChange,
  plan,
  discountedPrice,
  discount,
  user,
  validateCoupon,
  createOrder
}: CheckoutDialogProps) => {
  const navigate = useNavigate();
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [localDiscount, setLocalDiscount] = useState(discount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const validateCouponCode = () => {
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    
    const validCoupon = validateCoupon(couponCode.trim(), plan?.id || '');
    
    if (validCoupon) {
      setLocalDiscount(validCoupon.discount);
      toast.success(`Coupon applied! ${validCoupon.discount}% discount`);
    } else {
      setLocalDiscount(0);
      setCouponError("Invalid or expired coupon code");
      toast.error("Invalid or expired coupon code");
    }
  };

  const handleCouponChange = (value: string) => {
    setCouponCode(value);
    if (localDiscount > 0) {
      // Reset discount if user changes coupon after validation
      setLocalDiscount(0);
      setCouponError(null);
    }
  };

  const handleSubmit = () => {
    if (!user || !plan) return;
    
    if (lastFourDigits.length !== 4 || !/^\d+$/.test(lastFourDigits)) {
      toast.error("Please enter the last 4 digits of your payment number");
      return;
    }

    // Verify coupon code is required
    if (!couponCode.trim()) {
      setCouponError("Coupon code is required to complete purchase");
      toast.error("Coupon code is required to complete purchase");
      return;
    }
    
    // Verify coupon code is valid
    const validCoupon = validateCoupon(couponCode.trim(), plan.id || '');
    if (!validCoupon) {
      setCouponError("Invalid or expired coupon code");
      toast.error("Invalid or expired coupon code");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create order
      createOrder(
        user.id,
        user.name,
        plan.id,
        plan.name,
        plan.price,
        lastFourDigits,
        couponCode.trim(),
        validCoupon.discount
      );
      
      onOpenChange(false);
      toast.success("Order submitted successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate the discounted price locally
  const calculatedPrice = localDiscount > 0
    ? plan?.price * (1 - localDiscount / 100)
    : plan?.price;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Fill in the required information to complete your purchase.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <PaymentDetailsSection 
            lastFourDigits={lastFourDigits}
            setLastFourDigits={setLastFourDigits}
          />
          
          <CouponSection 
            couponCode={couponCode}
            setCouponCode={handleCouponChange}
            couponError={couponError}
            localDiscount={localDiscount}
            validateCouponCode={validateCouponCode}
          />
          
          <OrderSummary 
            planPrice={plan?.price}
            localDiscount={localDiscount}
            calculatedPrice={calculatedPrice}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || lastFourDigits.length !== 4 || !couponCode.trim() || !localDiscount}
          >
            {isProcessing ? "Processing..." : "Complete Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
