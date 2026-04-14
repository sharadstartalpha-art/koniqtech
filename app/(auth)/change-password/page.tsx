"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    setLoading(true);

    const res = await fetch("/api/change-password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
    } else {
      alert("Password updated!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>

      <input
        type="password"
        placeholder="New password"
        className="border w-full px-3 py-2 rounded mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleChange}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}