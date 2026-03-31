"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-10 tracking-tight">
            🚀 KoniqTech
          </h1>

          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <Link
              href="/product/lead-finder"
              className="hover:text-gray-300"
            >
              Lead Finder
            </Link>
            <Link href="/pricing" className="hover:text-gray-300">
              Pricing
            </Link>
          </nav>
        </div>

        {data && (
          <button
            onClick={() => signOut()}
            className="bg-white text-black px-3 py-2 rounded-lg hover:bg-gray-200"
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