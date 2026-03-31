import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

// ✅ EXPORT THIS
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: any) {
      if (!user?.email) return true;

      const dbUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name || "",
        },
      });

      await prisma.userCredits.upsert({
        where: { userId: dbUser.id },
        update: {},
        create: {
          userId: dbUser.id,
          credits: 20,
          plan: "FREE",
        },
      });

      return true;
    },
  },
};

// ✅ USE IT HERE
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };