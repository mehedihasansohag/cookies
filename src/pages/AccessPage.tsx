
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AccessPageHeader } from '@/components/access/AccessPageHeader';
import { AccessPageTabs } from '@/components/access/AccessPageTabs';
import { ExtensionBanner } from '@/components/access/ExtensionBanner';
import { ExtensionStatus } from '@/components/access/ExtensionStatus';
import { EmptyAccessContent } from '@/components/access/EmptyAccessContent';
import { LoginCredentials } from '@/components/access/LoginCredentials';
import { CookieCredentials } from '@/components/access/CookieCredentials';
import { ImportantNotes } from '@/components/access/ImportantNotes';
import { useExtensionStatus } from '@/hooks/useExtensionStatus';
import { useAccessData } from '@/hooks/useAccessData';
import { useClipboard } from '@/hooks/useClipboard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { getPlatformUrl, getPlatformDomain } from '@/components/access/utils';
import { Cookie } from '@/types/access'; // Added Cookie type import

const AccessPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const [activeTab, setActiveTab] = useState("login");
  
  // Get current user
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  
  // Use our custom hooks
  const { isInstalled: extensionInstalled, statusMessage: extensionStatus, handleDirectAccess: handleDirectAccessBase } = useExtensionStatus();
  const { isLoading, order, plan, credentials, cookies: unsortedCookies } = useAccessData(planId);
  const { copyToClipboard } = useClipboard();
  const { cookies: allCookies } = useData();

  // Use userId-specific localStorage keys for viewed cookies
  const [viewedCookies, setViewedCookies] = useLocalStorage<Record<string, boolean>>(
    `viewed_cookies_${userId}`, 
    {}
  );

  // Use userId-specific localStorage keys for showing tutorials - separate for each tab
  const [showLoginTutorials, setShowLoginTutorials] = useLocalStorage<boolean>(
    `show_login_tutorials_${userId}`,
    true
  );
  
  const [showCookieTutorials, setShowCookieTutorials] = useLocalStorage<boolean>(
    `show_cookie_tutorials_${userId}`,
    true
  );

  // Toggle functions for showing tutorials
  const toggleShowLoginTutorials = () => {
    setShowLoginTutorials(prev => !prev);
  };
  
  const toggleShowCookieTutorials = () => {
    setShowCookieTutorials(prev => !prev);
  };

  // Create a map of cookie IDs to their full cookie object from the data context
  // to get access to isPinned property and pinnedAt timestamp
  const cookieDetailsMap = useMemo(() => {
    const map = new Map();
    allCookies.forEach(cookie => {
      map.set(cookie.id, cookie);
    });
    return map;
  }, [allCookies]);
  
  // Sort cookies by pinned status and pinnedAt timestamp (first pinned at the top)
  const cookies = useMemo(() => {
    return [...unsortedCookies].sort((a, b) => {
      const cookieA = cookieDetailsMap.get(a.id);
      const cookieB = cookieDetailsMap.get(b.id);
      
      // First, sort by pinned status (pinned first)
      if (cookieA?.isPinned && !cookieB?.isPinned) return -1;
      if (!cookieA?.isPinned && cookieB?.isPinned) return 1;
      
      // If both are pinned, sort by pinnedAt timestamp (earliest pinned first)
      if (cookieA?.isPinned && cookieB?.isPinned) {
        // If pinnedAt is available on both, use it for sorting
        if (cookieA?.pinnedAt && cookieB?.pinnedAt) {
          return new Date(cookieA.pinnedAt).getTime() - new Date(cookieB.pinnedAt).getTime();
        }
      }
      
      // If both are not pinned or pinnedAt not available, sort by updatedAt
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [unsortedCookies, cookieDetailsMap]);

  // Handle direct access with cookies - wrap the base function with domain lookup
  const handleDirectAccess = (cookie: Cookie) => {
    const domain = cookie.domain || getPlatformDomain(cookie.platform);
    
    // Mark cookie as viewed and store the timestamp with user-specific key
    const newViewedCookies = { ...viewedCookies, [cookie.id]: true };
    setViewedCookies(newViewedCookies);
    localStorage.setItem(`cookie_viewed_at_${userId}_${cookie.id}`, new Date().toISOString());
    
    handleDirectAccessBase(domain, cookie.cookieData);
  };

  // If loading or no access
  if (isLoading || !plan || !order) {
    return <EmptyAccessContent isLoading={isLoading} plan={plan} order={order} />;
  }
  
  // Check if there's any content to display
  const hasNoContent = credentials.length === 0 && cookies.length === 0;
  
  if (hasNoContent) {
    return (
      <div className="container mx-auto px-4 py-12">
        <AccessPageHeader planName={plan.name} />
        <EmptyAccessContent isLoading={isLoading} plan={plan} order={order} />
      </div>
    );
  }

  // Handler for the copy to clipboard action that also marks cookies as viewed
  const handleCopyToClipboard = (text: string, type: string) => {
    // Copy the text to clipboard
    copyToClipboard(text, type);
    
    // If this is cookie data, try to find the cookie ID
    if (type.toLowerCase().includes('cookie')) {
      const cookie = cookies.find(c => c.cookieData === text);
      if (cookie) {
        // Mark as viewed and store timestamp with user-specific key
        const newViewedCookies = { ...viewedCookies, [cookie.id]: true };
        setViewedCookies(newViewedCookies);
        localStorage.setItem(`cookie_viewed_at_${userId}_${cookie.id}`, new Date().toISOString());
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* <AccessPageHeader planName={plan.name} /> */}

      {/* Extension banner - now also passing activeTab */}
      <ExtensionBanner 
        extensionInstalled={extensionInstalled} 
        hasCookies={cookies.length > 0}
        activeTab={activeTab}
      />

      {/* Extension Status */}
      <ExtensionStatus status={extensionStatus} />

      <AccessPageTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loginContent={
          <LoginCredentials 
            credentials={credentials} 
            getPlatformUrl={getPlatformUrl} 
            showTutorials={showLoginTutorials}
            onToggleShowTutorials={toggleShowLoginTutorials}
          />
        }
        cookiesContent={
          <CookieCredentials 
            cookies={cookies}
            extensionInstalled={extensionInstalled}
            handleDirectAccess={handleDirectAccess}
            formatDate={getPlatformUrl} 
            copyToClipboard={handleCopyToClipboard}
            showTutorials={showCookieTutorials}
            onToggleShowTutorials={toggleShowCookieTutorials}
          />
        }
      />
      
      {/* Important Notes - visible in both tabs */}
      <ImportantNotes extensionInstalled={extensionInstalled} />
    </div>
  );
};

export default AccessPage;
