"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Collect Data", href: "/admin/collect" }, // ✅ NEW
  { name: "Leads", href: "/admin/leads" }, // ✅ NEW
  { name: "Users", href: "/admin/users" },
  { name: "Analytics", href: "/admin/analytics" },
  { name: "Revenue", href: "/admin/revenue" },
  { name: "Transactions", href: "/admin/transactions" },
  { name: "Products", href: "/admin/products" },
  { name: "Reports", href: "/admin/reports" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-black text-white min-h-screen p-6 space-y-6">

      <h2 className="text-xl font-bold">Admin 👑</h2>

      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded ${
              pathname === link.href
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}