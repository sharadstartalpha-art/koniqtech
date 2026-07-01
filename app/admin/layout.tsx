// app/admin/layout.tsx

import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"

import AdminSidebar from "@/shared/components/admin/AdminSidebar"
import AdminHeader from "@/shared/components/admin/AdminHeader"

const INTERNAL_ROLES = [
  "super_admin",
  "manager",
  "sales",
  "marketing",
  "accountant",
  "support",
  "data_entry",
] as const

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = (session.user as any).role

  if (!INTERNAL_ROLES.includes(role)) {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Side */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}