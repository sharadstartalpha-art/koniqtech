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
  <button onClick={() => signOut()}>Logout</button>
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