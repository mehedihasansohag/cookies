import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Cookie } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useAdminCookies = () => {
  const { cookies: allCookies, plans, addCookie, updateCookie, deleteCookie, togglePinnedStatus } = useData();
  const { planId: routePlanId } = useParams<{ planId: string }>();
  
  // Make sure we always keep all cookies available
  const cookies = sortCookies(allCookies);
  
  // State for form management
  const [isEditing, setIsEditing] = useState(false);
  const [currentCookieId, setCurrentCookieId] = useState('');
  const [originalCookie, setOriginalCookie] = useState<Cookie | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState(routePlanId || '');
  
  // Get viewed cookies from local storage
  const [viewedCookies, setViewedCookies] = useLocalStorage<Record<string, boolean>>("viewed_cookies", {});
  
  // Sort cookies by pinned status and pinnedAt date
  function sortCookies(cookieArray: Cookie[]): Cookie[] {
    return [...cookieArray].sort((a, b) => {
      // First sort by pinned status (pinned cookies first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // If both cookies are pinned, sort by pinnedAt (first pinned first)
      if (a.isPinned && b.isPinned) {
        // If pinnedAt is missing on either, use updatedAt as fallback
        const aTime = a.pinnedAt || a.updatedAt || '';
        const bTime = b.pinnedAt || b.updatedAt || '';
        
        // Older pinnedAt time means it was pinned first, so should appear first
        return new Date(aTime).getTime() - new Date(bTime).getTime();
      }
      
      // For unpinned cookies, sort by updatedAt (newest first)
      if (!a.updatedAt) return 1;
      if (!b.updatedAt) return -1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
  
  // Get current plan name if available
  const currentPlanName = routePlanId 
    ? plans.find(p => p.id === routePlanId)?.name 
    : undefined;
  
  // Handle cookie deletion
  const handleDeleteCookie = (id: string) => {
    if (confirm("Are you sure you want to delete this cookie?")) {
      deleteCookie(id);
      toast.success("Cookie deleted successfully");
      
      // Reset form if we're currently editing this cookie
      if (currentCookieId === id) {
        handleCancelEdit();
      }
    }
  };
  
  // Handle toggling pinned status - now using the data context's togglePinnedStatus
  const handleTogglePinned = (cookie: Cookie) => {
    togglePinnedStatus(cookie.id);
  };
  
  // Handle edit cookie action
  const handleEditCookie = (cookie: Cookie) => {
    setIsEditing(true);
    setCurrentCookieId(cookie.id);
    setOriginalCookie({...cookie});
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentCookieId('');
    setOriginalCookie(null);
  };
  
  // Handle save cookie (add or update)
  const handleSaveCookie = (cookieData: Partial<Cookie>) => {
    try {
      if (isEditing && currentCookieId && originalCookie) {
        // Update existing cookie
        const cookieToUpdate = allCookies.find(c => c.id === currentCookieId);
        if (cookieToUpdate) {
          const updatedCookie = {
            ...cookieToUpdate,
            ...cookieData,
            // Preserve pinned status and pinnedAt
            isPinned: cookieToUpdate.isPinned,
            pinnedAt: cookieToUpdate.pinnedAt
          };
          
          // Check if there are actual changes
          const hasChanges = 
            originalCookie.platform !== updatedCookie.platform ||
            originalCookie.cookieData !== updatedCookie.cookieData ||
            originalCookie.domain !== updatedCookie.domain ||
            originalCookie.planId !== updatedCookie.planId;
          
          if (hasChanges) {
            // Update cookie
            updateCookie(updatedCookie);
            
            // Reset cookie viewed state in localStorage
            const updatedViewedCookies = { ...viewedCookies };
            delete updatedViewedCookies[currentCookieId];
            setViewedCookies(updatedViewedCookies);
            
            toast.success("Cookie updated successfully");
          } else {
            toast.info("No changes detected");
          }
        }
      } else {
        // Add new cookie
        const newCookie = addCookie({
          platformId: cookieData.platform || '', // Use platform as platformId
          name: `Cookie for ${cookieData.platform}`, // Add required name
          value: cookieData.cookieData || '', // Set value to cookieData
          platform: cookieData.platform || '', // Keep platform for backward compatibility
          cookieData: cookieData.cookieData || '',
          domain: cookieData.domain || '',
          planId: cookieData.planId || '',
          updatedAt: new Date().toISOString(),
          isPinned: cookieData.isPinned || false, // Include the isPinned property
          // Add pinnedAt if cookie is pinned
          pinnedAt: cookieData.isPinned ? new Date().toISOString() : undefined
        });
        
        toast.success("Cookie added successfully");
      }
      
      // Reset form
      handleCancelEdit();
    } catch (error) {
      console.error("Error saving cookie:", error);
      toast.error("Failed to save cookie");
    }
  };
  
  return {
    cookies, // Return all cookies sorted
    plans,
    isEditing,
    currentCookie: isEditing && currentCookieId ? 
      allCookies.find(c => c.id === currentCookieId) || null : 
      null,
    selectedPlanId,
    currentPlanName,
    viewedCookies,
    handleDeleteCookie,
    handleEditCookie,
    handleSaveCookie,
    handleCancelEdit,
    handleTogglePinned
  };
};
