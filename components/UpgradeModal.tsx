"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function UpgradeModal({ onClose }: any) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 min

  // ⏳ TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const upgrade = async (plan: string) => {
    const res = await fetch("/api/paypal/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-xl w-[380px] text-center shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-2">
          Upgrade Required 🚀
        </h2>

        {/* 🔴 URGENCY */}
        <p className="text-red-500 text-sm mb-3">
          Offer expires in {minutes}:{seconds.toString().padStart(2, "0")}
        </p>

        {/* 💎 VALUE */}
        <ul className="text-sm text-gray-600 mb-4 text-left">
          <li>✔ Unlimited leads</li>
          <li>✔ AI scoring</li>
          <li>✔ Email automation</li>
          <li>✔ Priority processing</li>
        </ul>

        {/* 🔥 PRO PLAN (HIGHLIGHT) */}
        <button
          onClick={() => upgrade("PRO")}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2 hover:scale-105 transition"
        >
          🔥 Upgrade Pro - $19
        </button>

        {/* AGENCY */}
        <button
          onClick={() => upgrade("AGENCY")}
          className="w-full border py-2 rounded-lg"
        >
          Agency - $49
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500"
        >
          Maybe later
        </button>
      </motion.div>
    </div>
  );
}