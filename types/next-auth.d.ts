import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { PlatformRole } from "@prisma/client"
import { Permission } from "@/shared/lib/permissions";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: PlatformRole
      orgId: string
      organizationRole: string | null
      employeeRole: string | null
      employeeId: string | null
      subscriptionPlan: any
      industry: any
      permissions: Permission[];   // <-- ADD THIS
    }
  }

  interface User {
    id: string
    role: PlatformRole
    orgId: string
    organizationRole: string | null
    employeeRole: string | null
    employeeId: string | null
    subscriptionPlan: any
    industry: any
     permissions: Permission[]   // <-- ADD THIS
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: PlatformRole
    orgId: string
    organizationRole: string | null
    employeeRole: string | null
    employeeId: string | null
    subscriptionPlan: any
    industry: any
    permissions: Permission[];   // <-- ADD THIS
  }
}