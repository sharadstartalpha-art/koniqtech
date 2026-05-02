"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  ChevronDown,
} from "lucide-react";

export default function AdminLayout({ children }: any) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => setUser(res.data));
  }, []);

  const logout = async () => {
    await axios.post("/api/auth/logout");
    window.location.href = "/login";
  };

  const nav = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafafa]">

      {/* SIDEBAR */}
      <aside className="w-60 border-r bg-white flex flex-col justify-between">

        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="h-14 flex items-center px-5 border-b">
            <Logo />
          </div>

          {/* NAV */}
          <nav className="p-3 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                    active
                      ? "bg-gray-100 text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t text-xs text-gray-400">
          <Logo />
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="h-14 border-b bg-white flex items-center justify-between px-6">

          <p className="text-sm text-gray-600">
            Admin Panel
          </p>

          {/* USER DROPDOWN */}
          <div className="relative">
            {user && (
              <>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-1 text-sm border px-3 py-1.5 rounded-md hover:bg-gray-50"
                >
                  {user.email}
                  <ChevronDown size={14} />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-sm z-50">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </header>

        {/* PAGE */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}