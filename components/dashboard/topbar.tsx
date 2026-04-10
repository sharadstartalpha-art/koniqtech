"use client";

import { signOut } from "next-auth/react";

export default function Topbar() {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">

      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>

      <button
        onClick={() => signOut()}
        className="bg-black text-white px-3 py-1 rounded-lg text-sm"
      >
        Logout
      </button>

    </div>
  );
}