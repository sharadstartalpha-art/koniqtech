"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!password) {
      setMessage("Password is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage("✅ Password reset successful");
      }
    } catch (err) {
      setMessage("❌ Network error");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Reset Password</h1>

      <input
        type="password"
        placeholder="Enter new password"
        className="w-full border px-3 py-2 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      {message && (
        <p className="text-sm text-center">{message}</p>
      )}
    </div>
  );
}