
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const sessionData = useSession();
const session = sessionData?.data;

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <Link href="/" className="font-bold text-lg">
        KoniqTech 🚀
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={() => signOut()}
              className="bg-black text-white px-3 py-1 rounded"
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