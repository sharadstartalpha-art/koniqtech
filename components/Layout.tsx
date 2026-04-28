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
    <div className="flex h-screen bg-[#f8fafc]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col">

        <div className="h-14 flex items-center px-6 border-b font-semibold">
          KoniqTech
        </div>

        <nav className="flex-1 p-3 space-y-1 text-sm">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md transition ${
                  active
                    ? "bg-gray-100 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => setOpen(!open)}
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
          >
            jhadipu@gmail.com
          </button>

          {open && (
            <div className="mt-2 border rounded shadow bg-white">
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
          <span className="text-sm text-gray-700 font-medium">
            Invoice Recovery
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}