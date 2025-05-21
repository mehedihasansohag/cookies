import { PlatformContextType } from './platformTypes';
import { PlanContextType } from './planTypes';
import { CouponContextType } from './couponTypes';
import { CredentialContextType } from './credentialTypes';
import { OrderContextType } from './orderTypes';
import { CookieContextType } from './cookieTypes';
import { NotificationContextType } from './notificationTypes';

export type Platform = {
  id: string;
  name: string;
  url: string;
  description: string;
  logo?: string;
  domain?: string;
  redirect?: string;
  slug?: string; // Adding slug field for platform identification
};

export type Plan = {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  platforms: string[]; // Array of platform IDs
  durationValue?: number;
  durationType?: DurationType;
  stickerText?: string;
  stickerColor?: string;
  showOnHomepage?: boolean;
  homepageOrder?: number; // New field to track the display order
};

export type Coupon = {
  id: string;
  code: string;
  discount: number;
  planId?: string;
  expirationDate?: string;
  active?: boolean; // Adding active property to match existing usage
};

export type Credential = {
  id: string;
  platformId: string;
  planId: string;
  username?: string;
  password?: string;
  email?: string;
  notes?: string;
  platform?: string; // Adding backward compatibility
  domain?: string; // Added domain field to match Cookie
  updatedAt?: string; // Added updatedAt field
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  date: string;
  expirationDate?: string;
  originalPrice: number;
  finalPrice: number;
  paymentMethod?: string;
  lastFourDigits: string;
  paymentLastFour?: string; // Adding for backward compatibility
  couponCode?: string;
  couponDiscount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'; // Adding 'cancelled' to match usage
};

export type Cookie = {
  id: string;
  platformId?: string;
  planId: string;
  name?: string;
  value?: string;
  domain?: string;
  path?: string;
  expirationDate?: string;
  updatedAt?: string; // Adding to match usage
  cookieData?: string; // Adding to match usage
  platform?: string; // For backward compatibility
  isPinned?: boolean; // Field to track pinned cookies
  pinnedAt?: string; // New field to track when cookie was pinned
  expires?: number;
};

export type NotificationPriority = 'high' | 'medium' | 'low';

export type Notification = {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  createdAt: string;
  isRead: boolean;
  expiresAt?: string;
};

// Combined DataContextType that includes all domain-specific interfaces
export type DataContextType = PlatformContextType &
  PlanContextType &
  CouponContextType &
  CredentialContextType &
  OrderContextType &
  CookieContextType &
  NotificationContextType;

// Add this section to the file to include all duration types used in the application
export type DurationType = "minutes" | "hours" | "days" | "weeks" | "months" | "years";
