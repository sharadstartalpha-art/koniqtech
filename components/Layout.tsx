"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Header from "./Header";
import { LayoutDashboard, FileText, Mail } from "lucide-react";

export default function Layout({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const pathname = usePathname();

  if (!slug) {
    return <div className="p-6">Invalid product</div>;
  }

  const nav = [
    {
      name: "Dashboard",
      href: `/products/${slug}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Invoices",
      href: `/products/${slug}/invoices`,
      icon: FileText,
    },
    {
      name: "Reminders",
      href: `/products/${slug}/reminders`,
      icon: Mail,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#fafafa] text-sm">
      {/* SIDEBAR */}
      <aside className="w-[220px] border-r bg-white flex flex-col">
        <div className="h-14 flex items-center px-4 border-b font-semibold">
          KoniqTech
        </div>

        <div className="p-2 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
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
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto px-8 py-6">
          <div className="max-w-[1100px]">{children}</div>
        </main>
      </div>
    </div>
  );
}