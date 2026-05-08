"use client";

import { useSearchParams } from "next/navigation";

import { useState } from "react";

import axios from "axios";

import PasswordInput from "@/components/PasswordInput";

export default function ResetPasswordClient() {
  const params =
    useSearchParams();

  const email =
    params.get("email");

  const [otp, setOtp] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPasswordHint,
    setShowPasswordHint,
  ] = useState(false);

  /* =========================
     OTP CHANGE
  ========================= */

  const handleOtpChange = (
    value: string,
    index: number
  ) => {
    if (!/^[0-9]?$/.test(value))
      return;

    const updated = [...otp];

    updated[index] = value;

    setOtp(updated);

    /* AUTO NEXT */

    if (value && index < 5) {
      const next =
        document.getElementById(
          `otp-${index + 1}`
        ) as HTMLInputElement;

      next?.focus();
    }
  };

  /* =========================
     RESET
  ========================= */

  const reset = async () => {
    try {
      const finalOtp =
        otp.join("");

      /* =========================
         VALIDATION
      ========================= */

      if (
        finalOtp.length !== 6
      ) {
        alert(
          "Enter valid OTP"
        );

        return;
      }

      /* =========================
         PASSWORD CHECK
      ========================= */

      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (
        !strongPassword.test(
          password
        )
      ) {
        setShowPasswordHint(
          true
        );

        return;
      }

      setLoading(true);

      /* =========================
         RESET PASSWORD
      ========================= */

      await axios.post(
        "/api/auth/reset-password",
        {
          email,

          otp: finalOtp,

          password,
        }
      );

      alert(
        "Password reset successful"
      );

      window.location.href =
        "/login";

    } catch (err: any) {
      alert(
        err?.response?.data
          ?.error ||
          "Reset failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6ef] px-4">

      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm">

        {/* LOGO */}

        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 text-white px-5 py-2 font-bold rounded-lg">
            KoniqTech
          </div>
        </div>

        {/* TITLE */}

        <h1 className="text-center text-2xl font-semibold mb-2">
          Reset Password
        </h1>

        <p className="text-center text-sm text-gray-500 mb-8">
          Enter the 6-digit OTP sent to your email
        </p>

        {/* OTP */}

        <div className="flex justify-between gap-2 mb-6">

          {otp.map(
            (
              digit,
              index
            ) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleOtpChange(
                    e.target.value,
                    index
                  )
                }
                className="w-12 h-14 text-center text-lg font-semibold border border-gray-300 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />
            )
          )}

        </div>

        {/* PASSWORD */}

        <div className="mb-2">

          <PasswordInput
            value={password}
            onChange={(
              value
            ) => {
              setPassword(value);

              const strongPassword =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

              if (
                value.length >
                  0 &&
                !strongPassword.test(
                  value
                )
              ) {
                setShowPasswordHint(
                  true
                );
              } else {
                setShowPasswordHint(
                  false
                );
              }
            }}
            placeholder="New Password"
          />

        </div>

        {/* PASSWORD HINT */}

        {showPasswordHint && (
          <div className="text-xs text-red-500 mb-6 leading-6">
            Password must contain:
            <br />
            • 8+ characters
            <br />
            • 1 uppercase letter
            <br />
            • 1 lowercase letter
            <br />
            • 1 number
          </div>
        )}

        {/* BUTTON */}

        <button
          onClick={reset}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition disabled:opacity-60"
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
        </button>

        {/* LOGIN */}

        <p className="text-center text-sm mt-6">

          <a
            href="/login"
            className="text-orange-600 hover:text-orange-700"
          >
            ← Back to login
          </a>

        </p>

      </div>
    </div>
  );
}