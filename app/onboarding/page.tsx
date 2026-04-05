"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [business, setBusiness] = useState("");
  const router = useRouter();

  const start = async () => {
    // ✅ Create project
    const res = await fetch("/api/projects/create", {
      method: "POST",
      body: JSON.stringify({ name: business }),
    });

    const data = await res.json();

    // ✅ Auto generate leads
    await fetch("/api/leads/real", {
      method: "POST",
      body: JSON.stringify({
        query: `${business} near me`,
      }),
    });

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">

      <h1 className="text-2xl font-bold mb-4">
        What business are you targeting?
      </h1>

      <input
        placeholder="e.g. dentists in Bangalore"
        className="border p-2 mb-4 w-80"
        onChange={(e) => setBusiness(e.target.value)}
      />

      <button
        onClick={start}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Start 🚀
      </button>
    </div>
  );
}