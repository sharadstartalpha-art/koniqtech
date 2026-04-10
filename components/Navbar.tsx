"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">
      
      {/* Logo */}
      <Link href="/" className="font-semibold text-lg">
        KoniqTech
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>

            <button
              onClick={() => signOut()}
              className="text-sm bg-black text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}