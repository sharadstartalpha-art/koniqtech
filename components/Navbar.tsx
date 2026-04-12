"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="w-full border-b bg-white px-6 py-4 flex justify-between items-center">

      {/* LOGO */}
      <Link href="/" className="font-bold text-lg">
        KoniqTech 🚀
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* Always show pricing */}
        <Link href="/pricing">Pricing</Link>

        {session ? (
          <>
            {/* 👤 USER NAME */}
            <span className="text-sm text-gray-600">
              {session.user?.email}
            </span>

            {/* ROLE BASED DASHBOARD */}
            {session.user.role === "ADMIN" ? (
              <Link href="/admin/dashboard">Admin</Link>
            ) : (
              <Link href="/dashboard">Dashboard</Link>
            )}

            {/* LOGOUT */}
            <button
              onClick={() => signOut()}
              className="text-red-500"
            >
              Logout
            </button>
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