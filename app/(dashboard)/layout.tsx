import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-6">KoniqTech</h2>

        <nav className="space-y-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/credits">Credits</Link>
          <Link href="/pricing">Upgrade</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  )
}