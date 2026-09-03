import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"
import { Permission } from "@/shared/lib/permissions";



export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,

  trustHost: true,

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: String(credentials.email),
          },

          include: {
            organization: {
              include: {
                subscriptions: true,
              },
            },

           organizationRole: {
  include: {
    permissions: true,
  },
},
            employee: {
              include: {
                role: true,
              },
            },
          },
        })

        if (!user) {
          return null
        }

        const validPassword = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        )

        if (!validPassword) {
          return null
        }

const permissions =
  (user.organizationRole?.permissions ?? []) as Permission[];

console.log(
  JSON.stringify(
    user.organizationRole?.permissions
  ).length
)

console.log(
  "Permission count:",
  user.organizationRole?.permissions.length
);

console.log(
  "Permissions JSON size:",
  JSON.stringify(user.organizationRole?.permissions).length
);


       return {
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  orgId: user.orgId,

  organizationRole:
    user.organizationRole?.name ?? null,

  employeeRole:
    user.employee?.role?.name ?? null,

  employeeId:
    user.employee?.id ?? null,

  subscriptionPlan:
    user.organization.subscriptions &&
    user.organization.subscriptions.status === "active"
      ? user.organization.subscriptions.plan
      : user.organization.plan,

  industry:
    user.organization.industry,
     permissions, 
}
      },
    }),
  ],

  callbacks: {
 async jwt({ token, user }) {
  if (user) {
    token.id = user.id
    token.role = user.role
    token.orgId = user.orgId
    token.organizationRole = user.organizationRole
    token.employeeRole = user.employeeRole
    token.employeeId = user.employeeId
    token.subscriptionPlan = user.subscriptionPlan
    token.industry = user.industry
    if (user) {
  token.permissions = user.permissions;
} 
  }

  return token
},

    async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string
    session.user.role = token.role as "super_admin" | "user"
    session.user.orgId = token.orgId as string
    session.user.organizationRole =
      token.organizationRole as string | null

    session.user.employeeRole =
      token.employeeRole as string | null

    session.user.employeeId =
      token.employeeId as string | null

    session.user.subscriptionPlan =
      token.subscriptionPlan as any

    session.user.industry =
      token.industry as any

      session.user.permissions =
      token.permissions as any[];
  }

  return session
},
  },

  pages: {
    signIn: "/login",
  },
})