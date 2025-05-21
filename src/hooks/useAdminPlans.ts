
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Plan, Platform } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';

export const useAdminPlans = () => {
  const navigate = useNavigate();
  const { plans, platforms, addPlan, updatePlan, deletePlan } = useData();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  
  // Count of currently selected homepage plans
  const [homepagePlansCount, setHomepagePlansCount] = useState(0);
  // Track the highest homepage order value
  const [nextHomepageOrder, setNextHomepageOrder] = useState(0);
  
  // Filter plans based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPlans(
        plans.filter(plan => 
          plan.name.toLowerCase().includes(query) || 
          plan.description.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredPlans([...plans]);
    }
  }, [plans, searchQuery]);
  
  // Count homepage plans and determine next homepage order
  useEffect(() => {
    const homepagePlans = plans.filter(plan => plan.showOnHomepage);
    setHomepagePlansCount(homepagePlans.length);
    
    // Find the highest current order value
    if (homepagePlans.length > 0) {
      const highestOrder = Math.max(...homepagePlans.map(plan => 
        plan.homepageOrder !== undefined ? plan.homepageOrder : -1
      ));
      setNextHomepageOrder(highestOrder + 1);
    } else {
      setNextHomepageOrder(0);
    }
  }, [plans]);
  
  const handleCreatePlan = (newPlan: Omit<Plan, 'id'>) => {
    try {
      addPlan(newPlan);
      setIsCreateDialogOpen(false);
      toast.success("Plan created successfully");
    } catch (error) {
      toast.error("Failed to create plan");
      console.error(error);
    }
  };
  
  const handleDeletePlan = () => {
    if (!currentPlan) return;
    
    try {
      deletePlan(currentPlan.id);
      setIsDeleteDialogOpen(false);
      setCurrentPlan(null);
      toast.success("Plan deleted successfully");
    } catch (error) {
      toast.error("Failed to delete plan");
      console.error(error);
    }
  };
  
  const getPlatformNames = (platformIds: string[]): string[] => {
    return platformIds
      .map(id => platforms.find(p => p.id === id)?.name)
      .filter(Boolean) as string[];
  };
  
  const toggleHomepageDisplay = (plan: Plan) => {
    // Check if we're trying to add another homepage plan when we already have 3
    if (!plan.showOnHomepage && homepagePlansCount >= 3) {
      toast.error("You can only select up to 3 plans for the homepage");
      return;
    }
    
    const updatedPlan = {
      ...plan,
      showOnHomepage: !plan.showOnHomepage
    };
    
    // If adding to homepage, set the order
    if (!plan.showOnHomepage) {
      updatedPlan.homepageOrder = nextHomepageOrder;
    } else {
      // If removing from homepage, clear the order
      updatedPlan.homepageOrder = undefined;
    }
    
    updatePlan(updatedPlan);
    toast.success(`Plan ${updatedPlan.showOnHomepage ? 'added to' : 'removed from'} homepage`);
  };
  
  // Helper function to format duration display
  const formatDuration = (durationType: string, durationValue: number): string => {
    if (durationValue === 1) {
      // Singular form
      return `1 ${durationType.slice(0, -1)}`;
    }
    return `${durationValue} ${durationType}`;
  };
  
  return {
    plans,
    filteredPlans,
    searchQuery,
    setSearchQuery,
    homepagePlansCount,
    nextHomepageOrder,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPlan,
    setCurrentPlan,
    platforms,
    handleCreatePlan,
    handleDeletePlan,
    toggleHomepageDisplay,
    getPlatformNames,
    formatDuration,
    navigate
  };
};
