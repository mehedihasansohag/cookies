
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useExtensionStatus } from '@/hooks/useExtensionStatus';
import platformApi from '@/services/api/platformApi';

interface AccessButtonProps {
  slug?: string;
  platformName: string;
  className?: string;
}

export const AccessButton = ({ slug, platformName, className = '' }: AccessButtonProps) => {
  const { isInstalled: extensionInstalled } = useExtensionStatus();

  const handleAccess = async () => {
    if (!extensionInstalled) {
      toast.error('Please install the extension first');
      return;
    }

    if (!slug) {
      toast.error(`Platform slug is missing for ${platformName}`);
      return;
    }

    try {
      // First, fetch the latest cookies for the platform
      const platformData = await platformApi.getLatestCookies(slug);

      // Get JWT token from localStorage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }

      // Send message to Chrome extension
      window.postMessage({
        type: "MASTER_TOOLS_ACCESS_PLATFORM",
        payload: {
          platform: slug,
          token,
          platformData
        }
      }, "*");

      toast.success(`Accessing ${platformName}...`);
    } catch (error) {
      console.error('Failed to access platform:', error);
      toast.error(`Failed to access ${platformName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Button 
      onClick={handleAccess} 
      className={`w-full ${className}`}
      disabled={!extensionInstalled}
    >
      Access {platformName} Now
      {!extensionInstalled && (
        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
          Extension Required
        </span>
      )}
    </Button>
  );
};
