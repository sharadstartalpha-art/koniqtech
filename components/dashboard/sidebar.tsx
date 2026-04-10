"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/projects" },
  { name: "Leads", href: "/leads" },
  { name: "Credits", href: "/dashboard/credits" },
  { name: "Pricing", href: "/pricing" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r flex flex-col p-4">

      <div className="text-xl font-bold mb-6">
        KoniqTech 🚀
      </div>

      <nav className="space-y-2">
        {nav.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                active
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 💰 Upgrade box */}
      <div className="mt-auto bg-black text-white p-4 rounded-xl">
        <p className="text-sm">Upgrade to Pro</p>
        <p className="text-xs opacity-70 mt-1">
          Unlock more credits & features
        </p>

        <Link
          href="/pricing"
          className="block mt-3 text-center bg-white text-black py-1 rounded"
        >
          Upgrade
        </Link>
      </div>

    </div>
  );
}