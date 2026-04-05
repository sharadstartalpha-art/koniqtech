import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // ✅ FIRST get session
  const session = await getServerSession(authOptions);

  // ✅ THEN check it
  if (!session) {
    redirect("/login");
  }

  // ✅ Fetch user with balance
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: { balance: true },
  });

  return <DashboardClient user={user} />;
}