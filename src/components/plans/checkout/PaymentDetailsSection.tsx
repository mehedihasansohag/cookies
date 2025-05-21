
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentDetailsSectionProps {
  lastFourDigits: string;
  setLastFourDigits: (value: string) => void;
}

const PaymentDetailsSection = ({ 
  lastFourDigits, 
  setLastFourDigits 
}: PaymentDetailsSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-2 w-full">
      <label htmlFor="last-four" className={`text-sm font-medium ${isMobile ? 'block' : ''}`}>
        Last 4 Digits of Payment Card <span className="text-red-500">*</span>
      </label>
      <Input
        id="last-four"
        value={lastFourDigits}
        onChange={e => setLastFourDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder="e.g., 1234"
        maxLength={4}
        required
        className="w-full"
      />
      {lastFourDigits && (lastFourDigits.length !== 4 || !/^\d+$/.test(lastFourDigits)) && (
        <p className="text-sm text-red-500 mt-1">Please enter exactly 4 digits</p>
      )}
    </div>
  );
};

export default PaymentDetailsSection;
