"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyClient() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verify = async () => {
    try {
      setLoading(true);

      await axios.post("/api/auth/verify-otp", {
        email,
        otp: otp.join(""),
      });

      alert("Verified ✅");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto text-center">
      <h1 className="text-2xl mb-4">Enter OTP</h1>

      <div className="flex justify-center gap-2 mb-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            className="w-10 h-12 border text-center text-xl"
            maxLength={1}
          />
        ))}
      </div>

      <button
        onClick={verify}
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}