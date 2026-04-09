import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export default async function UsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    include: {
      balance: true,
      projects: true,
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>

      <div className="grid gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{u.email}</p>

            {/* ✅ FIXED */}
            <p>Credits: {u.balance?.amount || 0}</p>

            <p>Projects: {u.projects.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}