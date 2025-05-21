import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { TutorialVideo } from './TutorialVideo';
import { LoginCredentialsProps } from '@/types/access';
import { formatRelativeDate } from '@/utils/formatUtils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { NoCredentialsMessage } from './NoCredentialsMessage';
import { CredentialItem } from './CredentialItem';
import { Credential } from '@/types/access';
import { Eye, EyeOff } from 'lucide-react';

export const LoginCredentials = ({ 
  credentials, 
  getPlatformUrl, 
  showTutorials, 
  onToggleShowTutorials 
}: LoginCredentialsProps) => {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const userId = user?.id || 'guest_access';

  const [viewedCredentials, setViewedCredentials] = useLocalStorage<Record<string, boolean>>(
    `viewed_credentials_${userId}`,
    {}
  );
  
  const markAsViewed = (credentialId: string) => {
    if (!viewedCredentials[credentialId]) {
      setViewedCredentials(prev => ({
        ...prev,
        [credentialId]: true
      }));
    }
    localStorage.setItem(`credential_viewed_at_${userId}_${credentialId}`, new Date().toISOString());
  };

  const togglePasswordVisibility = (credentialId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [credentialId]: !prev[credentialId]
    }));
    markAsViewed(credentialId);
  };

  const copyToClipboard = (text: string, type: string, credentialId: string) => {
    navigator.clipboard.writeText(text);
    (toast as any).success(`${type} copied to clipboard`);
    
    if (type.toLowerCase() === 'password') {
      markAsViewed(credentialId);
    }
  };
  
  useEffect(() => {
    if (credentials.length > 0) {
      const updatedViewedStatus = { ...viewedCredentials };
      let changesMade = false;

      credentials.forEach(credential => {
        if (viewedCredentials[credential.id] && credential.updatedAt) {
          const lastViewedAt = localStorage.getItem(`credential_viewed_at_${userId}_${credential.id}`);
          
          if (lastViewedAt && credential.updatedAt && new Date(credential.updatedAt) > new Date(lastViewedAt)) {
            delete updatedViewedStatus[credential.id];
            localStorage.removeItem(`credential_viewed_at_${userId}_${credential.id}`);
            changesMade = true;
          }
        }
      });

      Object.keys(updatedViewedStatus).forEach(id => {
        if (!credentials.some(cred => cred.id === id)) {
          delete updatedViewedStatus[id];
          localStorage.removeItem(`credential_viewed_at_${userId}_${id}`);
          changesMade = true;
        }
      });
      
      if (changesMade) {
        setViewedCredentials(updatedViewedStatus);
      }
    }
  }, [credentials, viewedCredentials, setViewedCredentials, userId]);

  if (credentials.length === 0) {
    return <NoCredentialsMessage />;
  }

  const tutorialVideoTitle = "Getting Started with Login Credentials";
  const tutorialVideoDescription = "Watch this tutorial to learn how to use your login credentials";
  const tutorialContentLabel = "Login Credentials Tutorial Video";
  const mainSectionHeading = "Your Login Credentials";

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
      <div className="space-y-6 mb-8">
        {credentials.map(credential => (
          <CredentialItem
            key={credential.id}
            credential={credential}
            isPasswordVisible={!!visiblePasswords[credential.id]}
            isViewed={!!viewedCredentials[credential.id]}
            onTogglePasswordVisibility={() => togglePasswordVisibility(credential.id)}
            onCopy={(text, type) => copyToClipboard(text, type, credential.id)}
            onGoToPlatform={() => markAsViewed(credential.id)}
            getPlatformUrl={getPlatformUrl}
          />
        ))}
      </div>
    </>
  );
};
