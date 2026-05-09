"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import PasswordInput from "@/components/PasswordInput";

import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async () => {
    try {
      if (!email || !password) {
        alert(
          "Email & password required"
        );

        return;
      }

      setLoading(true);

      const res =
        await axios.post(
          "/api/auth/login",
          {
            email,
            password,
          }
        );

      if (
        res.data.role === "ADMIN"
      ) {
        window.location.href =
          "/admin";
      } else {
        window.location.href =
          "/products/invoice-recovery/dashboard";
      }

    } catch (err: any) {
      alert(
        err?.response?.data
          ?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex overflow-hidden">
      {/* =========================
          LEFT SIDE
      ========================= */}

      <div className="hidden lg:flex w-1/2 bg-black text-white relative overflow-hidden">
        {/* BACKGROUND */}

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-black to-black" />

        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />

        {/* CONTENT */}

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* TOP */}

          <div>
            <div className="inline-flex items-center gap-3">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-lg">
                K
              </div>

              <span className="text-2xl font-bold">
                KoniqTech
              </span>
            </div>

            <div className="mt-24 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <ShieldCheck size={16} />
                AI-Powered Invoice Recovery
              </div>

              <h1 className="text-6xl font-bold leading-tight tracking-tight">
                Recover unpaid invoices automatically.
              </h1>

              <p className="text-gray-300 text-xl leading-relaxed mt-8">
                Smart reminders, automated follow-ups, and payment recovery tools built for freelancers and agencies.
              </p>
            </div>
          </div>

          {/* BOTTOM */}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <p className="text-4xl font-bold">
                70%
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Recovery rate
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <p className="text-4xl font-bold">
                $127k+
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Recovered
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <p className="text-4xl font-bold">
                24/7
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Automation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* MOBILE LOGO */}

        <div className="absolute top-8 left-8 lg:hidden">
          <div className="bg-orange-500 text-white px-5 py-2 rounded-xl font-bold">
            KoniqTech
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-full max-w-md"
        >
          {/* CARD */}

          <div className="bg-white border border-gray-200 rounded-[32px] shadow-2xl shadow-black/5 p-10">
            {/* HEADER */}

            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Login to manage invoices and recover payments faster.
              </p>
            </div>

            {/* FORM */}

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Password
                </label>

                <PasswordInput
                  value={password}
                  onChange={
                    setPassword
                  }
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                  />

                  Remember me
                </label>

                <a
                  href="/forgot-password"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* BUTTON */}

              <button
                onClick={submit}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-black hover:bg-gray-900 disabled:opacity-60 text-white font-semibold text-base transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login
                    <ArrowRight
                      size={18}
                    />
                  </>
                )}
              </button>
            </div>

            {/* DIVIDER */}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-400">
                  Trusted by freelancers worldwide
                </span>
              </div>
            </div>

            {/* FEATURES */}

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />

                AI-powered reminders
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />

                Automated invoice recovery
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />

                Real-time payment tracking
              </div>
            </div>

            {/* FOOTER */}

            <p className="text-center text-sm text-gray-500 mt-10">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Create account
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}