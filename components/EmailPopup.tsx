"use client";

import { useState, useEffect } from "react";

export default function EmailPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-white p-6 rounded-xl shadow-xl border w-80 z-50">
      <h3 className="font-bold mb-2">Get free leads 🔥</h3>
      <p className="text-sm text-gray-500 mb-3">
        Enter your email to get 50 free leads
      </p>

      <input
        type="email"
        placeholder="you@email.com"
        className="w-full border p-2 rounded mb-3"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Get Access
      </button>

      <button
        onClick={() => setOpen(false)}
        className="text-xs mt-2 text-gray-400"
      >
        Close
      </button>
    </div>
  );
}