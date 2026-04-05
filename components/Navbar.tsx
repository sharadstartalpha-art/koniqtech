"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import ProjectSwitcher from "@/components/ProjectSwitcher";


export default function Navbar() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (session) {
      fetch("/api/user/credits")
        .then(res => res.json())
        .then(data => setCredits(data.credits));
    }
  }, [session]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LEFT */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* RIGHT */}
        <div className="flex gap-4 items-center">
               <ProjectSwitcher />
          {session && (
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-lg">
              💳 Credits: <span className="font-semibold">{credits ?? "..."}</span>
            </div>
          )}

          {!session ? (
            <>
              <Link href="/login" className="px-4 py-2 border rounded-lg">
                Login
              </Link>
              <Link href="/register" className="px-5 py-2 bg-blue-600 text-white rounded-lg">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="px-4 py-2 border rounded-lg">
                Dashboard
              </Link>

              {session?.user?.role === "ADMIN" && (
                <Link href="/admin" className="px-4 py-2">
                  Admin
                </Link>
              )}
            </>
          )}

        </div>
      </div>
    </nav>
  );
}