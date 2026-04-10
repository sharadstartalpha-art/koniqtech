import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { industry, location, title } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { balance: true },
  });

  // ✅ FIX 1: NULL SAFE
  if (!user || !user.balance || user.balance.amount <= 0) {
    return new Response("No credits", { status: 403 });
  }

  // ✅ FIX 2: REQUIRE PROJECT
  const projectId = session?.projectId;

  if (!projectId) {
    return new Response("No project selected", { status: 400 });
  }

  // 🔥 FAKE LEADS (REALISTIC)
  const leads = Array.from({ length: 5 }).map((_, i) => ({
    name: `${title || "Founder"} ${i}`,
    email: `lead${Date.now()}${i}@${industry || "company"}.com`,
    company: `${industry || "Tech"} Corp ${i}`,
  }));

  // 💾 SAVE
  const created = await Promise.all(
    leads.map((lead) =>
      prisma.lead.create({
        data: {
          name: lead.name,
          email: lead.email,
          company: lead.company,
          userId: user.id,
          projectId, // ✅ REQUIRED
        },
      })
    )
  );

  // 💰 deduct credit
  await prisma.balance.update({
    where: { userId: user.id },
    data: {
      amount: {
        decrement: 1,
      },
    },
  });

  return NextResponse.json({ leads: created });
}