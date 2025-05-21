
// Platform-related service functions

import { Platform } from "@/types/dataTypes";

/**
 * Platform service functions for managing platforms
 */
export const platformService = {
  /**
   * Add a new platform
   */
  addPlatform: (platforms: Platform[], platform: Omit<Platform, 'id'>): Platform => {
    const newPlatform = { ...platform, id: crypto.randomUUID() };
    return newPlatform;
  },

  /**
   * Update existing platform
   */
  updatePlatform: (platforms: Platform[], platform: Platform): Platform[] => {
    return platforms.map(p => p.id === platform.id ? platform : p);
  },

  /**
   * Delete platform
   */
  deletePlatform: (platforms: Platform[], id: string): Platform[] => {
    return platforms.filter(p => p.id !== id);
  }
};
