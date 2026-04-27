"use client";

import { useEffect, useState } from "react";

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
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="font-bold">KoniqTech</h1>

      {user ? (
        <div className="relative">
          <button onClick={() => setOpen(!open)}>
            👤 {user.email}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white border p-3 shadow">
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
        <a href="/login" className="text-blue-500">
          Login
        </a>
      )}
    </div>
  );
}