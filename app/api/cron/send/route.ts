import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/email";

export async function GET() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const limit = user.dailyLimit || 20;

    const emails = await prisma.emailQueue.findMany({
      where: {
        userId: user.id,
        status: "PENDING",
        scheduledAt: { lte: new Date() },
      },
      take: limit,
    });

    for (const e of emails) {
      try {
        await resend.emails.send({
          from: "KoniqTech <onboarding@resend.dev>",
          to: e.email,
          subject: e.subject,
          html: e.body,
        });

        await prisma.emailQueue.update({
          where: { id: e.id },
          data: { status: "SENT" },
        });

      } catch {
        await prisma.emailQueue.update({
          where: { id: e.id },
          data: {
            attempts: { increment: 1 },
          },
        });
      }
    }

    // 🔥 WARMUP INCREASE
    await prisma.user.update({
      where: { id: user.id },
      data: {
        dailyLimit: {
          increment: 5,
        },
      },
    });
  }

  return Response.json({ success: true });
}