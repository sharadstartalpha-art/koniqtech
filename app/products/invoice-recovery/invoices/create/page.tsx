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

      <div className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="max-w-2xl mx-auto">

          {/* HEADER */}

          <div className="mb-8">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>

              <div>

                <h1 className="text-4xl font-bold text-gray-900">
                  Create Invoice
                </h1>

                <p className="text-gray-500 mt-1">
                  Send invoices with automated recovery workflows
                </p>

              </div>

            </div>

          </div>

          {/* CARD */}

          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">

            {/* FORM */}

            <div className="p-8 border-b border-gray-100">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* NAME */}

                <div>

                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
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

                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
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

                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
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

              </div>

              {/* AMOUNT */}

              <div className="mt-6">

                <label className="text-sm font-semibold text-gray-700 mb-2 block">
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
                    className="w-full h-14 border border-gray-300 rounded-2xl pl-11 pr-4 text-lg font-semibold outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition"
                  />

                </div>

              </div>

            </div>

            {/* REMINDER MODE */}

            <div className="p-8">

              <h2 className="text-lg font-semibold text-gray-900">
                Reminder Automation
              </h2>

              <p className="text-sm text-gray-500 mt-1 mb-6">
                Configure how reminders should be sent
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* MANUAL */}

                <button
                  onClick={() =>
                    setMode("manual")
                  }
                  className={`border rounded-3xl p-6 text-left transition-all ${
                    mode === "manual"
                      ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                      : "border-gray-200"
                  }`}
                >

                  <h3 className="font-semibold text-lg">
                    Manual
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Send reminders manually
                  </p>

                </button>

                {/* AUTO */}

                <button
                  onClick={() =>
                    setMode("auto")
                  }
                  className={`border rounded-3xl p-6 text-left transition-all ${
                    mode === "auto"
                      ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                      : "border-gray-200"
                  }`}
                >

                  <h3 className="font-semibold text-lg">
                    Auto Recovery
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Automatically trigger workflows
                  </p>

                </button>

              </div>

            </div>

            {/* FOOTER */}

            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">

              <a
                href="/products/invoice-recovery/invoices"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </a>

              <button
                onClick={create}
                disabled={loading}
                className="h-12 px-7 rounded-2xl bg-black hover:bg-gray-900 text-white font-semibold transition disabled:opacity-60"
              >
                {loading
                  ? "Creating..."
                  : "Create Invoice"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}