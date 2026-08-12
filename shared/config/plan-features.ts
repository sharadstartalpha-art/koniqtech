import { SubscriptionPlan } from "@prisma/client";

export const PLAN_FEATURES: Record<
  SubscriptionPlan,
  {
    crew: boolean;
    dispatch: boolean;
    inventory: boolean;
    fleet: boolean;

    ai: boolean;
    automation: boolean;
    voiceAI: boolean;
    routeAI: boolean;

    customerPortal: boolean;
    sms: boolean;

    api: boolean;
    whiteLabel: boolean;
    branches: boolean;
    sso: boolean;
  }
> = {
  starter: {
    crew: false,
    dispatch: false,
    inventory: false,
    fleet: false,

    ai: false,
    automation: false,
    voiceAI: false,
    routeAI: false,

    customerPortal: false,
    sms: false,

    api: false,
    whiteLabel: false,
    branches: false,
    sso: false,
  },

  professional: {
    crew: true,
    dispatch: true,
    inventory: true,
    fleet: true,

    ai: true,
    automation: true,
    voiceAI: true,
    routeAI: true,

    customerPortal: true,
    sms: true,

    api: true,
    whiteLabel: false,
    branches: false,
    sso: false,
  },

  enterprise: {
    crew: true,
    dispatch: true,
    inventory: true,
    fleet: true,

    ai: true,
    automation: true,
    voiceAI: true,
    routeAI: true,

    customerPortal: true,
    sms: true,

    api: true,
    whiteLabel: true,
    branches: true,
    sso: true,
  },
};