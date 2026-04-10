"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  { name: "Products", href: "/admin/products" },
  { name: "Projects", href: "/admin/projects" },
  { name: "Payments", href: "/admin/payments" },
  { name: "Analytics", href: "/admin/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-black text-white p-4">
      <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>

      {nav.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-3 py-2 rounded mb-1 ${
              active ? "bg-white text-black" : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}