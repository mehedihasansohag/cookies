
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/sonner';

export const usePlanDetail = (planId: string | undefined) => {
  const { user } = useAuth();
  const { plans, platforms, validateCoupon, createOrder } = useData();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platformNames, setPlatformNames] = useState<string[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!planId) return;
    
    const foundPlan = plans.find(p => p.id === planId);
    
    if (foundPlan) {
      setPlan(foundPlan);
      
      // Get platform names
      const names = foundPlan.platforms
        .map((platformId: string) => platforms.find(p => p.id === platformId)?.name)
        .filter(Boolean) as string[];
        
      setPlatformNames(names);
    }
    
    setIsLoading(false);
  }, [planId, plans, platforms]);

  // Format duration for display
  const formatDuration = (plan: any): string => {
    if (!plan?.durationType || !plan?.durationValue) {
      return "per month"; // Default fallback
    }

    if (plan.durationValue === 1) {
      // Singular form (e.g., "per day" instead of "per days")
      return `per ${plan.durationType.slice(0, -1)}`;
    }
    
    return `per ${plan.durationValue} ${plan.durationType}`;
  };

  const handleBuyNow = () => {
    if (!user) {
      // Redirect to login if not authenticated
      toast.error("Please log in to purchase a plan");
      navigate('/login');
      return;
    }
    
    setIsCheckoutOpen(true);
  };

  // Calculate the discounted price
  const discountedPrice = discount > 0
    ? plan?.price * (1 - discount / 100)
    : plan?.price;

  return {
    isLoading,
    plan,
    platformNames,
    isCheckoutOpen,
    setIsCheckoutOpen,
    discount,
    setDiscount,
    discountedPrice,
    formatDuration,
    handleBuyNow,
    user,
    validateCoupon,
    createOrder
  };
};
