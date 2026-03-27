"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-8">KoniqTech</h1>

          <nav className="flex flex-col gap-4 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/product/lead-finder">Lead Finder</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </div>

        {session && (
          <button
            onClick={() => signOut()}
            className="bg-white text-black px-3 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-10 bg-gray-50 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}