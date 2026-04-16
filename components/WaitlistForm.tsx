"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) return toast.error("Enter email");

    setLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("You're on the waitlist 🚀");
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div className="flex gap-2 max-w-md mx-auto mt-6">
      <input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
      />

      <button
        onClick={submit}
        className="bg-blue-600 px-5 py-3 rounded-lg"
      >
        {loading ? "Joining..." : "Join"}
      </button>
    </div>
  );
}