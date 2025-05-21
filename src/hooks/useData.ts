
import { useDataContext } from './useDataContext';
import type { DataContextType } from '@/types/dataTypes';

// Re-export types for convenience
export type { 
  Platform, 
  Plan, 
  Coupon, 
  Credential, 
  Order, 
  Cookie, 
  DataContextType 
} from '@/types/dataTypes';

/**
 * Custom hook to use data context
 * @returns All data context values and methods
 */
export const useData = (): DataContextType => {
  return useDataContext();
};
