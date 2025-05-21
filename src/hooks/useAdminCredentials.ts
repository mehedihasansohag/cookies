
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDataContext } from './useDataContext';
import { Credential } from '@/types/dataTypes';
import { getPlatformDomain } from '@/components/access/utils';

export const useAdminCredentials = () => {
  const { planId } = useParams<{ planId: string }>();
  const { 
    credentials, 
    addCredential: addCredentialToStore, 
    updateCredential: updateCredentialInStore, 
    deleteCredential: deleteCredentialFromStore, 
    getCredentialsForPlan,
    getPlanById,
    plans
  } = useDataContext();
  
  // State management for the credential being edited
  const [currentCredential, setCurrentCredential] = useState<Credential | null>(null);
  const [planCredentials, setPlanCredentials] = useState<Credential[]>([]);
  const [plan, setPlan] = useState<{ id: string; name: string } | null>(null);
  const [planNames, setPlanNames] = useState<Record<string, string>>({});
  
  // Dialog state management
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Load plan data and credentials
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Create a map of plan IDs to plan names
      const planNameMap: Record<string, string> = {};
      plans.forEach(p => {
        planNameMap[p.id] = p.name;
      });
      setPlanNames(planNameMap);
      
      if (planId) {
        const foundPlan = getPlanById(planId);
        if (foundPlan) {
          setPlan({ id: foundPlan.id, name: foundPlan.name });
          try {
            const planCreds = await getCredentialsForPlan(planId);
            setPlanCredentials(planCreds);
          } catch (error) {
            console.error("Error loading credentials:", error);
            setPlanCredentials([]);
          }
        } else {
          setPlanCredentials([]);
        }
      } else {
        // If no plan ID, show all credentials
        setPlanCredentials(credentials);
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [planId, credentials, getPlanById, getCredentialsForPlan, plans]);
  
  // Handlers for dialogs
  const openAddDialog = useCallback(() => {
    setIsAddDialogOpen(true);
  }, []);
  
  const openEditDialog = useCallback((credential: Credential) => {
    setCurrentCredential(credential);
    setIsEditDialogOpen(true);
  }, []);
  
  const openDeleteDialog = useCallback((credential: Credential) => {
    setCurrentCredential(credential);
    setIsDeleteDialogOpen(true);
  }, []);
  
  // Handlers for CRUD operations
  const handleAddCredential = useCallback(async (specificPlanId: string, platformId: string, username: string, password: string, domain?: string) => {
    // Use the provided planId, or the one from URL params
    const targetPlanId = specificPlanId || planId;
    if (!targetPlanId) return;
    
    await addCredentialToStore({
      planId: targetPlanId,
      platformId,
      username, 
      password,
      domain: domain || getPlatformDomain(platformId),
      updatedAt: new Date().toISOString()
    });
    
    // Refresh credentials if necessary
    if (targetPlanId === planId) {
      const updatedCreds = await getCredentialsForPlan(targetPlanId);
      setPlanCredentials(updatedCreds);
    }
    
    setIsAddDialogOpen(false);
  }, [planId, addCredentialToStore, getCredentialsForPlan]);
  
  const handleEditCredential = useCallback(async (platformId: string, username: string, password: string, domain?: string) => {
    if (!currentCredential) return;
    
    const updatedCredential = {
      ...currentCredential,
      platformId,
      platform: platformId, // For backward compatibility
      username,
      password,
      domain: domain || getPlatformDomain(platformId),
      updatedAt: new Date().toISOString()
    };
    
    await updateCredentialInStore(updatedCredential);
    
    // Refresh credentials if necessary
    if (currentCredential.planId === planId) {
      const updatedCreds = await getCredentialsForPlan(currentCredential.planId);
      setPlanCredentials(updatedCreds);
    }
    
    setIsEditDialogOpen(false);
  }, [currentCredential, updateCredentialInStore, planId, getCredentialsForPlan]);
  
  const handleDeleteCredential = useCallback(async () => {
    if (!currentCredential) return;
    
    await deleteCredentialFromStore(currentCredential.id);
    
    // Refresh credentials if necessary
    if (currentCredential.planId === planId) {
      const updatedCreds = await getCredentialsForPlan(currentCredential.planId);
      setPlanCredentials(updatedCreds);
    }
    
    setIsDeleteDialogOpen(false);
  }, [currentCredential, deleteCredentialFromStore, planId, getCredentialsForPlan]);
  
  return {
    isLoading,
    plan,
    planCredentials,
    planNames,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    currentCredential,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleAddCredential,
    handleEditCredential,
    handleDeleteCredential,
    openAddDialog,
    openEditDialog,
    openDeleteDialog
  };
};
