"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

/* =========================
   INNER COMPONENT (uses search params)
========================= */
function PaymentHandler() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const orderId = params.get("token"); // PayPal returns ?token=

    if (!orderId) {
      toast.error("Missing payment token");
      return;
    }

    const capture = async () => {
      try {
        await axios.post("/api/paypal/capture", {
          orderId,
        });

        toast.success("Payment successful 🎉");

        router.push("/products/invoice-recovery/account");
      } catch (err: any) {
        toast.error("Payment verification failed");
      }
    };

    capture();
  }, [params, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Processing payment...</p>
    </div>
  );
}

/* =========================
   PAGE (Suspense wrapper)
========================= */
export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PaymentHandler />
    </Suspense>
  );
}