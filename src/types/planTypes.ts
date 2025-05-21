
import { Plan } from './dataTypes';

export interface PlanContextType {
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id'>) => Promise<Plan>;
  updatePlan: (plan: Plan) => Promise<Plan>;
  deletePlan: (id: string) => Promise<void>;
  getPlanById: (planId: string) => Plan | undefined;
  formatPlanDuration: (durationType?: string, durationValue?: number) => string;
}
