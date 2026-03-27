"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center mb-6">
      <Link href="/" className="font-bold text-xl">
        KoniqTech
      </Link>

      {session && (
        <div className="flex gap-4 items-center">
          <Link href="/dashboard">Dashboard</Link>
          <button
            onClick={() => signOut()}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}