
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Credential } from '@/types/dataTypes';
import { getPlatformDomain } from '@/components/access/utils';

interface EditCredentialFormProps {
  isOpen: boolean;
  credential: Credential | null;
  onClose: () => void;
  onSubmit: (platformId: string, username: string, password: string, domain?: string) => void;
}

export const EditCredentialForm = ({ isOpen, credential, onClose, onSubmit }: EditCredentialFormProps) => {
  const [platformId, setPlatformId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Reset form when credential changes
  useEffect(() => {
    if (credential) {
      setPlatformId(credential.platform || credential.platformId);
      setUsername(credential.username || '');
      setPassword(credential.password || '');
      setDomain(credential.domain || getPlatformDomain(credential.platform || credential.platformId));
    } else {
      setPlatformId('');
      setUsername('');
      setPassword('');
      setDomain('');
    }
  }, [credential]);
  
  const handleSubmit = () => {
    onSubmit(platformId, username, password, domain);
  };
  
  const handlePlatformChange = (value: string) => {
    setPlatformId(value);
    // Auto-generate domain from platform name if domain is empty
    if (!domain) {
      setDomain(getPlatformDomain(value));
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Credential</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="platformId" className="text-sm font-medium">
              Platform Name
            </label>
            <Input
              id="platformId"
              value={platformId}
              onChange={e => handlePlatformChange(e.target.value)}
              placeholder="e.g., Coursera"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="domain" className="text-sm font-medium">
              Domain Name
            </label>
            <Input
              id="domain"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g., coursera.org"
            />
            <p className="text-xs text-muted-foreground">
              Domain used for the "Go to Platform" button
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username / Email
            </label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g., user@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="flex">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="rounded-r-none"
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-l-none border-l-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update Credential
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
