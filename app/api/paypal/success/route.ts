import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const plan = url.searchParams.get("plan");

  let creditsToAdd = 0;

  if (plan === "PRO") creditsToAdd = 100;
  if (plan === "AGENCY") creditsToAdd = 500;

  // 🔥 UPSERT (important)
  await prisma.userCredits.upsert({
    where: { userId: userId! },
    update: {
      credits: {
        increment: creditsToAdd,
      },
    },
    create: {
      userId: userId!,
      credits: creditsToAdd,
    },
  });

  return Response.redirect("https://koniqtech.com/dashboard");
}