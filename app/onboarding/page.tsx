"use client";

import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();

  const start = async () => {
    await fetch("/api/user/onboarding", { method: "POST" });
    router.push("/dashboard");
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-6">
        Get your first leads in seconds 🚀
      </h1>

      <button
        onClick={start}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Generate Leads
      </button>
    </div>
  );
}