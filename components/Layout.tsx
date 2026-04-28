"use client";

import Link from "next/link";
import { useState } from "react";

export default function Layout({ children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* 🔥 SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col">

        {/* LOGO */}
        <div className="p-6 border-b">
          <Link href="/" className="text-lg font-semibold">
            KoniqTech
          </Link>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2 text-sm">

          <Link
            href="/products/invoice-recovery/dashboard"
            className="block px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/products/invoice-recovery/invoices"
            className="block px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            Invoices
          </Link>

          <Link
            href="/products/invoice-recovery/reminders"
            className="block px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            Reminders
          </Link>

        </nav>
      </aside>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 TOP HEADER (LIKE RESEND) */}
        <header className="h-14 bg-white border-b flex items-center justify-end px-6">

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
            >
              jhadipu@gmail.com
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
                <button
                  onClick={() => {
                    document.cookie = "token=; Max-Age=0; path=/;";
                    window.location.href = "/login";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </header>

        {/* 🔥 MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </div>
    </div>
  );
}