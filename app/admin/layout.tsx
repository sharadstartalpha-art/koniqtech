// app/admin/layout.tsx

import { ReactNode } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import AdminSidebar from "@/shared/components/admin/AdminSidebar"
import AdminHeader from "@/shared/components/admin/AdminHeader"

export default async function AdminLayout({
  children
}: {
  children: ReactNode
}) {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if ((session.user as any).role !== "super_admin") {
    redirect("/dashboard")
  }

  return (

    <div
      className="
      h-screen
      flex
      overflow-hidden
      bg-slate-50
      "
    >

      <AdminSidebar />

      <div
        className="
        flex-1
        flex
        flex-col
        overflow-hidden
        "
      >

        <AdminHeader />

        <main
          className="
          flex-1
          overflow-y-auto
          p-8
          "
        >

          {children}

        </main>

      </div>

    </div>

  )

}