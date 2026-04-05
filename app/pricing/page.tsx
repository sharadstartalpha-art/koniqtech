"use client";

import { useEffect, useState } from "react";

export default function PricingPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // ✅ Fetch credits
  useEffect(() => {
    fetch("/api/user/credits")
      .then((res) => res.json())
      .then((data) => setCredits(data.credits));
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      const res = await fetch("/api/paypal/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      const approveLink = data?.links?.find(
        (link: any) => link.rel === "approve"
      );

      if (approveLink?.href) {
        window.location.href = approveLink.href;
      } else {
        alert("Payment initialization failed.");
        console.error(data);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Pricing
      </h1>

      {/* 🔥 URGENCY */}
      <p className="text-center text-red-500 text-sm mb-6">
        🔥 Limited offer: Get 2x credits today only
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {/* FREE */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Free</h2>
          <p className="text-2xl mb-4">$0</p>
          <p>10 leads</p>
          <p>No email sending</p>

          <button className="mt-4 w-full bg-gray-300 py-2 rounded">
            Start Free
          </button>
        </div>

        {/* 🔥 PRO (HIGHLIGHT) */}
        <div className="bg-white p-6 rounded shadow border-2 border-blue-600 relative scale-105">

          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            BEST VALUE
          </span>

          <h2 className="text-xl font-bold mb-2">Pro</h2>
          <p className="text-2xl mb-4">$19/month</p>

          <button
            onClick={() => handleUpgrade("PRO")}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:scale-105 transition"
          >
            Upgrade
          </button>
        </div>

        {/* AGENCY */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Agency</h2>
          <p className="text-2xl mb-4">$49/month</p>
          <p>Unlimited leads</p>
          <p>Automation</p>

          <button
            onClick={() => handleUpgrade("AGENCY")}
            className="mt-4 w-full bg-black text-white py-2 rounded"
          >
            Upgrade
          </button>
        </div>

      </div>

      {/* 🚀 FLOATING UPGRADE BUTTON */}
      {credits === 0 && (
        <button
          onClick={() => setShowUpgrade(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg"
        >
          Upgrade 🚀
        </button>
      )}
    </div>
  );
}