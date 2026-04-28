"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Layout({ children }: any) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", href: "/products/invoice-recovery/dashboard" },
    { name: "Invoices", href: "/products/invoice-recovery/invoices" },
    { name: "Reminders", href: "/products/invoice-recovery/reminders" },
  ];

  return (
    <div className="flex h-screen bg-[#f6f6f7]">

      {/* 🔥 SIDEBAR (LIKE RESEND) */}
      <aside className="w-60 bg-white border-r flex flex-col">

        {/* LOGO */}
        <div className="h-14 flex items-center px-5 border-b font-semibold text-sm">
          KoniqTech
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">

          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md ${
                  active
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

        </nav>

        {/* USER */}
        <div className="p-3 border-t">
          <button
            onClick={() => setOpen(!open)}
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
          >
            jhadipu@gmail.com
          </button>

          {open && (
            <div className="mt-2 border rounded bg-white shadow-sm">
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
      </aside>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 HEADER (FULL WIDTH LIKE RESEND) */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">

          <div className="text-sm font-medium text-gray-700">
            Invoice Recovery
          </div>

          <div className="text-sm text-gray-500">
            Dashboard
          </div>
        </header>

        {/* 🔥 CONTENT (NOT CENTERED — LEFT ALIGNED LIKE RESEND) */}
        <main className="flex-1 overflow-y-auto p-6">

          <div className="max-w-6xl">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}