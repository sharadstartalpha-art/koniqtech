import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const users = await prisma.user.count();
  const projects = await prisma.project.count();
  const products = await prisma.product.count();
  const revenue = await prisma.transaction.aggregate({
    _sum: { amount: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <p>Users</p>
          <h2 className="text-2xl">{users}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p>Projects</p>
          <h2 className="text-2xl">{projects}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p>Products</p>
          <h2 className="text-2xl">{products}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p>Revenue</p>
          <h2 className="text-2xl">
            ${revenue._sum.amount ?? 0}
          </h2>
        </div>

      </div>
    </div>
  );
}