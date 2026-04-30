"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subscriptionId = params.get("subscription_id");

    if (!subscriptionId) {
      setStatus("Invalid subscription.");
      return;
    }

    // Optional: call backend to verify
    fetch(`/api/payments/verify-subscription?subscriptionId=${subscriptionId}`)
      .then(() => {
        setStatus("🎉 Subscription activated successfully!");
      })
      .catch(() => {
        setStatus("Payment succeeded, but verification failed.");
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}