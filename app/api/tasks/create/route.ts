import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendNotification } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";
import { extractMentions } from "@/lib/mentions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, teamId, assignedToId } = await req.json();

  if (!title || !teamId) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  // ✅ 1. Create task
  const task = await prisma.task.create({
    data: {
      title,
      description,
      teamId,
      createdById: session.user.id,
      assignedToId,
    },
  });

  // 🔔 2. Notify assigned user
  if (assignedToId) {
    await sendNotification(
      assignedToId,
      `You were assigned a task: ${title}`,
      teamId
    );
  }

  // 🔥 3. HANDLE MENTIONS
  if (description) {
    const mentions = extractMentions(description);

    for (const username of mentions) {
      const user = await prisma.user.findFirst({
        where: {
          email: {
            contains: username,
          },
        },
      });

      // ❗ avoid notifying same assigned user twice
      if (user && user.id !== assignedToId) {
        await sendNotification(
          user.id,
          `You were mentioned in a task: "${title}"`,
          teamId
        );
      }
    }
  }

  // ⚡ 4. Activity log
  await logActivity(
    session.user.id,
    "TASK_CREATED",
    `Created task "${title}"`,
    teamId
  );

  return Response.json(task);
}