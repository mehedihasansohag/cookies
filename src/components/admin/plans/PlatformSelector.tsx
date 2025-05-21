
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Platform } from '@/types/dataTypes';

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  togglePlatform: (platformId: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  platforms,
  selectedPlatforms,
  togglePlatform
}) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Included Platforms</p>
      <div className="grid grid-cols-2 gap-2">
        {platforms.map(platform => (
          <div key={platform.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`platform-${platform.id}`}
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => togglePlatform(platform.id)}
            />
            <label 
              htmlFor={`platform-${platform.id}`}
              className="text-sm cursor-pointer"
            >
              {platform.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
