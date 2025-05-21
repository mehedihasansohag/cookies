
import { useState } from 'react';
import { Platform } from '@/types/dataTypes';
import platformApi from '@/services/api/platformApi';
import { toast } from '@/components/ui/sonner';

export const usePlatformData = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlatforms = async () => {
    try {
      setLoading(true);
      const fetchedPlatforms = await platformApi.getAll();
      setPlatforms(fetchedPlatforms);
      return fetchedPlatforms;
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
      toast.error('Failed to load platforms');
    } finally {
      setLoading(false);
    }
  };

  // Platform methods
  const addPlatform = async (platform: Omit<Platform, 'id'>) => {
    try {
      const newPlatform = await platformApi.create(platform);
      setPlatforms([...platforms, newPlatform]);
      return newPlatform;
    } catch (error) {
      console.error('Failed to add platform:', error);
      throw error;
    }
  };

  const updatePlatform = async (platform: Platform) => {
    try {
      const updatedPlatform = await platformApi.update(platform.id, platform);
      setPlatforms(platforms.map(p => p.id === platform.id ? updatedPlatform : p));
      return updatedPlatform;
    } catch (error) {
      console.error('Failed to update platform:', error);
      throw error;
    }
  };

  const deletePlatform = async (id: string) => {
    try {
      await platformApi.delete(id);
      setPlatforms(platforms.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete platform:', error);
      throw error;
    }
  };

  const getLatestCookiesForPlatform = async (platformSlug: string) => {
    try {
      return await platformApi.getLatestCookies(platformSlug);
    } catch (error) {
      console.error('Failed to get latest cookies:', error);
      throw error;
    }
  };

  return {
    platforms,
    setPlatforms,
    loading,
    fetchPlatforms,
    addPlatform,
    updatePlatform,
    deletePlatform,
    getLatestCookiesForPlatform
  };
};
