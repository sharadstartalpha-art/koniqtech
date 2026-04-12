"use client";

import { useState } from "react";
import { useUpgrade } from "@/components/UpgradeProvider";

export default function LeadsPage() {
  const [loading, setLoading] = useState(false);
  const { openUpgrade } = useUpgrade();

  // ✅ DEFINE FUNCTION FIRST
  const generateLeads = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/leads/generate", {
        method: "POST",
      });

      if (!res.ok) throw new Error("FAILED");

    } catch (e: any) {
      if (e.message === "NO_CREDITS") {
        openUpgrade(); // 🔥 PAYWALL
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={generateLeads}>
        {loading ? "Generating..." : "Generate Leads"}
      </button>
    </div>
  );
}