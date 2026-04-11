"use client";

import { useSession, signOut } from "next-auth/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const sessionData = useSession();
  const session = sessionData?.data; // ✅ FIX

  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="font-bold">KoniqTech 🚀</h1>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-600">
                {session.user?.email}
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-black text-white px-3 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="bg-black text-white px-3 py-2 rounded-lg"
            >
              Login
            </a>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}