"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="font-bold text-lg">KoniqTech</h1>

      {user ? (
        <div className="relative">
          {/* EMAIL BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="border px-4 py-2 rounded"
          >
            {user.email}
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <a href="/login" className="text-blue-600">
          Login
        </a>
      )}
    </div>
  );
}