
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderSummaryProps {
  planPrice: number;
  localDiscount: number;
  calculatedPrice: number;
}

const OrderSummary = ({ 
  planPrice, 
  localDiscount, 
  calculatedPrice 
}: OrderSummaryProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`pt-2 border-t w-full ${isMobile ? 'mt-4' : ''}`}>
      <div className="flex justify-between mb-1">
        <span className="text-sm">Plan price:</span>
        <span className="text-sm font-medium">${planPrice?.toFixed(2)}</span>
      </div>
      
      {localDiscount > 0 && (
        <div className="flex justify-between mb-1">
          <span className="text-sm">Discount ({localDiscount}%):</span>
          <span className="text-sm font-medium text-green-600">
            -${(planPrice * localDiscount / 100).toFixed(2)}
          </span>
        </div>
      )}
      
      <div className="flex justify-between pt-2 mt-2 border-t">
        <span className={`font-medium ${isMobile ? 'text-base' : ''}`}>Total:</span>
        <span className={`font-bold ${isMobile ? 'text-lg' : ''}`}>${calculatedPrice?.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
