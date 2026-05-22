import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/shared/lib/prisma"
import bcrypt from "bcryptjs"

export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({

  session: {
    strategy: "jwt"
  },

  providers: [

    Credentials({

      credentials: {

        email: {},

        password: {}

      },

      async authorize(credentials) {

        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null
        }

        const user =
          await prisma.user.findUnique({

            where: {
              email:
                String(
                  credentials.email
                )
            }

          })

        if (!user) {
          return null
        }

        const ok =
          await bcrypt.compare(

            String(
              credentials.password
            ),

            user.passwordHash
          )

        if (!ok) {
          return null
        }

        return {

          id: user.id,

          name: user.name,

          email: user.email,

          role: user.role,

          orgId: user.orgId

        }

      }

    })

  ],

  callbacks: {

    async jwt({

      token,

      user

    }) {

      if (user) {

        token.id =
          (user as any).id

        token.role =
          (user as any).role

        token.orgId =
          (user as any).orgId

      }

      return token

    },

    async session({

      session,

      token

    }) {

      if (session.user) {

        ;(
          session.user as any
        ).id =
          String(
            token.id || ""
          )

        ;(
          session.user as any
        ).role =
          String(
            token.role || ""
          )

        ;(
          session.user as any
        ).orgId =
          String(
            token.orgId || ""
          )

      }

      return session

    }

  },

  pages: {

    signIn: "/login"

  },

  secret:
    process.env.AUTH_SECRET

})