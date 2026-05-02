"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

export default function VerifyOtpClient() {
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);

    inputsRef.current[5]?.focus();
  };

  const verify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      alert("Enter full OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/auth/verify-otp", {
        email,
        otp: code,
      });

      alert("Verified ✅");
      window.location.href = "/login";

    } catch (err: any) {
      alert(err?.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post("/api/auth/resend-otp", { email });

      setTimer(60);
      alert("OTP resent");

    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6 text-center">

        <h1 className="text-xl font-semibold mb-2">Enter OTP</h1>

        <p className="text-sm text-gray-500 mb-4">
          Sent to: {email}
        </p>

        <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center border rounded-md text-lg font-semibold"
            />
          ))}
        </div>

        <button
          onClick={verify}
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded-md mb-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-sm">
          {timer > 0 ? (
            <p className="text-gray-500">Resend OTP in {timer}s</p>
          ) : (
            <button onClick={resendOtp} className="text-blue-600">
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  );
}