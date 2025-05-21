
import { useState, useEffect } from 'react';
import { useDataContext } from './useDataContext';
import { Credential, Plan } from '@/types/dataTypes';
import { getPlatformDomain } from '@/components/access/utils';
import { toast } from '@/hooks/use-toast';

export const useCredentialManagement = () => {
  // State for the form
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<Credential | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  
  // Context data
  const { 
    credentials, 
    addCredential, 
    updateCredential, 
    deleteCredential,
    plans,
    getPlanById
  } = useDataContext();
  
  // Derived state
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [planNames, setPlanNames] = useState<Record<string, string>>({});
  
  // Initialize plan names and filtered credentials
  useEffect(() => {
    // Create mapping of plan IDs to names
    const names: Record<string, string> = {};
    plans.forEach(plan => {
      names[plan.id] = plan.name;
    });
    setPlanNames(names);
    
    // If a plan is selected, filter credentials for that plan
    if (currentPlan) {
      setFilteredCredentials(credentials.filter(c => c.planId === currentPlan.id));
    } else {
      setFilteredCredentials(credentials);
    }
  }, [credentials, plans, currentPlan]);
  
  // Update domain based on platform
  useEffect(() => {
    if (platform && !domain) {
      setDomain(getPlatformDomain(platform));
    }
  }, [platform, domain]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlanId) {
      toast({
        title: "Plan Required",
        description: "Please select a plan for this credential."
      });
      return;
    }
    
    if (!platform || !username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (isEditing && currentCredential) {
      // Update existing credential
      const updatedCredential: Credential = {
        ...currentCredential,
        platform,
        platformId: platform, // For backward compatibility
        username,
        password,
        domain,
        planId: selectedPlanId,
      };
      
      updateCredential(updatedCredential);
      // Note: Toast notification is now handled in the useCredentialProvider
    } else {
      // Add new credential
      addCredential({
        platform,
        platformId: platform,
        username,
        password,
        domain,
        planId: selectedPlanId,
      });
      toast({
        title: "Credential Added",
        description: `Credential for ${platform} has been added.`
      });
    }
    
    resetForm();
  };
  
  // Reset form fields
  const resetForm = () => {
    setPlatform('');
    setUsername('');
    setPassword('');
    setDomain('');
    setSelectedPlanId('');
    setIsEditing(false);
    setCurrentCredential(null);
  };
  
  // Handle editing a credential
  const handleEditCredential = (credential: Credential) => {
    setCurrentCredential(credential);
    setPlatform(credential.platform || credential.platformId || '');
    setUsername(credential.username || '');
    setPassword(credential.password || '');
    setDomain(credential.domain || getPlatformDomain(credential.platform || credential.platformId || ''));
    setSelectedPlanId(credential.planId || '');
    setIsEditing(true);
  };
  
  // Handle deleting a credential
  const handleDeleteCredential = (credential: Credential) => {
    if (window.confirm(`Are you sure you want to delete the credential for ${credential.platform || credential.platformId}?`)) {
      deleteCredential(credential.id);
      toast({
        title: "Credential Deleted",
        description: `Credential for ${credential.platform || credential.platformId} has been deleted.`
      });
    }
  };
  
  // Copy credential to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${type} has been copied to your clipboard.`
    });
  };
  
  return {
    // Form state
    platform,
    setPlatform,
    username,
    setUsername,
    password,
    setPassword,
    domain,
    setDomain,
    selectedPlanId,
    setSelectedPlanId,
    isEditing,
    
    // Data
    planNames,
    plans,
    filteredCredentials,
    currentPlan,
    
    // Actions
    handleSubmit,
    handleEditCredential,
    handleDeleteCredential,
    resetForm,
    copyToClipboard
  };
};
