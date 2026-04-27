"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activateSubscription = async () => {
      try {
        const res = await fetch("/api/payments/success", {
          method: "POST",
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error("Activation failed");
        }
      } catch (err) {
        console.error("Subscription activation error:", err);
        alert("Something went wrong activating your subscription");
      } finally {
        setLoading(false);
      }
    };

    activateSubscription();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl mb-4">
        Payment Successful 🎉
      </h1>

      {loading ? (
        <p>Activating your subscription...</p>
      ) : (
        <>
          <p className="mb-4">
            You now have full access 🚀
          </p>

          <a
            href="/products/invoice-recovery/dashboard"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Go to Dashboard
          </a>
        </>
      )}
    </div>
  );
}