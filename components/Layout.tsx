"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Header from "./Header";

export default function Layout({ children }: any) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/products/invoice-recovery/dashboard" },
    { name: "Invoices", href: "/products/invoice-recovery/invoices" },
    { name: "Reminders", href: "/products/invoice-recovery/reminders" },
  ];

  return (
    <div className="flex h-screen bg-[#f6f6f7]">

      {/* 🔥 SIDEBAR */}
      <aside className="w-60 bg-white border-r flex flex-col">

        {/* LOGO (ONLY HERE) */}
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
      </aside>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}