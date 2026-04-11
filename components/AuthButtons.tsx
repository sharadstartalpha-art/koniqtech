"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButtons() {
  const sessionData = useSession();
const session = sessionData?.data;

  if (session) {
    return (
      <div className="flex gap-4 items-center">
        <Link href="/dashboard">Dashboard</Link>

        <button
          onClick={() => signOut()}
          className="bg-black text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </div>
  );
}