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
  secret:
    process.env.AUTH_SECRET,

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
        /* =====================================================
           VALIDATE INPUT
        ===================================================== */

        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null
        }

        const email =
          String(
            credentials.email
          )
            .trim()
            .toLowerCase()

        /* =====================================================
           LOAD USER
        ===================================================== */

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

        if (!user) {
          return null
        }

        /* =====================================================
           PASSWORD
        ===================================================== */

        const validPassword =
          await bcrypt.compare(
            String(
              credentials.password
            ),
            user.passwordHash
          )

        if (!validPassword) {
          return null
        }

        /* =====================================================
           INTERNAL EMPLOYEE
           
           Internal employee requires:
           
           1. linked Employee
           2. Employee.active = true
           3. organization slug = platform
        ===================================================== */

        const isInternalEmployee =
          Boolean(
            user.employee &&
            user.employee.active &&
            user.organization?.slug ===
              "platform"
          )

        /* =====================================================
           EMPLOYEE ROLE
        ===================================================== */

        const employeeRole =
          isInternalEmployee
            ? user.employee?.role?.name ??
              null
            : null

        /* =====================================================
           CUSTOMER ORGANIZATION ROLE
        ===================================================== */

        const organizationRole =
          user.organizationRole?.name ??
          null

        /* =====================================================
           SUBSCRIPTION
        ===================================================== */

        const subscriptionPlan =
          user.organization
            .subscriptions &&
          user.organization
            .subscriptions.status ===
            "active"
            ? user.organization
                .subscriptions.plan
            : user.organization.plan

        /* =====================================================
           RETURN AUTH USER
        ===================================================== */

        return {
          id:
            user.id,

          email:
            user.email,

          name:
            user.name,

          role:
            user.role,

          orgId:
            user.orgId,

          organizationRole,

          employeeRole,

          employeeId:
            isInternalEmployee
              ? user.employee?.id ??
                null
              : null,

          isInternalEmployee,

          subscriptionPlan,

          industry:
            user.organization.industry,
        }
      },
    }),
  ],

  /* =========================================================
     CALLBACKS
  ========================================================= */

  callbacks: {
    /* =======================================================
       JWT
    ======================================================= */

    async jwt({
      token,
      user,
    }) {
      if (user) {
        token.id =
          user.id

        token.role =
          user.role

        token.orgId =
          user.orgId

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

    /* =======================================================
       SESSION
    ======================================================= */

    async session({
      session,
      token,
    }) {
      if (session.user) {
        session.user.id =
          token.id as string

        session.user.role =
          token.role as
            | "super_admin"
            | "user"

        session.user.orgId =
          token.orgId as string

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
          token.industry as any
      }

      return session
    },
  },

  /* =========================================================
     PAGES
  ========================================================= */

  pages: {
    signIn:
      "/login",
  },
})