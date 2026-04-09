import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const plan = url.searchParams.get("plan");

  let balanceToAdd = 0;

  if (plan === "PRO") balanceToAdd = 100;
  if (plan === "AGENCY") balanceToAdd = 500;

  // 🔥 UPSERT (important)
  await prisma.balance.upsert({
    where: { userId: userId! },
    update: {
      amount: {
        increment: balanceToAdd,
      },
    },
    create: {
      userId: userId!,
      amount: balanceToAdd,
    },
  });

  return Response.redirect("https://koniqtech.com/dashboard");
}