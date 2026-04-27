import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔥 Add your provider (Google, Credentials, etc.)
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // ✅ safe + clean
      }
      return session;
    },
  },
};