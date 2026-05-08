"use client";

import { useState } from "react";
import axios from "axios";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [showPasswordHint, setShowPasswordHint] =
    useState(false);

  const register = async () => {
    try {
      /* =========================
         CLEAN INPUT
      ========================= */

      const cleanName =
        name.trim();

      const cleanEmail = email
        .trim()
        .toLowerCase();

      /* =========================
         REQUIRED
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

      /* =========================
         EMAIL VALIDATION
      ========================= */

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

      /* =========================
         PASSWORD VALIDATION
      ========================= */

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

      /* =========================
         TERMS
      ========================= */

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

      /* =========================
         REDIRECT
      ========================= */

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
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6ef] px-4">

      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-sm">

        {/* LOGO */}

        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 text-white px-5 py-2 font-bold rounded-md">
            KoniqTech
          </div>
        </div>

        {/* TITLE */}

        <h1 className="text-center text-2xl font-semibold mb-2">
          Create account
        </h1>

        <p className="text-center text-sm text-gray-500 mb-8">
          Start your SaaS journey
        </p>

        {/* NAME */}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border-b border-gray-300 focus:border-orange-500 outline-none py-3 mb-5 bg-transparent transition"
        />

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border-b border-gray-300 focus:border-orange-500 outline-none py-3 mb-5 bg-transparent transition"
        />

        {/* PASSWORD */}

        <div className="mb-2">
          <PasswordInput
            value={password}
            onChange={(value) => {
              setPassword(value);

              const strongPassword =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

              if (
                value.length > 0 &&
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
          <div className="text-xs text-red-500 mb-5 leading-6">
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

        <label className="flex items-start gap-3 mb-6 cursor-pointer">

          <input
            type="checkbox"
            checked={acceptedTerms}
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
              className="text-orange-600 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-orange-600 hover:underline"
            >
              Privacy Policy
            </a>
          </span>

        </label>

        {/* BUTTON */}

        <button
          onClick={register}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-md font-medium disabled:opacity-60"
        >
          {loading
            ? "Creating account..."
            : "Register"}
        </button>

        {/* LOGIN */}

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}

          <a
            href="/login"
            className="text-orange-600 hover:underline"
          >
            Login
          </a>
        </p>

      </div>
    </div>
  );
}