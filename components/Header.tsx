"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">

      {/* ✅ LOGO FIXED */}
      <Link href="/" className="font-bold text-lg">
        KoniqTech
      </Link>

      {user ? (
        <div className="relative">
          <button onClick={() => setOpen(!open)}>
            👤 {user.email}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white border p-3 shadow rounded">
              <p className="text-sm mb-2">{user.email}</p>

              <button
                onClick={logout}
                className="text-red-500 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="text-blue-500">
          Login
        </Link>
      )}
    </div>
  );
}