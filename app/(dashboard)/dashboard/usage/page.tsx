import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsagePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // ✅ FETCH USER FIRST
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.workspaceId) {
    return <div>No workspace found</div>;
  }

  // ✅ NOW SAFE
  const usage = await prisma.usage.findMany({
    where: { userId: user.id }, // 🔥 FIXED (no workspaceId needed)
    include: { user: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Usage 📊</h1>

      {usage.map((u) => (
        <div key={u.id} className="flex justify-between border p-3 rounded">
          <span>{u.user.email}</span>
          <span>{u.action}</span>
          <span>-{u.credits}</span>
        </div>
      ))}
    </div>
  );
}