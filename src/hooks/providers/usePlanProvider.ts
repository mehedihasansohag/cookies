
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Plan } from '@/types/dataTypes';
import { INITIAL_PLANS } from '@/data/initialData';
import { planService } from '@/services/planService';
import { formatService } from '@/services/formatServices';

/**
 * Hook for managing plan data
 */
export const usePlanProvider = () => {
  // Use our custom localStorage hook
  const [plans, setPlans] = useLocalStorage<Plan[]>('accessVaultPlans', INITIAL_PLANS);

  // Plan methods
  const addPlan = (plan: Omit<Plan, 'id'>) => {
    const newPlan = planService.addPlan(plans, plan);
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (plan: Plan) => {
    setPlans(planService.updatePlan(plans, plan));
  };

  const deletePlan = (id: string) => {
    setPlans(planService.deletePlan(plans, id));
  };

  const getPlanById = (planId: string) => {
    return planService.getPlanById(plans, planId);
  };

  // Format plan duration correctly based on the plan's durationType and durationValue
  const formatPlanDuration = (plan: Plan) => {
    return formatService.formatPlanDuration(plan.durationType, plan.durationValue);
  };

  return {
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    getPlanById,
    formatPlanDuration
  };
};
