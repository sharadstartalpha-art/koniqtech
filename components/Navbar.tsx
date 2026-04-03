"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Logo from "@/components/Logo";

export default function Navbar() {
  const { data: session } = useSession();

  return (
   <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* RIGHT: BUTTONS */}
        <div className="flex gap-3 items-center">
          {!session ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-4 py-2 border rounded-lg"
            >
              Dashboard
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}