
import { Plan } from "@/types/dataTypes";

/**
 * Service for managing plans
 */
export const planService = {
  /**
   * Add a new plan
   * @param plans Current plans array
   * @param plan New plan data without ID
   * @returns The newly created plan with generated ID
   */
  addPlan: (plans: Plan[], plan: Omit<Plan, 'id'>): Plan => {
    const newPlan = { ...plan, id: crypto.randomUUID() };
    return newPlan;
  },

  /**
   * Update an existing plan
   * @param plans Current plans array
   * @param plan Updated plan data
   * @returns Updated array of plans
   */
  updatePlan: (plans: Plan[], plan: Plan): Plan[] => {
    return plans.map(p => p.id === plan.id ? plan : p);
  },

  /**
   * Delete a plan by ID
   * @param plans Current plans array
   * @param id ID of the plan to delete
   * @returns Updated array of plans with the specified plan removed
   */
  deletePlan: (plans: Plan[], id: string): Plan[] => {
    return plans.filter(p => p.id !== id);
  },

  /**
   * Get a plan by ID
   * @param plans Current plans array
   * @param planId ID of the plan to retrieve
   * @returns The matching plan or undefined if not found
   */
  getPlanById: (plans: Plan[], planId: string): Plan | undefined => {
    return plans.find(p => p.id === planId);
  },
  
  /**
   * Filter plans by platform
   * @param plans Current plans array
   * @param platformId ID of the platform to filter by
   * @returns Array of plans that include the specified platform
   */
  getPlansByPlatform: (plans: Plan[], platformId: string): Plan[] => {
    return plans.filter(plan => plan.platforms.includes(platformId));
  },
  
  /**
   * Get all featured plans
   * @param plans Current plans array
   * @returns Array of plans marked with "Featured" sticker text
   */
  getFeaturedPlans: (plans: Plan[]): Plan[] => {
    return plans.filter(plan => plan.stickerText === 'Featured');
  },
  
  /**
   * Get all popular plans
   * @param plans Current plans array
   * @returns Array of plans marked with "Popular" sticker text
   */
  getPopularPlans: (plans: Plan[]): Plan[] => {
    return plans.filter(plan => plan.stickerText === 'Popular');
  },
  
  /**
   * Get plans selected for homepage display
   * @param plans Current plans array
   * @param homepagePlanIds IDs of plans to show on homepage
   * @returns Array of selected homepage plans
   */
  getHomepagePlans: (plans: Plan[], homepagePlanIds: string[]): Plan[] => {
    if (!homepagePlanIds.length) {
      // If no plans are specifically selected, return the first 3 plans
      return plans.slice(0, 3);
    }
    return plans.filter(plan => homepagePlanIds.includes(plan.id));
  }
};
