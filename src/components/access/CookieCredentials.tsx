
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Search, Eye, EyeOff } from 'lucide-react';
import { TutorialVideo } from './TutorialVideo';
import { CookieCredentialsProps } from '@/types/access';
import { formatRelativeDate } from '@/utils/formatUtils';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { CopyButton } from './CopyButton';
import { AccessButton } from './AccessButton';

export const CookieCredentials = ({ 
  cookies, 
  extensionInstalled, 
  handleDirectAccess, 
  formatDate, 
  copyToClipboard,
  showTutorials,
  onToggleShowTutorials
}: CookieCredentialsProps) => {
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  
  const [platformFilter, setPlatformFilter] = useState('');
  
  const [viewedCookies, setViewedCookies] = useLocalStorage<Record<string, boolean>>(
    `viewed_cookies_${userId}`, 
    {}
  );
  
  const filteredCookies = platformFilter
    ? cookies.filter(cookie => 
        cookie.platform.toLowerCase().includes(platformFilter.toLowerCase())
      )
    : cookies;
  
  // Handler for both copy and direct access to mark cookie as clicked
  const handleCookieAction = (cookieId: string, action: () => void) => {
    action();
    const newClickedState = {
      ...viewedCookies,
      [cookieId]: true
    };
    setViewedCookies(newClickedState);
    localStorage.setItem(`cookie_viewed_at_${userId}_${cookieId}`, new Date().toISOString());
  };
  
  if (cookies.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6 text-center">
          <p className="mb-4">No cookie credentials have been added to this plan yet.</p>
          <p className="text-sm text-gray-500">
            The administrator will add cookie credentials soon. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const tutorialVideoTitle = "Getting Started with Cookie Credentials";
  const tutorialVideoDescription = "Watch this tutorial to learn how to use cookie credentials";
  const tutorialContentLabel = "Cookie Credentials Tutorial Video";
  const mainSectionHeading = "Platform Cookies";

  return (
    <>
      <div className="flex justify-end mb-2 mt-2">
        <Button variant="ghost" size="sm" onClick={onToggleShowTutorials} className="text-sm flex items-center">
          {showTutorials ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          <span>{showTutorials ? 'Hide Tutorial Video' : 'Show Tutorial Video'}</span>
        </Button>
      </div>

      {showTutorials && (
        <TutorialVideo 
          title={tutorialVideoTitle}
          description={tutorialVideoDescription}
          contentLabel={tutorialContentLabel}
        />
      )}

      <h2 className="text-2xl font-bold mb-4 mt-6">{mainSectionHeading}</h2>
      
      <div className="mb-4 relative">
        <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-primary">
          <Search className="absolute left-2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Filter by platform name..."
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="pl-8 focus-visible:ring-0 border-0"
          />
        </div>
        {platformFilter && (
          <div className="mt-2 text-sm">
            Showing {filteredCookies.length} of {cookies.length} cookies
          </div>
        )}
      </div>
      
      <div className="space-y-6 mb-8">
        {filteredCookies.map(cookie => {
          const isClicked = viewedCookies[cookie.id];
          const platformSlug = cookie.platform?.toLowerCase().replace(/\s+/g, '-');
          
          return (
            <Card key={cookie.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{cookie.platform}</CardTitle>
                    <CardDescription>
                      Cookie for {cookie.platform}
                    </CardDescription>
                  </div>
                  <div className="flex items-center text-xs">
                    <Clock className={`h-3 w-3 mr-1 ${!isClicked ? 'text-green-600' : 'text-muted-foreground'}`} />
                    <span className={!isClicked ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {formatRelativeDate(cookie.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cookie Data:</label>
                  <div className="flex">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-l p-3 text-sm text-gray-500 truncate">
                      [Protected Cookie Data]
                    </div>
                    <CopyButton 
                      text={cookie.cookieData}
                      type="Cookie data"
                      onCopy={(text, type) => handleCookieAction(
                        cookie.id, 
                        () => copyToClipboard(text, type)
                      )}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                {/* Use the new AccessButton component */}
                <AccessButton 
                  slug={platformSlug}
                  platformName={cookie.platform}
                  className="flex items-center justify-center gap-2"
                />
                
                {/* Legacy direct access button for backward compatibility */}
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleCookieAction(
                    cookie.id,
                    () => handleDirectAccess(cookie)
                  )}
                  disabled={!extensionInstalled}
                  variant="outline"
                >
                  Legacy Access {cookie.platform}
                  {extensionInstalled ? (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Extension Enabled</span>
                  ) : (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Extension Required</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};
