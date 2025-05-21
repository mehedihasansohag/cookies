import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/hooks/use-toast';
import { Plan, DurationType } from '@/types/dataTypes';

export const useAdminPlanDetail = (id?: string) => {
  const { plans, platforms, addPlan, updatePlan, getPlanById } = useData();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [stickerText, setStickerText] = useState<string>('');
  const [stickerColor, setStickerColor] = useState<string>('');
  const [durationType, setDurationType] = useState<DurationType>('months');
  const [durationValue, setDurationValue] = useState<number>(1);
  
  // Load plan data if editing an existing plan
  useEffect(() => {
    if (id === 'new') {
      // Creating a new plan
      setIsLoading(false);
      return;
    }
    
    if (id) {
      const existingPlan = getPlanById(id);
      if (existingPlan) {
        setPlan(existingPlan);
        setName(existingPlan.name);
        setDescription(existingPlan.description);
        setPrice(existingPlan.price);
        setSelectedPlatforms(existingPlan.platforms);
        setStickerText(existingPlan.stickerText || '');
        setStickerColor(existingPlan.stickerColor || '');
        setDurationType(existingPlan.durationType || 'months');
        setDurationValue(existingPlan.durationValue || 1);
      }
    }
    setIsLoading(false);
  }, [id, getPlanById]);
  
  // Toggle platform selection
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };
  
  // Handle duration type change
  const handleDurationTypeChange = (value: DurationType) => {
    setDurationType(value);
  };
  
  // Save plan
  const handleSave = () => {
    setIsSaving(true);
    
    // Validation
    if (!name.trim()) {
      toast.error("Plan name is required", { title: "Validation Error" });
      setIsSaving(false);
      return;
    }
    
    if (price <= 0) {
      toast.error("Price must be greater than zero", { title: "Validation Error" });
      setIsSaving(false);
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform", { title: "Validation Error" });
      setIsSaving(false);
      return;
    }
    
    try {
      const planData = {
        name,
        description,
        price,
        platforms: selectedPlatforms,
        stickerText: stickerText || undefined,
        stickerColor: stickerColor || undefined,
        durationType,
        durationValue
      };
      
      if (id === 'new') {
        // Create new plan
        addPlan(planData);
        toast.success("Plan created successfully", { title: "Success" });
      } else if (plan) {
        // Update existing plan
        updatePlan({ ...planData, id: plan.id, showOnHomepage: plan.showOnHomepage, homepageOrder: plan.homepageOrder });
        toast.success("Plan updated successfully", { title: "Success" });
      }
      
      setIsSaving(false);
    } catch (error) {
      console.error("Failed to save plan:", error);
      toast.error("Failed to save plan", { title: "Error" });
      setIsSaving(false);
    }
  };
  
  return {
    isLoading,
    plan,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    selectedPlatforms,
    togglePlatform,
    stickerText,
    setStickerText,
    stickerColor,
    setStickerColor,
    durationType,
    handleDurationTypeChange,
    durationValue,
    setDurationValue,
    handleSave,
    isSaving
  };
};
