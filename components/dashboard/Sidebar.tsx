"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Mail,
  Inbox,
  BarChart,
  DollarSign,
  CreditCard,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Mail },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Revenue", href: "/revenue", icon: DollarSign },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <div className="w-64 min-h-screen bg-black text-white flex flex-col p-4">

      <h1 className="text-xl font-bold mb-6">KoniqTech 🚀</h1>

      <div className="space-y-2 flex-1">
        {links.map((l) => {
          const Icon = l.icon;
          const active = path === l.href;

          return (
            <Link key={l.href} href={l.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  active
                    ? "bg-white text-black"
                    : "hover:bg-gray-800"
                }`}
              >
                <Icon size={18} />
                {l.name}
              </div>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-6 text-sm text-red-500 hover:text-red-400"
      >
        Logout
      </button>
    </div>
  );
}