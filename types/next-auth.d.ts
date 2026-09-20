import type { DefaultSession } from "next-auth"

import type {
  PlatformRole,
  SubscriptionPlan,
} from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string

      role: PlatformRole

      orgId: string

      status: string

      organizationRole:
        | string
        | null

      employeeRole:
        | string
        | null

      employeeId:
        | string
        | null

      isInternalEmployee: boolean

      subscriptionPlan:
        | SubscriptionPlan
        | string
        | null

      industry:
        | string
        | null

      email:
        | string
        | null

      name:
        | string
        | null

      image:
        | string
        | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string

    role: PlatformRole

    orgId: string

    status: string

    organizationRole:
      | string
      | null

    employeeRole:
      | string
      | null

    employeeId:
      | string
      | null

    isInternalEmployee: boolean

    subscriptionPlan:
      | SubscriptionPlan
      | string
      | null

    industry:
      | string
      | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string

    role?: PlatformRole

    orgId?: string

    status?: string

    organizationRole?:
      | string
      | null

    employeeRole?:
      | string
      | null

    employeeId?:
      | string
      | null

    isInternalEmployee?: boolean

    subscriptionPlan?:
      | SubscriptionPlan
      | string
      | null

    industry?:
      | string
      | null
  }
}