"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendLink = async () => {
    try {
      if (!email) {
        alert("Email required");
        return;
      }

      setLoading(true);

      await axios.post("/api/auth/magic-link", { email });

      setSent(true);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">

      <h1 className="text-2xl font-semibold mb-4">
        Sign in
      </h1>

      {!sent ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full mb-3 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendLink}
            disabled={loading}
            className="bg-black text-white px-4 py-2 w-full rounded-md disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </>
      ) : (
        <div className="text-sm text-gray-600">
          ✅ Check your email — we sent you a login link.
        </div>
      )}
    </div>
  );
}