
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Cookie } from '@/types/dataTypes';
import { cookieService } from '@/services/cookieService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

/**
 * Hook for managing cookie data
 */
export const useCookieProvider = () => {
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  
  // Use our custom localStorage hook with user-specific keys
  const [cookies, setCookies] = useLocalStorage<Cookie[]>('accessVaultCookies', []);
  // Track viewed cookies with user-specific keys
  const [viewedCookies, setViewedCookies] = useLocalStorage<Record<string, boolean>>(
    `viewed_cookies_${userId}`, 
    {}
  );

  // Sort cookies function
  const sortCookies = (cookieArray: Cookie[]): Cookie[] => {
    return [...cookieArray].sort((a, b) => {
      // First sort by pinned status (pinned cookies first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // If both cookies are pinned, sort by pinnedAt (first pinned first)
      if (a.isPinned && b.isPinned) {
        // If pinnedAt is available on both, use it for sorting
        if (a.pinnedAt && b.pinnedAt) {
          // Earlier pinnedAt timestamp should appear first
          return new Date(a.pinnedAt).getTime() - new Date(b.pinnedAt).getTime();
        }
      }
      
      // For unpinned cookies or if pinnedAt not available, sort by updatedAt (newest first)
      if (!a.updatedAt) return 1;
      if (!b.updatedAt) return -1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  // Cookie methods
  const addCookie = (cookie: Omit<Cookie, 'id'>) => {
    const newCookie = cookieService.addCookie(cookies, cookie);
    
    // Add the cookie and sort the array
    const updatedCookies = sortCookies([...cookies, newCookie]);
    
    setCookies(updatedCookies);
    return newCookie;
  };

  const updateCookie = (cookie: Cookie) => {
    // Update cookie
    const updatedCookies = cookieService.updateCookie(cookies, cookie);
    
    // If cookie was actually updated (array reference changed), reset its viewed state
    if (updatedCookies !== cookies) {
      // Reset the viewed state for this cookie for all users
      const updatedViewedCookies = { ...viewedCookies };
      delete updatedViewedCookies[cookie.id];
      setViewedCookies(updatedViewedCookies);
      
      // Sort the updated cookies with our custom sorting
      const sortedCookies = sortCookies([...updatedCookies]);
      
      setCookies(sortedCookies);
      return sortedCookies;
    }
    
    setCookies(updatedCookies);
    return updatedCookies;
  };

  const togglePinnedStatus = (id: string) => {
    // Toggle pinned status using the cookieService
    const updatedCookies = cookieService.togglePinnedStatus(cookies, id);
    
    // Sort cookies with our custom sorting logic and update state
    const sortedCookies = sortCookies([...updatedCookies]);
    setCookies(sortedCookies);
    
    // Show appropriate toast notification
    const isPinned = sortedCookies.find(c => c.id === id)?.isPinned;
    if (isPinned) {
      toast.success("Cookie pinned to top of the list.");
    } else {
      toast.success("Cookie unpinned.");
    }
    
    return sortedCookies;
  };

  const deleteCookie = (id: string) => {
    // Delete cookie
    const updatedCookies = cookieService.deleteCookie(cookies, id);
    setCookies(updatedCookies);
    
    // Clean up the viewed state for this cookie
    const updatedViewedCookies = { ...viewedCookies };
    delete updatedViewedCookies[id];
    setViewedCookies(updatedViewedCookies);
    
    return updatedCookies;
  };

  const getCookiesForPlan = (planId: string) => {
    const planCookies = cookieService.getCookiesForPlan(cookies, planId);
    // Sort cookies with our custom sorting
    return sortCookies(planCookies);
  };

  return {
    cookies,
    addCookie,
    updateCookie,
    deleteCookie,
    getCookiesForPlan,
    togglePinnedStatus
  };
};
