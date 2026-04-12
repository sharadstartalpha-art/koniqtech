"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-black text-white min-h-screen p-4 space-y-4">

      <h2 className="text-xl font-bold">Admin 👑</h2>

      <Link href="/admin/dashboard">Dashboard</Link>
      <Link href="/admin/users">Users</Link>
      <Link href="/admin/analytics">Analytics</Link>
      <Link href="/admin/revenue">Revenue</Link>
      <Link href="/admin/reports">Reports</Link>

    </div>
  );
}