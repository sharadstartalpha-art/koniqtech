import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/email";

export async function GET() {
  const emails = await prisma.emailQueue.findMany({
    where: {
      status: "PENDING",
      scheduledAt: { lte: new Date() },
    },
    take: 20,
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
        data: { status: "FAILED" },
      });
    }
  }

  return Response.json({ sent: emails.length });
}