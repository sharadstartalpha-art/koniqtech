import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { projects: true },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // ✅ MUST MATCH next-auth.d.ts
        return {
          id: user.id,
          email: user.email,
          role: user.role || "USER", // ✅ FIXED
          projectId: user.projects?.[0]?.id || undefined,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ JWT
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // ✅ ADD THIS
        token.projectId = user.projectId;
      }

      if (trigger === "update" && session?.projectId) {
        token.projectId = session.projectId;
      }

      return token;
    },

    // ✅ SESSION
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // ✅ ADD THIS
      }

      session.projectId = token.projectId as string | undefined;

      return session;
    },

    // ✅ AUTO CREATE PROJECT
    async signIn({ user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { projects: true },
      });

      if (!dbUser) return false;

      if (!dbUser.projects.length) {
        const product = await prisma.product.findFirst();

        if (product) {
          await prisma.project.create({
            data: {
              name: "My First Project",
              userId: dbUser.id,
              productId: product.id,
            },
          });
        }
      }

      return true;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};