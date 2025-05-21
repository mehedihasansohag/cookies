
import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Cookie as CookieIcon } from 'lucide-react';

interface AccessPageTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  loginContent: ReactNode;
  cookiesContent: ReactNode;
}

export const AccessPageTabs = ({
  activeTab,
  setActiveTab,
  loginContent,
  cookiesContent
}: AccessPageTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="sticky top-16 z-10 bg-background py-2 shadow-sm">
        <TabsList className="w-full mb-0">
          <TabsTrigger value="login" className="flex-1">
            <Lock className="mr-2 h-4 w-4" /> Login Credentials
          </TabsTrigger>
          <TabsTrigger value="cookies" className="flex-1">
            <CookieIcon className="mr-2 h-4 w-4" /> Cookies Credentials
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="mt-6">
        <TabsContent value="login">
          {loginContent}
        </TabsContent>
        <TabsContent value="cookies">
          {cookiesContent}
        </TabsContent>
      </div>
    </Tabs>
  );
};
