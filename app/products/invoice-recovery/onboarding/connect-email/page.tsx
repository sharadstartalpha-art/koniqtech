"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import Layout from "@/components/Layout";

import {
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function ConnectEmailPage() {

  const [email, setEmail] =
    useState("");

  const [provider, setProvider] =
    useState("gmail");

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     CONNECT
  ========================================= */

  const connectEmail =
    async () => {

      if (!email) {

        toast.error(
          "Business email required"
        );

        return;
      }

      try {

        setLoading(true);

        await axios.post(
          "/api/onboarding/connect-email",
          {
            email,
            provider,
          }
        );

        toast.success(
          "Business email connected"
        );

        window.location.href =
          "/products/invoice-recovery/onboarding";

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to connect email"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <Layout>

      <div className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="max-w-3xl mx-auto">

          {/* HEADER */}

          <div className="mb-8">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-3xl bg-orange-100 flex items-center justify-center">

                <Mail className="w-7 h-7 text-orange-600" />

              </div>

              <div>

                <h1 className="text-4xl font-bold text-gray-900">
                  Connect Business Email
                </h1>

                <p className="text-gray-500 mt-2">
                  Connect your sending email to enable automated invoice reminders.
                </p>

              </div>

            </div>

          </div>

          {/* CARD */}

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">

            <div className="p-8">

              {/* EMAIL */}

              <div className="mb-6">

                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Business Email
                </label>

                <input
                  type="email"
                  placeholder="billing@yourcompany.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full h-14 border border-gray-300 rounded-2xl px-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                />

              </div>

              {/* PROVIDER */}

              <div className="mb-8">

                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Provider
                </label>

                <select
                  value={provider}
                  onChange={(e) =>
                    setProvider(
                      e.target.value
                    )
                  }
                  className="w-full h-14 border border-gray-300 rounded-2xl px-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                >
                  <option value="gmail">
                    Gmail
                  </option>

                  <option value="outlook">
                    Outlook
                  </option>

                  <option value="smtp">
                    SMTP
                  </option>

                  <option value="resend">
                    Resend
                  </option>
                </select>

              </div>

              {/* FEATURES */}

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">

                <div className="flex items-center gap-3">

                  <CheckCircle2 className="w-5 h-5 text-green-600" />

                  <p className="text-sm text-gray-700">
                    Automated reminder delivery
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <CheckCircle2 className="w-5 h-5 text-green-600" />

                  <p className="text-sm text-gray-700">
                    Open & click tracking
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <CheckCircle2 className="w-5 h-5 text-green-600" />

                  <p className="text-sm text-gray-700">
                    Smart recovery analytics
                  </p>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end">

              <button
                onClick={connectEmail}
                disabled={loading}
                className="h-12 px-6 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold transition disabled:opacity-60 flex items-center gap-2"
              >

                {loading
                  ? "Connecting..."
                  : "Connect Email"}

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}