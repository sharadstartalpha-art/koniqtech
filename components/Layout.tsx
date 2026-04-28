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
    <div className="flex h-screen bg-[#f9fafb]">

      {/* 🔥 SIDEBAR (RESEND STYLE) */}
      <aside className="w-56 bg-white border-r flex flex-col">

        {/* LOGO */}
        <div className="h-14 flex items-center px-5 border-b text-sm font-semibold">
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
                className={`block px-3 py-2 rounded-md transition ${
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
            className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-100"
          >
            jhadipu@gmail.com
          </button>

          {open && (
            <div className="mt-2 bg-white border rounded shadow-sm">
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

      {/* 🔥 MAIN */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 TOP HEADER (NOT FULL WIDTH LIKE YOURS) */}
        <div className="h-14 border-b bg-white flex items-center px-8">
          <span className="text-sm text-gray-700 font-medium">
            Invoice Recovery
          </span>
        </div>

        {/* 🔥 CONTENT (KEY FIX → CENTERED LIKE RESEND) */}
        <main className="flex-1 overflow-y-auto px-8 py-8">

          <div className="max-w-5xl mx-auto">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}