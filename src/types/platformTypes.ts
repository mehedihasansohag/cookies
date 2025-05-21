
import { Platform } from './dataTypes';

export interface PlatformContextType {
  platforms: Platform[];
  addPlatform: (platform: Omit<Platform, 'id'>) => Promise<Platform>;
  updatePlatform: (platform: Platform) => Promise<Platform>;
  deletePlatform: (id: string) => Promise<void>;
}
