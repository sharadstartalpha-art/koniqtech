"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Logo from "@/components/Logo";

import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  ChevronDown,
  Bell,
  Search,
  ShieldCheck,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function AdminLayout({
  children,
}: any) {
  const pathname =
    usePathname();

  const [user, setUser] =
    useState<any>(null);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    axios
      .get("/api/auth/me")
      .then((res) =>
        setUser(
          res.data
        )
      );
  }, []);

  const logout =
    async () => {
      await axios.post(
        "/api/auth/logout"
      );

      window.location.href =
        "/login";
    };

  const nav = [
    {
      name: "Overview",
      href: "/admin",
      icon:
        LayoutDashboard,
    },

    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },

    {
      name: "Products",
      href:
        "/admin/products",
      icon: Package,
    },

    {
      name: "Analytics",
      href:
        "/admin/analytics",
      icon:
        BarChart3,
    },

    {
      name: "Billing",
      href:
        "/admin/billing",
      icon:
        CreditCard,
    },

    {
      name: "Settings",
      href:
        "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f8fb]">

      {/* SIDEBAR */}

      <aside className="w-[270px] bg-white border-r border-gray-200 flex flex-col justify-between">

        {/* TOP */}

        <div>

          {/* LOGO */}

          <div className="h-20 flex items-center px-6 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="bg-orange-500 text-white p-2.5 rounded-2xl shadow-sm">

                <ShieldCheck
                  size={20}
                />

              </div>

              <div>

                <p className="font-bold text-lg text-gray-900">
                  KoniqTech
                </p>

                <p className="text-xs text-gray-400">
                  Admin Console
                </p>

              </div>

            </div>

          </div>

          {/* SEARCH */}

          <div className="px-4 py-5">

            <div className="relative">

              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                placeholder="Search..."
                className="w-full bg-gray-100 border border-transparent focus:border-orange-500 focus:bg-white outline-none transition rounded-2xl pl-11 pr-4 py-3 text-sm"
              />

            </div>

          </div>

          {/* NAV */}

          <nav className="px-3 space-y-1">

            {nav.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={
                      item.name
                    }
                    href={
                      item.href
                    }
                    className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                      active
                        ? "bg-black text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <Icon
                        size={
                          18
                        }
                      />

                      <span className="text-sm font-medium">
                        {
                          item.name
                        }
                      </span>

                    </div>

                    {active && (
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                    )}

                  </Link>
                );
              }
            )}

          </nav>

        </div>

        {/* FOOTER */}

        <div className="p-4 border-t border-gray-100">

          <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl p-5 text-white shadow-lg">

            <p className="text-sm font-medium opacity-90">
              KoniqTech Pro
            </p>

            <h3 className="text-xl font-bold mt-1">
              Admin Access
            </h3>

            <p className="text-xs mt-2 opacity-80 leading-5">
              Manage platform users,
              subscriptions, analytics,
              invoices and recovery
              automation.
            </p>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}

        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

          {/* LEFT */}

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Monitor platform growth
              and customer activity.
            </p>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-5">

            {/* NOTIFICATION */}

            <button className="relative w-11 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition">

              <Bell
                size={18}
                className="text-gray-600"
              />

              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />

            </button>

            {/* USER */}

            {user && (
              <div className="relative">

                <button
                  onClick={() =>
                    setOpen(
                      !open
                    )
                  }
                  className="flex items-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-2xl transition"
                >

                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-semibold shadow-sm">
                    {user.email
                      ?.charAt(
                        0
                      )
                      .toUpperCase()}
                  </div>

                  <div className="text-left hidden md:block">

                    <p className="text-sm font-medium text-gray-900">
                      Admin
                    </p>

                    <p className="text-xs text-gray-500">
                      {
                        user.email
                      }
                    </p>

                  </div>

                  <ChevronDown
                    size={16}
                    className="text-gray-500"
                  />

                </button>

                {/* DROPDOWN */}

                {open && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-50">

                    <div className="p-5 border-b bg-gray-50">

                      <p className="font-semibold text-gray-900">
                        {
                          user.email
                        }
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Super Admin
                      </p>

                    </div>

                    <div className="p-2">

                      <button
                        className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl hover:bg-gray-100 text-sm transition"
                      >

                        <Settings
                          size={
                            16
                          }
                        />

                        Account Settings

                      </button>

                      <button
                        onClick={
                          logout
                        }
                        className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl hover:bg-red-50 text-red-600 text-sm transition"
                      >

                        <LogOut
                          size={
                            16
                          }
                        />

                        Logout

                      </button>

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

        </header>

        {/* PAGE */}

        <main className="flex-1 overflow-y-auto p-8">

          <div className="max-w-7xl mx-auto">
            {children}
          </div>

        </main>

      </div>

    </div>
  );
}