import { DefaultSession } from "next-auth";
import { SubscriptionPlan, Industry, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      orgId: string;
      role: UserRole;
      subscriptionPlan: SubscriptionPlan;
      industry: Industry | null;
    };
  }

  interface User {
    id: string;
    orgId: string;
    role: UserRole;
    subscriptionPlan: SubscriptionPlan;
    industry: Industry | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    orgId: string;
    role: UserRole;
    subscriptionPlan: SubscriptionPlan;
    industry: Industry | null;
  }
}