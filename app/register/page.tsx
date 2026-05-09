"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import PasswordInput from "@/components/PasswordInput";

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    acceptedTerms,
    setAcceptedTerms,
  ] = useState(false);

  const [
    showPasswordHint,
    setShowPasswordHint,
  ] = useState(false);

  const register = async () => {
    try {
      const cleanName =
        name.trim();

      const cleanEmail = email
        .trim()
        .toLowerCase();

      /* =========================
         VALIDATION
      ========================= */

      if (
        !cleanName ||
        !cleanEmail ||
        !password
      ) {
        alert(
          "All fields are required"
        );

        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(cleanEmail)
      ) {
        alert(
          "Enter valid email"
        );

        return;
      }

      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (
        !strongPassword.test(
          password
        )
      ) {
        setShowPasswordHint(true);

        return;
      }

      if (!acceptedTerms) {
        alert(
          "Please accept Terms & Privacy Policy"
        );

        return;
      }

      setLoading(true);

      /* =========================
         REGISTER
      ========================= */

      await axios.post(
        "/api/auth/register",
        {
          name: cleanName,
          email: cleanEmail,
          password,
          acceptedTerms: true,
        }
      );

      window.location.href =
        `/verify-otp?email=${cleanEmail}`;

    } catch (err: any) {
      alert(
        err?.response?.data
          ?.error ||
          "Registration failed"
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

        <div className="absolute top-24 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl" />

        {/* CONTENT */}

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* LOGO */}

          <div>
            <div className="inline-flex items-center gap-3">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-lg">
                K
              </div>

              <span className="text-2xl font-bold">
                KoniqTech
              </span>
            </div>

            {/* HERO */}

            <div className="mt-24 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Sparkles size={16} />
                Smart SaaS for Invoice Recovery
              </div>

              <h1 className="text-6xl font-bold leading-tight tracking-tight">
                Get paid faster with automated reminders.
              </h1>

              <p className="text-gray-300 text-xl leading-relaxed mt-8">
                Create invoices, automate follow-ups, recover overdue payments, and manage clients in one modern dashboard.
              </p>
            </div>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <p className="text-4xl font-bold">
                10k+
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Reminders sent
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <p className="text-4xl font-bold">
                $120k+
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Payments recovered
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
                Create account
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Start automating invoice recovery in minutes.
              </p>
            </div>

            {/* FORM */}

            <div className="space-y-5">
              {/* NAME */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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

              {/* PASSWORD */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <PasswordInput
                  value={password}
                  onChange={(
                    value
                  ) => {
                    setPassword(
                      value
                    );

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
                />
              </div>

              {/* PASSWORD HINT */}

              {showPasswordHint && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 leading-7">
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

              {/* TERMS */}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    acceptedTerms
                  }
                  onChange={(e) =>
                    setAcceptedTerms(
                      e.target.checked
                    )
                  }
                  className="mt-1 accent-orange-500"
                />

                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* BUTTON */}

              <button
                onClick={register}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-black hover:bg-gray-900 disabled:opacity-60 text-white font-semibold text-base transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={18}
                    />
                  </>
                )}
              </button>
            </div>

            {/* TRUST */}

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-400">
                  Trusted by modern freelancers
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

                Automated reminder sequences
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />

                Smart invoice tracking
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle2
                  size={18}
                  className="text-green-500"
                />

                Secure & encrypted platform
              </div>
            </div>

            {/* LOGIN */}

            <p className="text-center text-sm text-gray-500 mt-10">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Login
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}