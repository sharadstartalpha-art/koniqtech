"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) return;

    const verify = async () => {
      try {
        await axios.post("/api/auth/verify", { token });

        // 🔥 redirect after login
        router.push("/products/invoice-recovery/dashboard");
      } catch (err: any) {
        alert(err?.response?.data?.error || "Invalid link");
      }
    };

    verify();
  }, []);

  return (
    <div className="p-10 text-center text-sm text-gray-600">
      Logging you in...
    </div>
  );
}