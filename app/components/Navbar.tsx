"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="font-bold text-xl">
        KoniqTech
      </Link>

      <div className="flex gap-4">
        {!session ? (
          <>
            <Link href="/login" className="px-4 py-2 border rounded">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Get Started
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="px-4 py-2 border rounded">
              Dashboard
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}