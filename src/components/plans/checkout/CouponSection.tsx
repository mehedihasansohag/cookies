
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
  couponError: string | null;
  localDiscount: number;
  validateCouponCode: () => void;
}

const CouponSection = ({
  couponCode,
  setCouponCode,
  couponError,
  localDiscount,
  validateCouponCode
}: CouponSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <label htmlFor="coupon" className="text-sm font-medium">
          Coupon Code <span className="text-red-500">*</span>
        </label>
        <Button 
          variant="ghost" 
          size={isMobile ? "default" : "sm"} 
          type="button" 
          onClick={validateCouponCode} 
          disabled={!couponCode.trim()}
        >
          Apply
        </Button>
      </div>
      <Input
        id="coupon"
        value={couponCode}
        onChange={e => setCouponCode(e.target.value)}
        placeholder="Enter coupon code"
        className="w-full"
        required
      />
      {couponError && (
        <p className="text-sm text-red-500 mt-1">{couponError}</p>
      )}
      {localDiscount > 0 && (
        <p className="text-sm text-green-600 mt-1">Coupon applied: {localDiscount}% off</p>
      )}
    </div>
  );
};

export default CouponSection;
