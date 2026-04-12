import { prisma } from "@/lib/prisma";

export async function calculateSeats(workspaceId: string) {
  return prisma.user.count({
    where: { workspaceId },
  });
}

export function calculatePrice(seats: number) {
  return Math.max(0, (seats - 3) * 10);
}