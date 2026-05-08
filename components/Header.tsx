"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import {
  ChevronDown,
  LogOut,
  Mail,
} from "lucide-react";

import { usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] =
    useState<any>(null);

  const [open, setOpen] =
    useState(false);

  const pathname =
    usePathname();

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

    "/products/invoice-recovery/payment-links":
      "Payment Links",

    "/products/invoice-recovery/account":
      "Account",

    "/products/invoice-recovery/settings":
      "Settings",

    "/products/invoice-recovery/templates":
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

          console.log(
            "USER:",
            res.data
          );

          setUser(res.data);

        } catch (err) {
          console.error(err);

          setUser(null);
        }
      };

    fetchUser();
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
     SAFE NAME
  ========================= */

  const displayName =
    user?.name &&
    user.name !== "null"
      ? user.name
      : user?.email
          ?.split("@")[0] ||
        "User";

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">

      {/* LEFT */}

      <div className="text-sm font-semibold text-gray-900">
        {title}
      </div>

      {/* RIGHT */}

      <div className="relative">
        {user ? (
          <>
            {/* BUTTON */}

            <button
              onClick={() =>
                setOpen(!open)
              }
              className="flex items-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-xl transition"
            >
              {/* AVATAR */}

              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold uppercase">
                {displayName.charAt(
                  0
                )}
              </div>

              {/* NAME */}

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-none">
                  {displayName}
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
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">

                {/* USER INFO */}

                <div className="px-5 py-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold uppercase">
                      {displayName.charAt(
                        0
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {
                          displayName
                        }
                      </p>

                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
                        <Mail
                          size={12}
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

                {/* LOGOUT */}

                <button
                  onClick={
                    logout
                  }
                  className="w-full flex items-center gap-2 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut
                    size={16}
                  />

                  Logout
                </button>

              </div>
            )}
          </>
        ) : (
          <a
            href="/login"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Login
          </a>
        )}
      </div>
    </header>
  );
}