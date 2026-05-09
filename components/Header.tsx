"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import {
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  Mail,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import { usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] =
    useState<any>(null);

  const [open, setOpen] =
    useState(false);

  const pathname =
    usePathname();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  /* =========================
     PAGE TITLES
  ========================= */

  const titles: Record<
    string,
    string
  > = {
    "/products/invoice-recovery/dashboard":
      "Dashboard",

    "/products/invoice-recovery/invoices":
      "Invoices",

    "/products/invoice-recovery/reminders":
      "Reminders",

    "/products/invoice-recovery/links":
      "Payment Links",

    "/products/invoice-recovery/account":
      "Account",

    "/products/invoice-recovery/settings":
      "Settings",

    "/products/invoice-recovery/settings/templates":
      "Templates",
  };

  const title =
    titles[pathname] ||
    "Dashboard";

  /* =========================
     GET USER
  ========================= */

  useEffect(() => {
    const fetchUser =
      async () => {
        try {
          const res =
            await axios.get(
              "/api/auth/me"
            );

          const userData =
            res.data.user ||
            res.data;

          setUser(userData);

        } catch (err) {
          console.error(err);
        }
      };

    fetchUser();
  }, []);

  /* =========================
     CLOSE DROPDOWN
  ========================= */

  useEffect(() => {
    const handleClick = (
      e: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  /* =========================
     LOGOUT
  ========================= */

  const logout =
    async () => {
      await axios.post(
        "/api/auth/logout"
      );

      window.location.href =
        "/login";
    };

  /* =========================
     DISPLAY NAME
  ========================= */

  const displayName =
    user?.name?.trim()
      ? user.name
      : user?.email
          ?.split("@")[0] ||
        "User";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200">

      <div className="h-20 px-5 lg:px-8 flex items-center justify-between gap-6">

        {/* LEFT */}

        <div className="flex items-center gap-6 flex-1">

          {/* TITLE */}

          <div className="hidden md:block">

            <div className="flex items-center gap-2 mb-1">

              <div className="w-2 h-2 rounded-full bg-green-500" />

              <span className="text-xs text-gray-500 font-medium">
                Workspace Active
              </span>

            </div>

            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>

          </div>

          {/* SEARCH */}

          <div className="hidden lg:flex flex-1 max-w-xl">

            <div className="relative w-full">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search invoices, reminders, clients..."
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-2xl pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition"
              />

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-3">

          {/* PRO BADGE */}

          <div className="hidden xl:flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-100 px-4 py-2 rounded-2xl">

            <Sparkles size={16} />

            <span className="text-sm font-semibold">
              Pro Workspace
            </span>

          </div>

          {/* ICON BUTTONS */}

          <button className="relative w-11 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition">

            <Bell
              size={18}
              className="text-gray-600"
            />

            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500" />

          </button>

          <button className="w-11 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition">

            <Settings
              size={18}
              className="text-gray-600"
            />

          </button>

          {/* USER */}

          <div
            className="relative"
            ref={dropdownRef}
          >

            {user ? (
              <>
                <button
                  onClick={() =>
                    setOpen(!open)
                  }
                  className="flex items-center gap-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl px-3 py-2 transition-all"
                >

                  {/* AVATAR */}

                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold uppercase shadow-lg shadow-orange-500/20">

                    {displayName.charAt(
                      0
                    )}

                  </div>

                  {/* INFO */}

                  <div className="hidden md:block text-left">

                    <p className="text-sm font-semibold text-gray-900 leading-none">

                      {displayName}

                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Workspace Owner
                    </p>

                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition ${
                      open
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {/* DROPDOWN */}

                {open && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-50">

                    {/* TOP */}

                    <div className="relative bg-gradient-to-br from-black via-gray-900 to-black px-6 py-6 text-white overflow-hidden">

                      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-orange-500/10" />

                      <div className="relative z-10 flex items-center gap-4">

                        <div className="w-16 h-16 rounded-3xl bg-orange-500 flex items-center justify-center text-2xl font-bold uppercase">

                          {displayName.charAt(
                            0
                          )}

                        </div>

                        <div className="min-w-0">

                          <h3 className="font-bold text-lg truncate">
                            {
                              displayName
                            }
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-300 mt-1 truncate">

                            <Mail
                              size={14}
                            />

                            <span className="truncate">
                              {
                                user?.email
                              }
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* MENU */}

                    <div className="p-3">

                      <a
                        href="/products/invoice-recovery/account"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition text-gray-700"
                      >

                        <User
                          size={18}
                        />

                        My Account

                      </a>

                      <a
                        href="/products/invoice-recovery/account"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition text-gray-700"
                      >

                        <CreditCard
                          size={18}
                        />

                        Billing & Plan

                      </a>

                      <a
                        href="/products/invoice-recovery/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition text-gray-700"
                      >

                        <Settings
                          size={18}
                        />

                        Workspace Settings

                      </a>

                    </div>

                    {/* FOOTER */}

                    <div className="border-t border-gray-100 p-3">

                      <button
                        onClick={
                          logout
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition"
                      >

                        <LogOut
                          size={18}
                        />

                        Logout

                      </button>

                    </div>

                  </div>
                )}
              </>
            ) : (
              <a
                href="/login"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition"
              >
                Login
              </a>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}