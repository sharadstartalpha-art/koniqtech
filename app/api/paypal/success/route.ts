import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const userId = url.searchParams.get("userId");
  const plan = url.searchParams.get("plan");

  if (!userId || !plan) {
    return new Response("Missing params", { status: 400 });
  }

  let creditsToAdd = 0;

  if (plan === "PRO") creditsToAdd = 100;
  if (plan === "AGENCY") creditsToAdd = 500;

  await prisma.balance.upsert({
    where: { userId },
    update: {
      amount: {
        increment: creditsToAdd,
      },
    },
    create: {
      userId,
      amount: creditsToAdd,
    },
  });

  return Response.redirect("https://koniqtech.com/dashboard");
}