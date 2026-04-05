import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

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
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // ✅ SESSION
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    // ✅ SIGN IN LOGIC (MERGED PROPERLY)
 async signIn({ user }) {
  // ✅ Ensure balance exists
  const existingBalance = await prisma.userBalance.findUnique({
    where: { userId: user.id },
  });

  if (!existingBalance) {
    await prisma.userBalance.create({
      data: {
        userId: user.id,
        balance: 20,
      },
    });
  }

  // ✅ Get user with projects
  const existing = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { projects: true },
  });

  // 🔥 CREATE PROJECT FIRST
  if (!existing?.projects?.length) {
    const product = await prisma.product.findFirst();

    await prisma.project.create({
      data: {
        name: "My First Project",
        userId: user.id,
        productId: product!.id,
      },
    });

    // 👉 THEN redirect
    return "/onboarding";
  }

  return true;
}
  },

    // ✅ REDIRECT FIX
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};