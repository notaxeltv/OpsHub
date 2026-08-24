import { SubscriptionPlan } from '@prisma/client';

export interface PlanLimits {
  maxCustomers: number | null;
  maxOrders: number | null;
  inventoryEnabled: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  FREE: { maxCustomers: 10, maxOrders: 20, inventoryEnabled: false },
  STARTER: { maxCustomers: 100, maxOrders: 500, inventoryEnabled: true },
  PRO: { maxCustomers: null, maxOrders: null, inventoryEnabled: true },
  ENTERPRISE: { maxCustomers: null, maxOrders: null, inventoryEnabled: true },
};

export const UPGRADEABLE_PLANS: SubscriptionPlan[] = ['STARTER', 'PRO'];
