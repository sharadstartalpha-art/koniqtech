import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { getServerSession } from "next-auth";

export async function requireAdmin() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
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

        return {
          id: user.id,
          email: user.email,
          role: user.role || "USER",
         projectId: user.projects?.[0]?.id || undefined,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 🔥 FIRST LOGIN
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.projectId = user.projectId;
      }

      // 🔁 UPDATE PROJECT SWITCH
      if (trigger === "update" && session?.projectId) {
        token.projectId = session.projectId;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      session.projectId = token.projectId as string | undefined;

      return session;
    },

    async signIn({ user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { projects: true },
      });
      
if (!dbUser) return false;

if (dbUser.isBanned) {
  throw new Error("User is banned");
}

       if (!dbUser.workspaceId) {
         const workspace = await prisma.workspace.create({
    data: {
      name: "My Workspace",
    },
  });

  await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      workspaceId: workspace.id,
    },
  });
}


      // 🔥 AUTO CREATE PROJECT
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