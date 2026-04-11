import { prisma } from "@/lib/prisma";

export default async function TeamPage() {
  const users = await prisma.user.findMany();

  const pricePerUser = 10;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">

      <h1 className="text-2xl font-bold">Team 👥</h1>

      {users.map((u) => (
        <div key={u.id} className="bg-white p-4 border rounded">
          {u.email}
        </div>
      ))}

      <div className="bg-black text-white p-6 rounded-xl">
        <p>Total Seats: {users.length}</p>
        <h2 className="text-xl font-bold">
          Billing: ${users.length * pricePerUser}/month
        </h2>
      </div>

    </div>
  );
}