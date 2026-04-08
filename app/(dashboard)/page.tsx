import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // ✅ STEP 1: GET SESSION FIRST
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // ✅ STEP 2: GET USER (using SAME logic as API)
  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email!, // safe now
    },
    include: { balance: true },
  });

  if (!user) {
    redirect("/login");
  }

  console.log("DASHBOARD USER ID:", user.id);

  // ✅ STEP 3: COUNT LEADS
  const leadsCount = await prisma.lead.count({
    where: {
      userId: user.id,
    },
  });

  console.log("LEADS COUNT:", leadsCount);

  // ✅ STEP 4: PASS TO CLIENT
  return <DashboardClient user={user} leadsCount={leadsCount} />;
}