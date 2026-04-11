import { prisma } from "@/lib/prisma";

export async function switchWorkspace(userId: string, workspaceId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { workspaceId },
  });
}