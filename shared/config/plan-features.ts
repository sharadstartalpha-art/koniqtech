import { SubscriptionPlan } from "@prisma/client";

export const PLAN_FEATURES = {
  [SubscriptionPlan.starter]: {
    crew: false,
    dispatch: false,
    inventory: false,
    reports: false,
    automation: false,
    api: false,
  },

  [SubscriptionPlan.professional]: {
    crew: true,
    dispatch: true,
    inventory: true,
    reports: true,
    automation: true,
    api: false,
  },

  [SubscriptionPlan.enterprise]: {
    crew: true,
    dispatch: true,
    inventory: true,
    reports: true,
    automation: true,
    api: true,
  },
};