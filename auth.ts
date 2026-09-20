import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

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
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null
        }

        const email = String(
          credentials.email
        )
          .trim()
          .toLowerCase()

        const password = String(
          credentials.password
        )

        const user =
          await prisma.user.findUnique({
            where: {
              email,
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

        /*
        --------------------------------------------------
        USER NOT FOUND
        --------------------------------------------------
        */

        if (!user) {
          return null
        }

        /*
        --------------------------------------------------
        PASSWORD CHECK
        --------------------------------------------------
        */

        const validPassword =
          await bcrypt.compare(
            password,
            user.passwordHash
          )

        if (!validPassword) {
          return null
        }

        /*
        --------------------------------------------------
        INACTIVE USER CHECK
        --------------------------------------------------

        This is the important part.

        An inactive user MUST NOT receive
        an authenticated session.
        --------------------------------------------------
        */

        if (
          String(user.status)
            .trim()
            .toLowerCase() !== "active"
        ) {
          return null
        }

        /*
        --------------------------------------------------
        INTERNAL EMPLOYEE CHECK
        --------------------------------------------------

        Employee records belong to the internal
        KoniqTech platform.

        Customer CRM users use organizationRole.
        --------------------------------------------------
        */

        const isInternalEmployee =
          Boolean(user.employee)

        /*
        --------------------------------------------------
        SUBSCRIPTION PLAN
        --------------------------------------------------
        */

        const subscriptionPlan =
          user.organization.subscriptions &&
          user.organization.subscriptions.status ===
            "active"
            ? user.organization.subscriptions.plan
            : user.organization.plan

        /*
        --------------------------------------------------
        RETURN AUTH USER
        --------------------------------------------------
        */

        return {
          id: user.id,

          email: user.email,

          name: user.name,

          role: user.role,

          orgId: user.orgId,

          status: user.status,

          organizationRole:
            user.organizationRole?.name ??
            null,

          employeeRole:
            user.employee?.role?.name ??
            null,

          employeeId:
            user.employee?.id ??
            null,

          isInternalEmployee,

          subscriptionPlan,

          industry:
            user.organization.industry,
        }
      },
    }),
  ],

  callbacks: {
    /*
    --------------------------------------------------
    JWT CALLBACK
    --------------------------------------------------
    */

    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id = user.id

        token.role = user.role

        token.orgId = user.orgId

        token.status = user.status

        token.organizationRole =
          user.organizationRole

        token.employeeRole =
          user.employeeRole

        token.employeeId =
          user.employeeId

        token.isInternalEmployee =
          user.isInternalEmployee

        token.subscriptionPlan =
          user.subscriptionPlan

        token.industry =
          user.industry
      }

      return token
    },

    /*
    --------------------------------------------------
    SESSION CALLBACK
    --------------------------------------------------
    */

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string

        session.user.role =
          token.role as "super_admin" | "user"

        session.user.orgId =
          token.orgId as string

        session.user.status =
          String(
            token.status ?? "inactive"
          )

        session.user.organizationRole =
          token.organizationRole as
            | string
            | null

        session.user.employeeRole =
          token.employeeRole as
            | string
            | null

        session.user.employeeId =
          token.employeeId as
            | string
            | null

        session.user.isInternalEmployee =
          Boolean(
            token.isInternalEmployee
          )

        session.user.subscriptionPlan =
          token.subscriptionPlan as any

        session.user.industry =
          token.industry as
            | string
            | null
      }

      return session
    },
  },

  pages: {
    signIn: "/login",
  },
})