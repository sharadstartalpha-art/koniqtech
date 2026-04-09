import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      projectId?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    projectId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    projectId?: string;
  }
}