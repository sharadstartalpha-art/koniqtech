"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  {session?.user.role === "ADMIN" ? (
  <Link href="/admin/dashboard">Admin</Link>
) : (
  <Link href="/dashboard">Dashboard</Link>
)}

  return (
    <div className="w-full border-b bg-white px-6 py-4 flex justify-between items-center">
      
      <Link href="/" className="font-bold text-lg">
        KoniqTech 🚀
      </Link>

      <div className="flex gap-4 items-center">

        <Link href="/pricing">Pricing</Link>

        {status === "loading" ? (
          <span className="text-sm text-gray-400">Loading...</span>
        ) : session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link
              href="/api/auth/signout"
              className="text-red-500"
            >
              Logout
            </Link>
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