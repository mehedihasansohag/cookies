
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Credential } from '@/types/dataTypes';
import { INITIAL_CREDENTIALS } from '@/data/initialData';
import { credentialService } from '@/services/credentialService';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for managing credential data
 */
export const useCredentialProvider = () => {
  // Use our custom localStorage hook
  const [credentials, setCredentials] = useLocalStorage<Credential[]>('accessVaultCredentials', INITIAL_CREDENTIALS);

  // Helper function to sort credentials by updatedAt (newest first)
  const sortCredentialsByDate = (creds: Credential[]) => {
    return [...creds].sort((a, b) => {
      if (!a.updatedAt) return 1;
      if (!b.updatedAt) return -1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };

  // Credential methods
  const addCredential = (credential: Omit<Credential, 'id'>) => {
    const newCredential = credentialService.addCredential(credentials, credential);
    // Add the credential and sort by updatedAt
    const updatedCredentials = sortCredentialsByDate([...credentials, newCredential]);
    setCredentials(updatedCredentials);
    return newCredential;
  };

  const updateCredential = (credential: Credential) => {
    const updatedCredentials = credentialService.updateCredential(credentials, credential);
    
    // Check if changes were made by comparing the arrays
    if (updatedCredentials !== credentials) {
      // Sort the updated credentials by updatedAt
      const sortedCredentials = sortCredentialsByDate(updatedCredentials);
      setCredentials(sortedCredentials);
      toast({
        title: "Credential Updated",
        description: `Credential for ${credential.platform || credential.platformId} has been updated.`
      });
      return sortedCredentials;
    } else {
      // No changes were detected
      toast({
        title: "No changes detected",
        description: "The credential was not updated as no changes were made."
      });
      return credentials;
    }
  };

  const deleteCredential = (id: string) => {
    const updatedCredentials = credentialService.deleteCredential(credentials, id);
    setCredentials(updatedCredentials);
    return updatedCredentials;
  };

  const getCredentialsForPlan = (planId: string) => {
    const planCredentials = credentialService.getCredentialsForPlan(credentials, planId);
    // Sort credentials by updatedAt
    return sortCredentialsByDate(planCredentials);
  };

  return {
    credentials,
    addCredential,
    updateCredential,
    deleteCredential,
    getCredentialsForPlan
  };
};
