"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div>
      <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={submit}>Send Reset Link</button>
    </div>
  );
}