"use client";

import Link from "next/link";

export default function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* 🔥 SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold mb-8 block">
          KoniqTech
        </Link>

        {/* NAV */}
        <nav className="space-y-4 text-sm text-gray-700">

          <Link
            href="/products/invoice-recovery/dashboard"
            className="block hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/products/invoice-recovery/invoices"
            className="block hover:text-blue-600 transition"
          >
            Invoices
          </Link>

          <Link
            href="/products/invoice-recovery/reminders"
            className="block hover:text-blue-600 transition"
          >
            Reminders
          </Link>

        </nav>
      </aside>

      {/* 🔥 CONTENT */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}