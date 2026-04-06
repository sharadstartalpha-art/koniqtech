import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // 👈 import from ONE place

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };