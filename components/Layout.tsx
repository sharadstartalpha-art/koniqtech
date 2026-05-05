"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Header from "./Header";

import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  FileText,
  Mail,
  Link as LinkIcon,
  User,
  Settings
} from "lucide-react";
import { write } from "fs";

export default function Layout({ children }: any) {
  const pathname = usePathname();

  const nav = [
    {
      name: "Dashboard",
      href: "/products/invoice-recovery/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Invoices",
      href: "/products/invoice-recovery/invoices",
      icon: FileText,
    },
    {
      name: "Reminders",
      href: "/products/invoice-recovery/reminders",
      icon: Mail,
    },
    {
      name: "Payment Links",
      href: "/products/invoice-recovery/links",
      icon: LinkIcon,
    },
    {
      name: "Account", // ✅ NEW
      href: "/products/invoice-recovery/account",
      icon: User,
    },
    {
      name: "Settings", // ✅ NEW
      href: "/products/invoice-recovery/settings",
      icon: Settings,
    },

    {
      name: "Templates", // ✅ NEW
      href: "/products/invoice-recovery/settings/templates",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#fafafa] text-[14px]">

      {/* SIDEBAR */}
      <aside className="w-[220px] border-r bg-white flex flex-col">

        {/* LOGO */}
        <div className="h-14 flex items-center px-4 border-b font-semibold">
          <Logo />
        </div>

        {/* NAV */}
        <div className="p-2 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                  active
                    ? "bg-gray-100 text-black font-medium"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="mt-auto p-3 border-t text-xs text-gray-400">
          <Logo />
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto px-8 py-6">
          <div className="w-full max-w-[1100px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}