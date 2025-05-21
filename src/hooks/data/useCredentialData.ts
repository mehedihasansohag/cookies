
import { useState } from 'react';
import { Credential } from '@/types/dataTypes';
import credentialApi from '@/services/api/credentialApi';

export const useCredentialData = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  // Credential methods
  const addCredential = async (credential: Omit<Credential, 'id'>) => {
    try {
      const newCredential = await credentialApi.create(credential);
      setCredentials([...credentials, newCredential]);
      return newCredential;
    } catch (error) {
      console.error('Failed to add credential:', error);
      throw error;
    }
  };

  const updateCredential = async (credential: Credential) => {
    try {
      const updatedCredential = await credentialApi.update(credential.id, credential);
      const updatedCredentials = credentials.map(c => c.id === credential.id ? updatedCredential : c);
      setCredentials(updatedCredentials);
      return updatedCredential;
    } catch (error) {
      console.error('Failed to update credential:', error);
      throw error;
    }
  };

  const deleteCredential = async (id: string) => {
    try {
      await credentialApi.delete(id);
      setCredentials(credentials.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete credential:', error);
      throw error;
    }
  };

  const getCredentialsForPlan = async (planId: string) => {
    try {
      const planCredentials = await credentialApi.getByPlanId(planId);
      return planCredentials;
    } catch (error) {
      console.error('Failed to get credentials for plan:', error);
      return [];
    }
  };

  return {
    credentials,
    setCredentials,
    addCredential,
    updateCredential,
    deleteCredential,
    getCredentialsForPlan
  };
};
