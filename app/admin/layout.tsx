// app/admin/layout.tsx

import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { INTERNAL_PLATFORM_ROLES } from "@/shared/config/roles"
import AdminSidebar from "@/shared/components/admin/AdminSidebar"
import AdminHeader from "@/shared/components/admin/AdminHeader"

/* ==========================================================
   KONIQTECH INTERNAL PLATFORM ROLES
   Only these users can access /admin/*
========================================================== */


export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  /* --------------------------------------------------------
     User must be logged in
  --------------------------------------------------------- */

  if (!session?.user) {
    redirect("/login")
  }

  /* --------------------------------------------------------
     Normalize role
  --------------------------------------------------------- */

  const role = String(
    (session.user as any).role ?? ""
  ).trim().toLowerCase()

  /* --------------------------------------------------------
     Customer CRM users are NOT allowed here
  --------------------------------------------------------- */

  if (!INTERNAL_PLATFORM_ROLES.has(role)) {
    redirect("/dashboard")
  }

  /* --------------------------------------------------------
     Render Admin Platform
  --------------------------------------------------------- */

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Left Sidebar */}

      <AdminSidebar />

      {/* Right Content */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Top Header */}

        <AdminHeader />

        {/* Page Content */}

        <main
          className="
            flex-1
            overflow-y-auto
            bg-slate-50
            p-8
          "
        >
          {children}
        </main>

      </div>

    </div>
  )
}