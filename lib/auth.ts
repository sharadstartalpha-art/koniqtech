import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

//
// 🔐 ADMIN GUARD
//
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

//
// 🔥 NEXTAUTH CONFIG (TEAM-BASED)
//
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
          include: {
            projects: true,
            teamMembers: {
              include: { team: true },
            },
          },
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
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    //
    // 🔐 JWT
    //
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    //
    // 🔐 SESSION
    //
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },

    //
    // 🔐 SIGN IN HOOK
    //
    async signIn({ user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: {
          teamMembers: true,
          projects: true,
        },
      });

      if (!dbUser) return false;

      // 🚫 BAN CHECK
      if (dbUser.isBanned) {
        throw new Error("User is banned");
      }

      // 🔥 CREATE TEAM IF NONE
      if (!dbUser.teamMembers.length) {
        const team = await prisma.team.create({
          data: {
            name: "My Team",
            ownerId: dbUser.id,
            members: {
              create: {
                userId: dbUser.id,
                role: "OWNER",
              },
            },
          },
        });
      }

      // 🚀 AUTO CREATE PROJECT
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