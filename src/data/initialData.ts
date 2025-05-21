import { Platform, Plan, Coupon, Credential } from '@/types/dataTypes';

// Sample data
export const INITIAL_PLATFORMS: Platform[] = [
  { id: '1', name: 'Coursera', logo: '/placeholder.svg', url: 'https://coursera.org', description: 'Online learning platform' },
  { id: '2', name: 'Udemy', logo: '/placeholder.svg', url: 'https://udemy.com', description: 'Online course marketplace' },
  { id: '3', name: 'Pluralsight', logo: '/placeholder.svg', url: 'https://pluralsight.com', description: 'Technical training platform' },
  { id: '4', name: 'LinkedIn Learning', logo: '/placeholder.svg', url: 'https://linkedin.com/learning', description: 'Professional skill development' },
  { id: '5', name: 'Skillshare', logo: '/placeholder.svg', url: 'https://skillshare.com', description: 'Creative skills community' },
  { id: '6', name: 'MasterClass', logo: '/placeholder.svg', url: 'https://masterclass.com', description: 'Classes taught by experts' },
];

export const INITIAL_PLANS: Plan[] = [
  { 
    id: '1', 
    name: 'Basic Developer Pack', 
    description: 'Access to basic programming courses', 
    price: 29.99, 
    platforms: ['2', '3'],
    stickerText: 'Popular',
    stickerColor: '#8B5CF6',
    durationType: 'months',
    durationValue: 1,
    showOnHomepage: true
  },
  { 
    id: '2', 
    name: 'Premium Learning Bundle', 
    description: 'Comprehensive access to top learning platforms', 
    price: 49.99, 
    platforms: ['1', '2', '4'],
    stickerText: 'Featured',
    stickerColor: '#F59E0B',
    durationType: 'months',
    durationValue: 3,
    showOnHomepage: true
  },
  { 
    id: '3', 
    name: 'Creative Pro Package', 
    description: 'Perfect for designers and creative professionals', 
    price: 39.99, 
    platforms: ['5', '6'], 
    durationType: 'months',
    durationValue: 1,
    showOnHomepage: true
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: '1', planId: '1', code: 'DEV10', discount: 10, active: true },
  { id: '2', planId: '2', code: 'BUNDLE20', discount: 20, active: true },
  { id: '3', planId: '3', code: 'CREATIVE15', discount: 15, active: true },
];

export const INITIAL_CREDENTIALS: Credential[] = [
  { 
    id: '1', 
    planId: '1', 
    platformId: 'Udemy', 
    platform: 'Udemy', 
    username: 'basicdev@example.com', 
    password: 'password123' 
  },
  { 
    id: '2', 
    planId: '1', 
    platformId: 'Pluralsight', 
    platform: 'Pluralsight', 
    username: 'basicdev@example.com', 
    password: 'password123' 
  },
  { 
    id: '3', 
    planId: '2', 
    platformId: 'Coursera', 
    platform: 'Coursera', 
    username: 'premiumbundle@example.com', 
    password: 'password456' 
  },
  { 
    id: '4', 
    planId: '2', 
    platformId: 'Udemy', 
    platform: 'Udemy', 
    username: 'premiumbundle@example.com', 
    password: 'password456' 
  },
  { 
    id: '5', 
    planId: '3', 
    platformId: 'Skillshare', 
    platform: 'Skillshare', 
    username: 'creativepro@example.com', 
    password: 'password789' 
  },
];
