import { DefaultSession } from "next-auth"
import { SubscriptionPlan, Industry } from "@prisma/client"

declare module "next-auth" {

    interface Session {

        user: DefaultSession["user"] & {

            id: string

            orgId: string

            organizationRole?: string | null

            employeeRole?: string | null

            employeeId?: string | null

            subscriptionPlan?: SubscriptionPlan

            industry?: Industry | null
        }
    }

    interface User {

        id: string

        orgId: string

        organizationRole?: string | null

        employeeRole?: string | null

        employeeId?: string | null

        subscriptionPlan?: SubscriptionPlan

        industry?: Industry | null
    }
}

declare module "next-auth/jwt" {

    interface JWT {

        id: string

        orgId: string

        organizationRole?: string | null

        employeeRole?: string | null

        employeeId?: string |null

        subscriptionPlan?: SubscriptionPlan

        industry?: Industry | null
    }
}