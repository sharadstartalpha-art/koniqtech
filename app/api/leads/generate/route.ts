import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { industry, location, title } = await req.json();

  // 🔐 USER (mock or session)
  const user = await prisma.user.findFirst({
    include: { projects: true },
  });

  if (!user || user.credits <= 0) {
    return new Response("No credits", { status: 403 });
  }

  const leads = Array.from({ length: 10 }).map((_, i) => ({
    name: `${title || "Founder"} ${i}`,
    email: `lead${i}@${industry || "company"}.com`,
    company: `${industry || "Tech"} Corp`,
    score: Math.floor(Math.random() * 100),
  }));

  // 💰 COST
  const cost = 1;

  if (user.credits < cost) {
    return new Response("Not enough credits", { status: 403 });
  }

  // ✅ DEDUCT
  await prisma.user.update({
    where: { id: user.id },
    data: {
      credits: {
        decrement: cost,
      },
    },
  });

  return NextResponse.json({ leads });
}