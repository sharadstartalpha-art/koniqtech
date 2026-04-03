"use client";

import Link from "next/link";
import { useState } from "react";
import UpgradeModal from "@/components/UpgradeModal";

export default function Dashboard() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  // 🔥 TEMP (replace later with real DB value)
  const credits = 0;

  return (
    <div className="p-6">

      {/* ✅ SHOW MODAL */}
      {credits === 0 && showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}

      <h1 className="text-2xl font-bold mb-4">
        Welcome to KoniqTech 🚀
      </h1>

      <p className="mb-6 text-gray-600">
        Let’s get your first leads in 30 seconds
      </p>

      <div className="grid gap-4 max-w-md">

        <Link
          href="/project/new"
          className="bg-black text-white p-4 rounded"
        >
          1️⃣ Create Project
        </Link>

        {/* 🔥 THIS IS IMPORTANT */}
        <button
          onClick={() => {
            if (credits === 0) {
              setShowUpgrade(true);
            } else {
              window.location.href = "/project/demo/lead-finder";
            }
          }}
          className="bg-gray-100 p-4 rounded text-left"
        >
          2️⃣ Find Leads
        </button>

        <Link
          href="/dashboard/leads"
          className="bg-gray-100 p-4 rounded"
        >
          3️⃣ View CRM Pipeline
        </Link>

      </div>
    </div>
  );
}