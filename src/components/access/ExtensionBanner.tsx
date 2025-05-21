
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { ExtensionBannerProps } from '@/types/access';

export const ExtensionBanner = ({ extensionInstalled, hasCookies, activeTab }: ExtensionBannerProps) => {
  // Function to download the extension
  const handleDownloadExtension = () => {
    // Create a blob URL for the extension zip file
    const downloadUrl = '/master-tools-extension.zip';
    
    // Create a temporary link to download the file
    const tempLink = document.createElement('a');
    tempLink.href = downloadUrl;
    tempLink.setAttribute('download', 'master-tools-extension.zip');
    tempLink.click();
    
    toast.success('Extension download started. After installation, please follow the instructions below.');
  };

  // Don't show banner if extension is installed, there are no cookies, or we're not on the cookies tab
  if (extensionInstalled || !hasCookies || activeTab !== 'cookies') {
    return null;
  }

  return (
    <div className="mb-8 flex justify-end">
      <Button 
        onClick={handleDownloadExtension}
        className="whitespace-nowrap"
      >
        <Download className="mr-2 h-4 w-4" /> Download Extension
      </Button>
    </div>
  );
};
