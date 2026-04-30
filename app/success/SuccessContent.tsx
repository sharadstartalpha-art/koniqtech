"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const subscriptionId = params.get("subscription_id");

    if (!subscriptionId) return;

    const activate = async () => {
      try {
        await axios.post("/api/payments/activate", {
          subscriptionId,
        });

        router.push("/products/invoice-recovery/dashboard");
      } catch (err) {
        console.error("Activation failed:", err);
      }
    };

    activate();
  }, [params, router]);

  return <div className="p-10 text-center">Activating...</div>;
}