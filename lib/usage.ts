import { prisma } from "@/lib/prisma";

export async function deductCredits(
  userId: string,
  amount: number,
  action: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workspace: true },
  });

  if (!user || !user.workspace) {
    throw new Error("Workspace not found");
  }

  const workspace = user.workspace;

  if (workspace.credits < amount) {
    throw new Error("NO_CREDITS");
  }

  // ✅ deduct from workspace
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      credits: {
        decrement: amount,
      },
    },
  });

  // ✅ track usage
  await prisma.usage.create({
    data: {
      userId,
      workspaceId: workspace.id,
      action,
      credits: amount,
    },
  });
}

/* CHECK ONLY */
export async function checkUsage(userId: string, cost: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const workspace = await prisma.workspace.findUnique({
    where: { id: user?.workspaceId! },
  });

  if ((workspace?.credits || 0) < cost) {
    throw new Error("NO_CREDITS");
  }
}