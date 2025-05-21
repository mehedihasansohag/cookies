
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Platform } from '@/types/dataTypes';
import { INITIAL_PLATFORMS } from '@/data/initialData';
import { platformService } from '@/services/platformService';

/**
 * Hook for managing platform data
 */
export const usePlatformProvider = () => {
  // Use our custom localStorage hook
  const [platforms, setPlatforms] = useLocalStorage<Platform[]>('accessVaultPlatforms', INITIAL_PLATFORMS);

  // Platform methods
  const addPlatform = (platform: Omit<Platform, 'id'>) => {
    const newPlatform = platformService.addPlatform(platforms, platform);
    setPlatforms([...platforms, newPlatform]);
  };

  const updatePlatform = (platform: Platform) => {
    setPlatforms(platformService.updatePlatform(platforms, platform));
  };

  const deletePlatform = (id: string) => {
    setPlatforms(platformService.deletePlatform(platforms, id));
  };

  return {
    platforms,
    addPlatform,
    updatePlatform,
    deletePlatform
  };
};
