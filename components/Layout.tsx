"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import Header from "./Header";

import Logo from "@/components/Logo";

import {
  LayoutDashboard,
  FileText,
  Sparkles,
  BarChart3,
  LayoutTemplate,
  Settings,
  User,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Plus,
} from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({
  children,
}: LayoutProps) {

  const pathname =
    usePathname();

  /* =========================================
     CLEAN NAVIGATION
  ========================================= */

  const nav = [

    {
      section: "Workspace",

      items: [

        {
          name:
            "Dashboard",

          href:
            "/products/invoice-recovery/dashboard",

          icon:
            LayoutDashboard,
        },

        {
          name:
            "Invoices",

          href:
            "/products/invoice-recovery/invoices",

          icon:
            FileText,
        },

        {
          name:
            "Recovery",

          href:
            "/products/invoice-recovery/reminder-center",

          icon:
            Sparkles,

          badge:
            "AI",
        },

        {
          name:
            "Analytics",

          href:
            "/products/invoice-recovery/recovery-analytics",

          icon:
            BarChart3,
        },
      ],
    },

    /* =========================================
       MANAGEMENT
    ========================================= */

    {
      section:
        "Management",

      items: [

        {
          name:
            "Templates",

          href:
            "/products/invoice-recovery/settings/templates",

          icon:
            LayoutTemplate,
        },

        {
          name:
            "Account",

          href:
            "/products/invoice-recovery/account",

          icon:
            User,
        },

        {
          name:
            "Settings",

          href:
            "/products/invoice-recovery/settings",

          icon:
            Settings,
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f7f8fc] text-sm text-gray-900">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="hidden lg:flex w-[280px] bg-white border-r border-gray-200 flex-col">

        {/* =========================================
            LOGO
        ========================================= */}

        <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between">

          <Logo />

          <Link
            href="/products/invoice-recovery/create"
            className="w-10 h-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition"
          >

            <Plus size={18} />

          </Link>

        </div>

        {/* =========================================
            NAVIGATION
        ========================================= */}

        <div className="flex-1 overflow-y-auto px-4 py-5">

          <div className="space-y-8">

            {nav.map((group) => (

              <div key={group.section}>

                {/* SECTION */}

                <div className="mb-3 px-3">

                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">

                    {group.section}

                  </p>

                </div>

                {/* LINKS */}

                <nav className="space-y-1.5">

                  {group.items.map(
                    (item) => {

                      const active =
                        pathname ===
                        item.href;

                      const Icon =
                        item.icon;

                      return (
                        <Link
                          key={
                            item.href
                          }
                          href={
                            item.href
                          }
                          className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
                            active
                              ? "bg-black text-white shadow-lg shadow-black/10"
                              : "text-gray-600 hover:bg-gray-100 hover:text-black"
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            {/* ICON */}

                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                                active
                                  ? "bg-white/10"
                                  : "bg-gray-100 group-hover:bg-white"
                              }`}
                            >

                              <Icon
                                size={18}
                              />

                            </div>

                            {/* TEXT */}

                            <div className="flex flex-col">

                              <span className="font-medium flex items-center gap-2">

                                {item.name}

                                {item.badge && (

                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-white">

                                    {
                                      item.badge
                                    }

                                  </span>
                                )}

                              </span>

                            </div>

                          </div>

                          {/* ACTIVE */}

                          {active && (

                            <ChevronRight
                              size={16}
                            />
                          )}

                        </Link>
                      );
                    }
                  )}

                </nav>

              </div>
            ))}

          </div>

          {/* =========================================
              QUICK ACTION
          ========================================= */}

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white overflow-hidden relative">

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />

            <div className="relative z-10">

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4">

                <CreditCard
                  size={22}
                />

              </div>

              <h3 className="font-semibold text-lg">

                Create Invoice

              </h3>

              <p className="text-sm text-orange-100 leading-6 mt-2">

                Send invoices, automate recovery reminders and track payments.

              </p>

              <Link
                href="/products/invoice-recovery/create"
                className="mt-5 inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-xl font-medium hover:bg-orange-50 transition"
              >

                New Invoice

                <ChevronRight
                  size={16}
                />

              </Link>

            </div>

          </div>

        </div>

        {/* =========================================
            FOOTER
        ========================================= */}

        <div className="p-5 border-t border-gray-100">

          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">

            <div className="w-11 h-11 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

              <ShieldCheck
                size={20}
              />

            </div>

            <div>

              <p className="font-semibold text-gray-900">

                System Status

              </p>

              <div className="flex items-center gap-2 mt-1">

                <div className="w-2 h-2 rounded-full bg-green-500" />

                <span className="text-xs text-gray-500">

                  All systems operational

                </span>

              </div>

            </div>

          </div>

        </div>

      </aside>

      {/* =========================================
          RIGHT SIDE
      ========================================= */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}

        <Header />

        {/* PAGE */}

        <main className="flex-1 overflow-y-auto">

          <div className="px-5 lg:px-8 py-6">

            <div className="mx-auto w-full max-w-7xl">

              {children}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}