"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => setUser(res.data));
  }, []);

  const logout = async () => {
    await axios.post("/api/auth/logout");
    window.location.href = "/login";
  };

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">

      {/* LEFT TITLE */}
      <div className="text-sm font-medium text-gray-700">
        API Keys
      </div>

      {/* RIGHT USER */}
      <div className="relative">
        {user && (
          <>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-sm border px-3 py-1.5 rounded-md hover:bg-gray-50"
            >
              {user.email}
              <ChevronDown size={14} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}