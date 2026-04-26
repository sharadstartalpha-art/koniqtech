import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const users = await prisma.user.count();
  const invoices = await prisma.invoice.count();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 border">Users: {users}</div>
        <div className="p-4 border">Invoices New: {invoices}</div>
      </div>
    </div>
  );
}