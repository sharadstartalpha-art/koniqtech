import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {
  const users = await prisma.user.count()
  const projects = await prisma.project.count()
  const transactions = await prisma.transaction.count()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Users" value={users} />
        <Card title="Projects" value={projects} />
        <Card title="Transactions" value={transactions} />
      </div>
    </div>
  )
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  )
}