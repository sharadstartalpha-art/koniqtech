"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const sendOtp = async () => {
    await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setStep(2);
  };

  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) setStep(3);
  };

  const register = async () => {
    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  };

  return (
    <div className="p-6 space-y-4">
      {step === 1 && (
        <>
          <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input onChange={e => setOtp(e.target.value)} placeholder="OTP" />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input type="password" onChange={e => setPassword(e.target.value)} />
          <button onClick={register}>Create Account</button>
        </>
      )}
    </div>
  );
}