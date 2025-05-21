
// Cookie-related service functions

import { Cookie } from "@/types/dataTypes";

/**
 * Cookie service functions for managing cookies
 */
export const cookieService = {
  /**
   * Add a new cookie
   */
  addCookie: (cookies: Cookie[], cookie: Omit<Cookie, 'id'>): Cookie => {
    const newCookie = { 
      ...cookie, 
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      // Handle platformId from platform if not provided
      platformId: cookie.platformId || cookie.platform || '',
      // Ensure we have a default name and value if not provided
      name: cookie.name || `Cookie for ${cookie.platform || cookie.platformId || ''}`,
      value: cookie.value || cookie.cookieData || '',
      domain: cookie.domain || getSanitizedDomain(cookie.platformId || cookie.platform || ''), // Default domain if not provided
      isPinned: cookie.isPinned || false, // Initialize isPinned flag
      pinnedAt: cookie.isPinned ? new Date().toISOString() : undefined // Add pinnedAt timestamp
    };
    return newCookie;
  },

  /**
   * Update existing cookie if there are actual changes
   * Returns updated array if changes were made, original array otherwise
   */
  updateCookie: (cookies: Cookie[], cookie: Cookie): Cookie[] => {
    // Find the existing cookie
    const existingCookie = cookies.find(c => c.id === cookie.id);
    
    // If the cookie doesn't exist, no changes can be made
    if (!existingCookie) {
      return cookies;
    }
    
    // Check if there are actual changes by comparing relevant fields
    const hasChanges = 
      existingCookie.platform !== cookie.platform ||
      existingCookie.platformId !== cookie.platformId ||
      existingCookie.name !== cookie.name ||
      existingCookie.value !== cookie.value || 
      existingCookie.cookieData !== cookie.cookieData ||
      existingCookie.domain !== cookie.domain ||
      existingCookie.planId !== cookie.planId;
    
    // Don't consider isPinned changes for detecting actual data changes
    // Only update if there are actual content changes
    if (hasChanges) {
      const updatedCookie = {
        ...cookie,
        updatedAt: new Date().toISOString(),
        // Preserve pinned status and timestamp
        isPinned: existingCookie.isPinned,
        pinnedAt: existingCookie.pinnedAt
      };
      return cookies.map(c => c.id === cookie.id ? updatedCookie : c);
    }
    
    // Return original array if no changes
    return cookies;
  },

  /**
   * Delete cookie
   */
  deleteCookie: (cookies: Cookie[], id: string): Cookie[] => {
    return cookies.filter(c => c.id !== id);
  },

  /**
   * Get cookies for a plan
   */
  getCookiesForPlan: (cookies: Cookie[], planId: string): Cookie[] => {
    return cookies.filter(c => c.planId === planId);
  },

  /**
   * Toggle pinned status for a cookie
   */
  togglePinnedStatus: (cookies: Cookie[], id: string): Cookie[] => {
    return cookies.map(c => {
      if (c.id === id) {
        const isPinning = !c.isPinned;
        return { 
          ...c, 
          isPinned: isPinning,
          // Add pinned timestamp only when setting to pinned, otherwise remove it
          pinnedAt: isPinning ? new Date().toISOString() : undefined
        };
      }
      return c;
    });
  }
};

/**
 * Get a sanitized domain from a URL or platform name
 */
function getSanitizedDomain(platform: string): string {
  // Define specific mappings for common platforms
  const domainMap: Record<string, string> = {
    'udemy': 'udemy.com',
    'coursera': 'coursera.org',
    'skillshare': 'skillshare.com',
    'masterclass': 'masterclass.com',
    'canva': 'canva.com',
    'canva pro': 'canva.com',
    'grammarly': 'grammarly.com',
    'chatgpt': 'chat.openai.com',
    'quillbot': 'quillbot.com',
    'code academy': 'codecademy.com',
    'codecademy': 'codecademy.com',
    'udemy business': 'business.udemy.com',
    'coursera plus': 'coursera.org'
  };

  // Clean up platform name for domain
  const cleanPlatform = platform.toLowerCase().trim();
  
  // Return mapped domain or generate one based on platform name
  return domainMap[cleanPlatform] || `${cleanPlatform.replace(/\s+/g, '')}.com`;
}
