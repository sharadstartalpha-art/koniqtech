"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/products/invoice-recovery/dashboard": "Dashboard",
    "/products/invoice-recovery/invoices": "Invoices",
    "/products/invoice-recovery/reminders": "Reminders",
  };

  const title = titles[pathname] || "Dashboard";

  useEffect(() => {
    axios
      .get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await axios.post("/api/auth/logout");
    window.location.href = "/login";
  };

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">

      {/* LEFT: PAGE TITLE */}
      <div className="text-sm font-medium text-gray-900">
        {title}
      </div>

      {/* RIGHT: USER */}
      <div className="relative">
        {user ? (
          <>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-sm border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50"
            >
              {user.email}
              <ChevronDown size={14} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-sm">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <a href="/login" className="text-sm text-blue-600">
            Login
          </a>
        )}
      </div>
    </header>
  );
}