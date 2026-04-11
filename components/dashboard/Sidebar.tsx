"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Leads", href: "/leads" },
  { name: "Campaigns", href: "/campaigns" },
  { name: "Inbox", href: "/inbox" },
  { name: "Analytics", href: "/analytics" },
  { name: "Revenue", href: "/revenue" },
  { name: "Billing", href: "/dashboard/billing" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <div className="w-64 h-screen bg-black text-white p-6">

      <h1 className="text-xl font-bold mb-6">KoniqTech 🚀</h1>

      <div className="space-y-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <div
              className={`p-2 rounded cursor-pointer ${
                path === l.href ? "bg-white text-black" : "hover:bg-gray-800"
              }`}
            >
              {l.name}
            </div>
          </Link>
        ))}
      </div>

<button
  onClick={() => signOut({ callbackUrl: "/" })}
  className="mt-6 text-sm text-red-500"
>
  Logout
</button>

    </div>
  );
}