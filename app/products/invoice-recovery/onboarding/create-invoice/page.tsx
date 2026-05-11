"use client";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import Layout from "@/components/Layout";

import {
  Mail,
  DollarSign,
  User,
  ArrowRight,
} from "lucide-react";

export default function OnboardingCreateInvoicePage() {

  const [clientName, setClientName] =
    useState("");

  const [clientEmail, setClientEmail] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const createInvoice =
    async () => {

      if (
        !clientEmail ||
        !amount
      ) {

        toast.error(
          "Client email and amount required"
        );

        return;
      }

      try {

        setLoading(true);

        await axios.post(
          "/api/onboarding/create-invoice",
          {
            clientName,
            clientEmail,
            amount,
          }
        );

        toast.success(
          "Invoice created"
        );

        window.location.href =
          "/products/invoice-recovery/onboarding";

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

          <div className="mb-8">

            <h1 className="text-4xl font-bold text-gray-900">
              Create First Invoice
            </h1>

            <p className="text-gray-500 mt-2">
              Start recovering payments with your first invoice.
            </p>

          </div>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

            <div className="p-8 space-y-6">

              {/* NAME */}

              <div>

                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Client Name
                </label>

                <div className="relative">

                  <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                  <input
                    value={clientName}
                    onChange={(e) =>
                      setClientName(
                        e.target.value
                      )
                    }
                    placeholder="John Doe"
                    className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4"
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
                    value={clientEmail}
                    onChange={(e) =>
                      setClientEmail(
                        e.target.value
                      )
                    }
                    placeholder="client@email.com"
                    className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4"
                  />

                </div>

              </div>

              {/* AMOUNT */}

              <div>

                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Amount
                </label>

                <div className="relative">

                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    placeholder="1000"
                    className="w-full h-12 border border-gray-300 rounded-2xl pl-11 pr-4"
                  />

                </div>

              </div>

            </div>

            <div className="px-8 py-6 border-t bg-gray-50 flex justify-end">

              <button
                onClick={createInvoice}
                disabled={loading}
                className="h-12 px-6 rounded-2xl bg-black text-white font-semibold flex items-center gap-2"
              >

                {loading
                  ? "Creating..."
                  : "Create Invoice"}

                <ArrowRight className="w-4 h-4" />

              </button>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}