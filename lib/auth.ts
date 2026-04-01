import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
}