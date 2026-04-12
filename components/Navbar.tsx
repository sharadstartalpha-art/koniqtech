"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full border-b bg-white px-6 py-4 flex justify-between items-center">

      {/* LOGO */}
      <Link href="/" className="font-bold text-lg">
        KoniqTech 🚀
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 relative">

        <Link href="/pricing">Pricing</Link>

        {session ? (
          <>
            {/* ROLE BASED DASHBOARD */}
            {session.user.role === "ADMIN" ? (
              <Link href="/admin/dashboard">Admin</Link>
            ) : (
              <Link href="/dashboard">Dashboard</Link>
            )}

            {/* USER DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="font-medium"
              >
                {session.user.email}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg p-3 space-y-2 z-50">
                  
                  <p className="text-sm text-gray-500">
                    {session.user.email}
                  </p>

                  <button
                    onClick={() => signOut()}
                    className="w-full text-left text-red-500 hover:bg-gray-100 px-2 py-1 rounded"
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
            <Link
              href="/register"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  );
}