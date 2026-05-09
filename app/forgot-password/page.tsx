"use client";

import { useState } from "react";

import axios from "axios";

import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const sendOtp = async () => {
    try {
      if (!email) {
        alert(
          "Please enter your email"
        );

        return;
      }

      setLoading(true);

      await axios.post(
        "/api/auth/resend-otp",
        {
          email,
        }
      );

      setSuccess(true);

      setTimeout(() => {
        window.location.href =
          `/reset-password?email=${email}`;
      }, 1200);

    } catch (err: any) {
      alert(
        err?.response?.data
          ?.error ||
          "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-4 relative overflow-hidden">

      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-orange-200 rounded-full blur-3xl opacity-30" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-orange-300 rounded-full blur-3xl opacity-20" />

      </div>

      {/* CARD */}

      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-3xl p-8">

        {/* LOGO */}

        <div className="flex justify-center mb-8">

          <div className="flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-sm">

            <ShieldCheck
              size={20}
            />

            <span className="font-semibold text-lg">
              KoniqTech
            </span>

          </div>

        </div>

        {/* ICON */}

        <div className="flex justify-center mb-5">

          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">

            <LockKeyhole
              size={28}
              className="text-orange-600"
            />

          </div>

        </div>

        {/* TITLE */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Forgot password?
          </h1>

          <p className="text-gray-500 leading-relaxed">
            Enter your email address
            and we’ll send you a
            verification OTP to reset
            your password securely.
          </p>

        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">
            OTP sent successfully.
            Redirecting...
          </div>
        )}

        {/* INPUT */}

        <div className="space-y-5">

          <div>

            <label className="text-sm font-medium text-gray-700 block mb-2">
              Email Address
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none pl-12 pr-4 py-3 rounded-2xl transition"
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-black hover:opacity-90 transition text-white py-3 rounded-2xl font-medium shadow-sm disabled:opacity-60"
          >
            {loading
              ? "Sending OTP..."
              : "Send Reset OTP"}
          </button>

        </div>

        {/* FOOTER */}

        <div className="mt-8 flex items-center justify-center">

          <a
            href="/login"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition"
          >

            <ArrowLeft
              size={16}
            />

            Back to login

          </a>

        </div>

      </div>

    </div>
  );
}