"use client";

import { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const capture = async () => {
      try {
        const token = params.get("token"); // PayPal order ID

        if (!token) return;

        await axios.post("/api/paypal/capture", { orderId: token });

        toast.success("Payment successful 🎉");

        router.push("/products/invoice-recovery/account");
      } catch {
        toast.error("Payment failed");
      }
    };

    capture();
  }, []);

  return <div className="p-10">Processing payment...</div>;
}