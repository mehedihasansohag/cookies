
import { useState } from 'react';
import { Plan } from '@/types/dataTypes';
import planApi from '@/services/api/planApi';

export const usePlanData = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  // Plan methods
  const addPlan = async (plan: Omit<Plan, 'id'>) => {
    try {
      const newPlan = await planApi.create(plan);
      setPlans([...plans, newPlan]);
      return newPlan;
    } catch (error) {
      console.error('Failed to add plan:', error);
      throw error;
    }
  };

  const updatePlan = async (plan: Plan) => {
    try {
      const updatedPlan = await planApi.update(plan.id, plan);
      setPlans(plans.map(p => p.id === plan.id ? updatedPlan : p));
      return updatedPlan;
    } catch (error) {
      console.error('Failed to update plan:', error);
      throw error;
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await planApi.delete(id);
      setPlans(plans.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete plan:', error);
      throw error;
    }
  };

  const getPlanById = (planId: string) => {
    console.log("plans",plans)
    console.log("pALNid",planId)
    return plans.find(p => p._id == planId);
  };

  // Helper functions
  const formatPlanDuration = (durationType?: string, durationValue?: number): string => {
    if (!durationType || !durationValue) return '';
    return durationValue === 1 ? `1 ${durationType.slice(0, -1)}` : `${durationValue} ${durationType}`;
  };

  return {
    plans,
    setPlans,
    addPlan,
    updatePlan,
    deletePlan,
    getPlanById,
    formatPlanDuration
  };
};
