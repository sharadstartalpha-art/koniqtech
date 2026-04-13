import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  await requireAdmin();

  const { userId, amount } = await req.json();

  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });


 await prisma.transaction.create({
    data: {
      userId,
      type: "USAGE",
       amount: -1,
    },
  });

  return Response.json({ success: true });
}