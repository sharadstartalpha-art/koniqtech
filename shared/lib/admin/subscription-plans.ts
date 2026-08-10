// shared/lib/admin/subscription-plans.ts

import { SubscriptionPlan } from "@prisma/client";

export type PlanConfig = {
  label: string;
  amount: number;
  userLimit: number;
  storageLimit: number;
  aiCredits: number;
};

export const SUBSCRIPTION_PLANS: Record<
  SubscriptionPlan,
  PlanConfig
> = {
  starter: {
    label: "Starter",
    amount: 99,
    userLimit: 5,
    storageLimit: 20,
    aiCredits: 1000,
  },

  professional: {
    label: "Professional",
    amount: 199,
    userLimit: 15,
    storageLimit: 100,
    aiCredits: 5000,
  },

  enterprise: {
    label: "Enterprise",
    amount: 499,
    userLimit: 50,
    storageLimit: 500,
    aiCredits: 20000,
  },
};

export const SUBSCRIPTION_PLAN_OPTIONS = (
  Object.entries(SUBSCRIPTION_PLANS) as [
    SubscriptionPlan,
    PlanConfig,
  ][]
).map(([value, config]) => ({
  value,
  ...config,
}));