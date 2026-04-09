import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: { balance: true },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>

      {users.map((u) => (
        <div key={u.id} className="bg-white p-4 mb-2 rounded shadow">
          <p>{u.email}</p>
          <p>Credits: {u.balance?.amount ?? 0}</p>
        </div>
      ))}
    </div>
  );
}