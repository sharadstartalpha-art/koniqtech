"use client";

import { useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Mail,
  DollarSign,
  User,
  Sparkles,
  Phone,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function CreateInvoicePage() {
  const [email, setEmail] =
    useState("");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [mode, setMode] =
    useState<
      "manual" | "auto"
    >("manual");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     CREATE
  ========================= */

  const create = async () => {
    if (!email || !amount) {
      toast.error(
        "Email and amount required"
      );

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/api/invoices/create",
        {
          clientEmail: email,

          clientName:
            name || null,

          clientPhone:
            phone || null,

          amount:
            Number(amount),

          dueDate:
            new Date(),

          mode,
        }
      );

      toast.success(
        "Invoice created successfully"
      );

      window.location.href =
        "/products/invoice-recovery/invoices";

    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to create invoice"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex items-start justify-between flex-wrap gap-5">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
              <Sparkles size={14} />
              Smart Recovery Invoice
            </div>

            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Create Invoice
            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl leading-7">
              Create invoices, automate payment reminders,
              and recover outstanding payments faster.
            </p>

          </div>

          <div className="hidden lg:flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4">

            <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Recovery Enabled
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Email + WhatsApp + SMS ready
              </p>
            </div>

          </div>

        </div>

        {/* MAIN */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* FORM */}

          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">

            {/* CLIENT */}

            <div className="p-8 border-b border-gray-100">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Client Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Add customer billing details
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Client Name
                  </label>

                  <div className="relative">

                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Client Email
                  </label>

                  <div className="relative">

                    <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="email"
                      placeholder="client@email.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Client Phone
                  </label>

                  <div className="relative">

                    <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="text"
                      placeholder="+1 555 000 000"
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

                {/* AMOUNT */}

                <div>

                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Invoice Amount
                  </label>

                  <div className="relative">

                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input
                      type="number"
                      placeholder="1000"
                      value={amount}
                      onChange={(e) =>
                        setAmount(
                          e.target.value
                        )
                      }
                      className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* AUTOMATION */}

            <div className="p-8">

              <div className="mb-6">

                <h2 className="text-xl font-semibold text-gray-900">
                  Recovery Workflow
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Configure how reminders should be handled
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* MANUAL */}

                <button
                  onClick={() =>
                    setMode("manual")
                  }
                  className={`border rounded-3xl p-6 text-left transition-all ${
                    mode === "manual"
                      ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold text-lg text-gray-900">
                        Manual Recovery
                      </h3>

                      <p className="text-sm text-gray-500 mt-2 leading-6">
                        Send reminders manually from the dashboard.
                      </p>

                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        mode ===
                        "manual"
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      }`}
                    />

                  </div>

                </button>

                {/* AUTO */}

                <button
                  onClick={() =>
                    setMode("auto")
                  }
                  className={`border rounded-3xl p-6 text-left transition-all ${
                    mode === "auto"
                      ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold text-lg text-gray-900">
                        Auto Recovery
                      </h3>

                      <p className="text-sm text-gray-500 mt-2 leading-6">
                        Trigger automated reminder workflows and recovery sequences.
                      </p>

                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        mode ===
                        "auto"
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      }`}
                    />

                  </div>

                </button>

              </div>

            </div>

            {/* FOOTER */}

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">

              <a
                href="/products/invoice-recovery/invoices"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition"
              >
                Cancel
              </a>

              <button
                onClick={create}
                disabled={loading}
                className="h-12 px-7 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold transition disabled:opacity-60 flex items-center gap-2"
              >

                {loading
                  ? "Creating..."
                  : "Create Invoice"}

                {!loading && (
                  <ArrowRight className="w-4 h-4" />
                )}

              </button>

            </div>

          </div>

          {/* SIDE PANEL */}

          <div className="space-y-5">

            {/* INFO */}

            <div className="bg-black text-white rounded-3xl p-6 overflow-hidden relative">

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

              <div className="relative z-10">

                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>

                <h3 className="text-xl font-semibold">
                  Smart Recovery Enabled
                </h3>

                <p className="text-sm text-gray-300 leading-7 mt-4">
                  Automatically recover unpaid invoices using:
                </p>

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    Email reminders
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    WhatsApp follow-ups
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    SMS nudges
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    AI recovery workflows
                  </div>

                </div>

              </div>

            </div>

            {/* TIP */}

            <div className="bg-white border border-gray-200 rounded-3xl p-6">

              <h3 className="font-semibold text-gray-900">
                Recovery Tip
              </h3>

              <p className="text-sm text-gray-500 leading-7 mt-3">
                Invoices with automated reminders typically recover payments
                faster than manually managed invoices.
              </p>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}