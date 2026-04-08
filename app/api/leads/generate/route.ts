import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
 const session = await getServerSession(authOptions);

const user = await prisma.user.findFirst({
  where: {
    email: session?.user?.email,
  },
});

console.log("API USER ID:", user?.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log("GENERATE USER:", user.id);

  // ✅ GET PROJECT
  const project = await prisma.project.findFirst({
    where: { userId: user.id },
  });

  // ✅ CREATE LEAD
  await prisma.lead.create({
    data: {
      userId: user.id,
      projectId: project?.id,
      name: "Generated Lead",
      email: `lead${Date.now()}@test.com`,
      contactEmail: `lead${Date.now()}@test.com`,
      company: "Test Company",
    },
  });

  // ✅ DECREASE CREDIT
  await prisma.userBalance.update({
    where: { userId: user.id },
    data: {
      balance: { decrement: 1 },
    },
  });

  return NextResponse.json({ success: true });
}