import { prisma } from "./prisma";

export async function getUser() {
  // TEMP: replace later with real auth
  return prisma.user.findFirst();
}