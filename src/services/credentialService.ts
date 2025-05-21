
// Credential-related service functions

import { Credential } from "@/types/dataTypes";
import { getPlatformDomain } from "@/components/access/utils";

/**
 * Credential service functions for managing credentials
 */
export const credentialService = {
  /**
   * Add a new credential
   */
  addCredential: (credentials: Credential[], credential: Omit<Credential, 'id'>): Credential => {
    const newCredential = { 
      ...credential, 
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      // Generate domain if not provided
      domain: credential.domain || getPlatformDomain(credential.platformId || credential.platform || '')
    };
    
    // Reset viewed status for new credentials by updating localStorage directly
    try {
      const viewedCredentials = JSON.parse(localStorage.getItem('viewed_credentials') || '{}');
      delete viewedCredentials[newCredential.id]; // Ensure new credential is marked as not viewed
      localStorage.setItem('viewed_credentials', JSON.stringify(viewedCredentials));
    } catch (error) {
      console.error('Error updating viewed credentials status:', error);
    }
    
    return newCredential;
  },

  /**
   * Update existing credential if there are actual changes
   * Returns updated array if changes were made, original array otherwise
   */
  updateCredential: (credentials: Credential[], credential: Credential): Credential[] => {
    // Find the existing credential
    const existingCredential = credentials.find(c => c.id === credential.id);
    
    // If the credential doesn't exist, no changes can be made
    if (!existingCredential) {
      return credentials;
    }
    
    // Check if there are actual changes by comparing relevant fields
    const hasChanges = 
      existingCredential.platform !== credential.platform ||
      existingCredential.platformId !== credential.platformId ||
      existingCredential.username !== credential.username ||
      existingCredential.password !== credential.password ||
      existingCredential.domain !== credential.domain ||
      existingCredential.planId !== credential.planId;
    
    // Only update if there are actual changes
    if (hasChanges) {
      const updatedCredential = {
        ...credential,
        updatedAt: new Date().toISOString()
      };
      
      // Reset viewed status for this credential by updating localStorage directly
      try {
        const viewedCredentials = JSON.parse(localStorage.getItem('viewed_credentials') || '{}');
        delete viewedCredentials[credential.id]; // Mark as not viewed since it was updated
        localStorage.setItem('viewed_credentials', JSON.stringify(viewedCredentials));
      } catch (error) {
        console.error('Error updating viewed credentials status:', error);
      }
      
      return credentials.map(c => c.id === credential.id ? updatedCredential : c);
    }
    
    // Return original array if no changes
    return credentials;
  },

  /**
   * Delete credential
   */
  deleteCredential: (credentials: Credential[], id: string): Credential[] => {
    // Remove from viewed credentials in localStorage when deleted
    try {
      const viewedCredentials = JSON.parse(localStorage.getItem('viewed_credentials') || '{}');
      delete viewedCredentials[id];
      localStorage.setItem('viewed_credentials', JSON.stringify(viewedCredentials));
    } catch (error) {
      console.error('Error updating viewed credentials status:', error);
    }
    
    return credentials.filter(c => c.id !== id);
  },

  /**
   * Get credentials for a specific plan
   */
  getCredentialsForPlan: (credentials: Credential[], planId: string): Credential[] => {
    return credentials.filter(c => c.planId === planId);
  }
};
