"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import TeamSwitcher from "@/components/TeamSwitcher";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    function handleClick(e: any) {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="w-full border-b bg-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        KoniqTech 🚀
      </Link>

      <div className="flex items-center gap-6 relative">

        {/* ✅ ONLY SHOW FOR USERS */}
        {!isAdmin && session && <TeamSwitcher />}

        {!isAdminPage && <Link href="/pricing">Pricing</Link>}

        {session ? (
          <>
            {isAdmin ? (
              <Link href="/admin/dashboard">Admin</Link>
            ) : (
              <Link href="/dashboard">Dashboard</Link>
            )}

            <div ref={ref} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="font-medium bg-gray-100 px-3 py-1 rounded-lg"
              >
                {session.user.email}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg p-3 z-50">

                  <div className="mb-3 px-2 py-1 bg-gray-100 rounded text-sm">
                    {session.user.email}
                  </div>

                  <Link href="/change-password" className="block px-2 py-1 hover:bg-gray-100">
                    Change Password
                  </Link>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full bg-red-500 text-white py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register" className="bg-black text-white px-4 py-2 rounded-lg">
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  );
}