"use client";

import Link from "next/link";

export default function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <aside className="w-60 bg-white shadow-md p-6">

        {/* LOGO (click → home) */}
        <Link href="/" className="text-xl font-bold mb-8 block">
          KoniqTech
        </Link>

        {/* NAV */}
        <nav className="flex flex-col gap-3 text-gray-700">

          <Link
            href="/products/invoice-recovery/dashboard"
            className="hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            href="/products/invoice-recovery/invoices"
            className="hover:text-blue-600"
          >
            Invoices
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